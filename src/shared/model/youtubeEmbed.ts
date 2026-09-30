export function youtubeEmbed(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '')
    const id =
      host === 'youtu.be'
        ? url.pathname.slice(1)
        : ['youtube.com', 'youtube-nocookie.com'].includes(host)
          ? (url.searchParams.get('v') ??
            url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1])
          : null
    return id && /^[\w-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null
  } catch {
    return null
  }
}
