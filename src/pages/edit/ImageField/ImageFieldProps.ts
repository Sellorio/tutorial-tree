export type ImageFieldProps = {
  value: string
  onChange: (value: string) => void
  onError: (message: string) => void
  kind: 'node' | 'diagram' | 'background'
}
