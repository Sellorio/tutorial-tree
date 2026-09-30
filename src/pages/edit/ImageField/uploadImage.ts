import type { ImageFieldProps } from './ImageFieldProps'
import { IMAGE_UPLOAD } from './IMAGE_UPLOAD'

export function uploadImage(
  file: File | undefined,
  onChange: ImageFieldProps['onChange'],
  onError: ImageFieldProps['onError'],
) {
  if (!file) return
  if (
    !IMAGE_UPLOAD.types.some((type) => type === file.type) ||
    file.size > IMAGE_UPLOAD.maximumBytes
  ) {
    onError('Choose a PNG, JPEG, WebP or GIF under 1.5 MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = () => onChange(String(reader.result))
  reader.onerror = () => onError('The image could not be read.')
  reader.readAsDataURL(file)
}
