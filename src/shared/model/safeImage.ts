export function safeImage(value: string) {
  return (
    !value ||
    /^data:image\/(png|jpeg|webp|gif);base64,[a-z\d+/=\s]+$/i.test(value) ||
    /^https?:\/\//i.test(value) ||
    /^\/(?!\/)/.test(value)
  )
}
