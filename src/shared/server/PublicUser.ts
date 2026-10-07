export type PublicUser = {
  id: string
  username: string
  name: string
  role: 'admin' | 'user'
  mustChangePassword: boolean
}
