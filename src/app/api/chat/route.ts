import Anthropic from '@anthropic-ai/sdk'
import { getSupabaseServer } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/lib/trip-context'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

type IncomingPart =
  | { type: 'text'; text: string }
  | { type: 'image'; mediaType: string; dataBase64: string }

type IncomingMessage = {
  role: 'user' | 'assistant'
  content: string | IncomingPart[]
}

export async function POST(req: Request) {
  const supa = getSupabaseServer()
  if (supa) {
    const { data: { user } } = await supa.auth.getUser()
    if (!user) return new Response('unauthorized', { status: 401 })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return new Response('ANTHROPIC_API_KEY not configured', { status: 500 })

  let body: { messages?: IncomingMessage[] }
  try { body = await req.json() } catch { return new Response('invalid json', { status: 400 }) }
  const incoming = body.messages
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return new Response('messages[] required', { status: 400 })
  }
  if (incoming.length > 60) {
    return new Response('conversation too long', { status: 400 })
  }

  // Normalize to Anthropic SDK shape
  const messages = incoming.map((m): Anthropic.MessageParam => {
    if (typeof m.content === 'string') {
      return { role: m.role, content: m.content }
    }
    const blocks = m.content.map((p): Anthropic.ContentBlockParam => {
      if (p.type === 'image') {
        return {
          type: 'image',
          source: { type: 'base64', media_type: p.mediaType as any, data: p.dataBase64 },
        }
      }
      return { type: 'text', text: p.text }
    })
    return { role: m.role, content: blocks }
  })

  const client = new Anthropic({ apiKey: key })

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: buildSystemPrompt(),
        // Cache the trip context across requests — saves ~80% on repeated turns.
        cache_control: { type: 'ephemeral' },
      },
    ],
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    messages,
  } as any)

  // Convert the SDK stream to a plain text SSE for the browser. We only forward
  // text deltas — thinking blocks are kept internal.
  const encoder = new TextEncoder()
  const body$ = new ReadableStream({
    async start(controller) {
      try {
        stream.on('text', (delta: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`))
        })
        const final = await stream.finalMessage()
        controller.enqueue(encoder.encode(`event: end\ndata: ${JSON.stringify({
          stop_reason: final.stop_reason,
          usage: final.usage,
        })}\n\n`))
        controller.close()
      } catch (e: any) {
        const msg = e instanceof Anthropic.APIError ? e.message : (e?.message ?? 'unknown error')
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: msg })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(body$, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
