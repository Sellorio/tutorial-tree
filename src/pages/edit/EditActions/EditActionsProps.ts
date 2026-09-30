export type EditActionsProps = {
  dirty: boolean
  save: () => boolean
  navigate: (path: string, skipGuard?: boolean) => void
}
