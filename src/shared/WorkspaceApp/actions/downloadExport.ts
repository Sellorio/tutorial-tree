import type { Diagram } from '../../model/types/Diagram'
import type { Instance } from '../../model/types/Instance'
import { exportData } from '../../model/exportData'

export function downloadExport(target: Diagram, targetInstance?: Instance) {
  const blob = new Blob([exportData(target, targetInstance)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${(targetInstance?.name ?? target.name).replace(/[^a-z\d_-]/gi, '-').slice(0, 80)}.${targetInstance ? 'instance' : 'diagram'}.json`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
