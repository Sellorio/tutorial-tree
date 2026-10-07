import { resolve, sep } from 'node:path'

const clientDirectory = resolve(import.meta.dir, 'dist/client')
const clientPrefix = `${clientDirectory}${sep}`
const serverModule = (await import(
  new URL('./dist/server/server.js', import.meta.url).href
)) as { default: { fetch: (request: Request) => Response | Promise<Response> } }
const app = serverModule.default

Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  async fetch(request) {
    const pathname = new URL(request.url).pathname
    if (pathname !== '/') {
      const assetPath = resolve(
        clientDirectory,
        `.${decodeURIComponent(pathname)}`,
      )
      if (assetPath.startsWith(clientPrefix)) {
        const file = Bun.file(assetPath)
        if (await file.exists()) {
          return new Response(file, {
            headers: {
              'Cache-Control': pathname.startsWith('/assets/')
                ? 'public, max-age=31536000, immutable'
                : 'public, max-age=3600',
            },
          })
        }
      }
    }
    return app.fetch(request)
  },
})
