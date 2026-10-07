import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dataDirectory = process.env.APP_DATA_DIR ?? join(process.cwd(), 'appdata')

mkdirSync(dataDirectory, { recursive: true })

export const database = new Database(
  join(dataDirectory, 'tutorial-tree.sqlite'),
  {
    create: true,
  },
)

database.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    must_change_password INTEGER NOT NULL DEFAULT 0
      CHECK (must_change_password IN (0, 1)),
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registration_tickets (
    ticket TEXT PRIMARY KEY CHECK (length(ticket) = 6),
    created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS libraries (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    library_json TEXT NOT NULL CHECK (json_valid(library_json)),
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`)
