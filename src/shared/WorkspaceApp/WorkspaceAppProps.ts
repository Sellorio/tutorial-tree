import type { Library } from '../model/types/Library'
import type { PublicUser } from '../server/PublicUser'

export type WorkspaceAppProps = {
  initialLibrary?: Library
  initialError?: string
  initialPath?: string
  user?: PublicUser
}
