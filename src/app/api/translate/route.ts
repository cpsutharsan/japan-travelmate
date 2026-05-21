import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSupabaseServer } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SYSTEM = `You translate spoken or typed English into natural, polite restaurant- and travel-Japanese for a vegetarian Indian family travelling in Japan with a 4-year-old.

Hard rules:
- Always respond with valid JSON matching the schema. No prose outside the JSON.
- "ja" must be polite (です/ます form) and culturally natural for the situation.
- "romaji" must use Hepburn romanization with macrons (ā, ī, ū, ē, ō).
- "context_note" is a brief English hint (≤ 20 words) about cultural nuance, only when useful — otherwise empty string.
- If the input asks about vegetarian / Jain food, default to the strict form: no meat, fish, eggs, dashi, bonito flakes, fish sauce, seafood extract.
- Keep translations concise — they will be shown on a phone and possibly spoken aloud at counters.`

export async function POST(req: Request) {
  // Require auth — only the family can spend tokens.
  const supa = getSupabaseServer()
  if (supa) {
    const { data: { user } } = await supa.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })

  let body: { text?: string; jain?: boolean }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }) }
  const text = (body.text || '').trim()
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })
  if (text.length > 600) return NextResponse.json({ error: 'text too long' }, { status: 400 })

  const userPayload = body.jain
    ? `Translate this to polite Japanese (also no onion or garlic — Jain): ${text}`
    : `Translate this to polite Japanese: ${text}`

  const client = new Anthropic({ apiKey: key })

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPayload }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              ja: { type: 'string', description: 'The translation in Japanese' },
              romaji: { type: 'string', description: 'Hepburn romanization with macrons' },
              context_note: { type: 'string', description: 'Brief English nuance hint, or empty' },
            },
            required: ['ja', 'romaji', 'context_note'],
          },
        },
      },
    } as any)

    const textBlock = message.content.find((b: any) => b.type === 'text') as any
    if (!textBlock) return NextResponse.json({ error: 'no text in response' }, { status: 502 })

    let parsed: { ja: string; romaji: string; context_note: string }
    try { parsed = JSON.parse(textBlock.text) }
    catch { return NextResponse.json({ error: 'invalid JSON from model', raw: textBlock.text }, { status: 502 }) }

    return NextResponse.json({
      ...parsed,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    })
  } catch (e: any) {
    if (e instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'rate limited — try again in a moment' }, { status: 429 })
    }
    if (e instanceof Anthropic.APIError) {
      return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
    }
    return NextResponse.json({ error: e?.message ?? 'unknown error' }, { status: 500 })
  }
}
