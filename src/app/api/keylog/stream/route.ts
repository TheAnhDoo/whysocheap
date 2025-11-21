import { NextRequest } from 'next/server'
import { realtimeBus } from '@/lib/postgres-database'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(payload))
      }

      // Send an initial comment to establish the stream
      controller.enqueue(encoder.encode(': connected\n\n'))

      const onKeylog = (keylog: unknown) => {
        send('keylog', keylog)
      }

      realtimeBus.on('keylog', onKeylog)

      // Heartbeat to keep connections alive on some proxies
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': ping\n\n'))
      }, 15000)

      return () => {
        clearInterval(heartbeat)
        realtimeBus.off('keylog', onKeylog)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
