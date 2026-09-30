import { STORAGE_KEY } from '../../model/constants/STORAGE_KEY'
import type { Library } from '../../model/types/Library'

export function saved(): Library {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)!)
}
