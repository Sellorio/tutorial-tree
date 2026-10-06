import { safeImage } from '../../../shared/model/safeImage'
import type { ImageFieldProps } from './ImageFieldProps'
import { uploadImage } from './uploadImage'
import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import styles from './ImageField.module.css'

export function ImageField({
  value,
  onChange,
  onError,
  kind,
}: ImageFieldProps) {
  const uploadRef = useRef<HTMLInputElement>(null)

  return (
    <div className={styles.fields}>
      <label>
        {kind === 'diagram'
          ? 'Diagram image URL'
          : kind === 'background'
            ? 'Background image URL'
            : 'Image URL'}
        <input
          type="url"
          placeholder="https://..."
          value={value.startsWith('data:') ? '' : value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!safeImage(value)}
        />
      </label>
      {!safeImage(value) && (
        <p className={styles.error}>Use an HTTP(S) image URL.</p>
      )}
      {kind === 'diagram' && value && safeImage(value) && (
        <img
          className={styles.coverPreview}
          src={value}
          alt="Diagram cover preview"
        />
      )}
      <div className={styles.row}>
        <button
          className={styles.secondaryButton}
          onClick={() => uploadRef.current?.click()}
        >
          <ImagePlus size={15} />
          {kind === 'diagram'
            ? 'Upload cover'
            : kind === 'background'
              ? 'Upload background'
              : 'Upload image'}
        </button>
        {value && (
          <button
            className={styles.iconButton}
            aria-label={
              kind === 'diagram'
                ? 'Remove cover'
                : kind === 'background'
                  ? 'Remove background image'
                  : 'Remove image'
            }
            title="Remove image"
            onClick={() => onChange('')}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <input
        ref={uploadRef}
        className={styles.hidden}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        aria-label={`Upload ${kind} image`}
        onChange={(event) => {
          uploadImage(event.target.files?.[0], onChange, onError)
          event.target.value = ''
        }}
      />
    </div>
  )
}
