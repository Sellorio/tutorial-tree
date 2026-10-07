export type DatabaseUser = {
  id: string
  username: string
  displayName: string
  passwordHash: string
  role: 'admin' | 'user'
  mustChangePassword: number
  createdAt: string
}
