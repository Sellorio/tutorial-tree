import { createFileRoute } from '@tanstack/react-router'
import { getCurrentUserFn } from '../shared/server/serverFunctions'
import { getInviteFn } from '../shared/server/inviteFunctions'
import { InvitePage } from '../pages/auth/InvitePage/InvitePage'

export const Route = createFileRoute('/invite')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : '',
  }),
  loaderDeps: ({ search }) => ({ code: search.code }),
  loader: async ({ deps }) => {
    const [user, invite] = await Promise.all([
      getCurrentUserFn(),
      deps.code
        ? getInviteFn({ data: { code: deps.code } })
        : Promise.resolve({
            error: 'This invitation is invalid or has expired.',
            diagramName: '',
            registrationAvailable: false,
          }),
    ])
    return { user, invite }
  },
  component: InvitePage,
})
