import { Check, Circle, Clock3 } from 'lucide-react'

export const STATUS_OPTIONS = [
  { value: 'unlocked', label: 'Unlocked', icon: Circle },
  { value: 'in-progress', label: 'In progress', icon: Clock3 },
  { value: 'completed', label: 'Completed', icon: Check },
] as const
