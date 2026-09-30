import type { Status } from '../../../shared/model/types/Status'

export type ActivationFieldProps = {
  value: Exclude<Status, 'locked'>[]
  onChange: (value: Exclude<Status, 'locked'>[]) => void
  disabled?: boolean
  onUseDefaults?: (useDefaults: boolean) => void
}
