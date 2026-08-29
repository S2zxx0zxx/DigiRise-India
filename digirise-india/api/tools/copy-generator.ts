// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only init redis if env vars are present
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1 d'),
    })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ip = req.headers['x-forwarded-for'] || '127.0.0.1';
    
    if (ratelimit) {
      const { success } = await ratelimit.limit(`copy_gen_${ip}`);
      if (!success) {
        return res.status(429).json({ error: 'Too many requests. Try again tomorrow.' });
      }
    }

    if (!anthropic) {
      // Fallback for development without API key
      return res.status(200).json({
        copies: [
          `[MOCK DATA - Missing API Key]\n\n🚀 Attention ${req.body.targetAudience}!\nStruggling with your current setup? Try ${req.body.productName}.\n\n✅ ${req.body.keyBenefit}\n\nClick here to learn more!`,
          `[MOCK DATA - Missing API Key]\n\nWant ${req.body.keyBenefit}? \nWith ${req.body.productName}, it's never been easier for ${req.body.targetAudience} to succeed.\n\nDM us to start today.`
        ]
      });
    }

    const { productName, targetAudience, keyBenefit } = req.body;

    if (!productName || !targetAudience || !keyBenefit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are a world-class expert digital marketer and copywriter.
Write two different high-converting Facebook/Instagram ad copies for the following:
Product/Service: ${productName}
Target Audience: ${targetAudience}
Key Benefit: ${keyBenefit}

Rules:
1. One copy should be direct and punchy (short-form).
2. The second copy should be story-driven or problem-agitation-solution (PAS) format (long-form).
3. Include emojis where appropriate.
4. Output them separated by '---COPY_SEPARATOR---'. Do not include extra conversational text.`;

    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-haiku-20240307',
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    const copies = content.split('---COPY_SEPARATOR---').map((c: string) => c.trim()).filter(Boolean);

    res.status(200).json({ copies });
  } catch (error) {
    console.error('Copy Generator Error:', error);
    res.status(500).json({ error: 'Failed to generate copy' });
  }
}
