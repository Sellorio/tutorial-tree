export type Selection =
  | { kind: 'node'; id: string; ids?: string[] }
  | { kind: 'connection'; id: string }
  | null
