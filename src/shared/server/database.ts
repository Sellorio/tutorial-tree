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

  CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    registration_ticket TEXT UNIQUE
      REFERENCES registration_tickets(ticket) ON DELETE SET NULL,
    diagram_json TEXT NOT NULL CHECK (json_valid(diagram_json)),
    owner_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    diagram_id TEXT,
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

if (
  !database
    .query("SELECT 1 FROM pragma_table_info('invites') WHERE name = 'owner_id'")
    .get()
)
  database.exec(
    'ALTER TABLE invites ADD COLUMN owner_id TEXT REFERENCES users(id) ON DELETE CASCADE',
  )
if (
  !database
    .query(
      "SELECT 1 FROM pragma_table_info('invites') WHERE name = 'diagram_id'",
    )
    .get()
)
  database.exec('ALTER TABLE invites ADD COLUMN diagram_id TEXT')
database.exec(`
  UPDATE invites SET
    owner_id = COALESCE(owner_id, (
      SELECT created_by FROM registration_tickets
      WHERE ticket = registration_ticket
    )),
    diagram_id = COALESCE(diagram_id, json_extract(diagram_json, '$.id'))
  WHERE owner_id IS NULL OR diagram_id IS NULL;
`)

const inviteLifetime = 14 * 24 * 60 * 60 * 1000

export function cleanExpiredInvites() {
  const cutoff = new Date(Date.now() - inviteLifetime).toISOString()
  database.transaction(() => {
    database
      .query(
        `DELETE FROM registration_tickets
         WHERE ticket IN (
           SELECT registration_ticket FROM invites WHERE created_at <= ?
         )`,
      )
      .run(cutoff)
    database.query('DELETE FROM invites WHERE created_at <= ?').run(cutoff)
  })()
}

cleanExpiredInvites()
const inviteCleanupTimer = setInterval(cleanExpiredInvites, 24 * 60 * 60 * 1000)
inviteCleanupTimer.unref()
