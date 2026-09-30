import type { CurveFieldProps } from './CurveFieldProps'
import { useId } from 'react'
import { connectionCurve } from '../../../shared/model/connectionCurve'
import { nodeCenter } from '../../../shared/Canvas/geometry/nodeCenter'
import styles from './CurveField.module.css'

export function CurveField({
  diagram,
  connection,
  onConnection,
}: CurveFieldProps) {
  const modeId = useId()
  const automatic = connection.curveAngle === undefined
  const source = diagram.nodes.find((node) => node.id === connection.source)!
  const target = diagram.nodes.find((node) => node.id === connection.target)!
  const angle = Math.round(
    connection.curveAngle ??
      connectionCurve(
        nodeCenter(source),
        nodeCenter(target),
        connection.clockwise,
      ).angle,
  )
  const updateAngle = (value: number) => {
    if (Number.isFinite(value))
      onConnection({
        ...connection,
        curveAngle: Math.max(0, Math.min(60, value)),
      })
  }
  return (
    <fieldset className={styles.field}>
      <legend>Curve size</legend>
      <div className={styles.modes}>
        <label className={styles.mode}>
          <input
            aria-label="Automatic curve"
            name={modeId}
            type="radio"
            checked={automatic}
            onChange={() =>
              onConnection({ ...connection, curveAngle: undefined })
            }
          />
          <span>Automatic</span>
        </label>
        <label className={styles.mode}>
          <input
            aria-label="Manual curve"
            name={modeId}
            type="radio"
            checked={!automatic}
            onChange={() => updateAngle(angle)}
          />
          <span>Manual</span>
        </label>
      </div>
      <div className={styles.angleRow}>
        <span>Angle</span>
        <label className={styles.number}>
          <input
            aria-label="Curve angle in degrees"
            type="number"
            min={0}
            max={60}
            step={1}
            disabled={automatic}
            value={angle}
            onChange={(event) => updateAngle(event.target.valueAsNumber)}
          />
          <span>deg</span>
        </label>
      </div>
      <div className={styles.slider}>
        <input
          aria-label="Curve angle"
          type="range"
          min={0}
          max={60}
          step={1}
          disabled={automatic}
          value={angle}
          onChange={(event) => updateAngle(Number(event.target.value))}
        />
        <div className={styles.limits}>
          <span>0 deg</span>
          <span>60 deg</span>
        </div>
      </div>
    </fieldset>
  )
}
