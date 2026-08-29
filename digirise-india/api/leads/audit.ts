import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Create a new ratelimiter, that allows 3 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '10 s'),
});

const auditSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal('')),
  budget: z.string().min(1, "Please select a budget"),
  goals: z.string().max(1000).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate Limiting based on IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { success } = await ratelimit.limit(`audit_${ip}`);
    
    if (!success) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Validate Input
    const validatedData = auditSchema.parse(req.body);

    // Save to Postgres Database via Prisma
    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.website,
        type: 'Audit',
        message: `Budget: ${validatedData.budget} | Goals: ${validatedData.goals}`,
        source: 'Homepage PWA'
      }
    });

    // Send Notification Email to Admin
    if (process.env.NOTIFY_EMAIL && process.env.FROM_EMAIL) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: process.env.NOTIFY_EMAIL,
        subject: `[New Lead] Audit Request from ${validatedData.name}`,
        html: `
          <h2>New Audit Request</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone || 'N/A'}</p>
          <p><strong>Website:</strong> ${validatedData.website || 'N/A'}</p>
          <p><strong>Budget:</strong> ${validatedData.budget}</p>
          <p><strong>Goals:</strong> ${validatedData.goals || 'N/A'}</p>
        `
      });
    }

    // Return Success
    return res.status(200).json({ success: true, id: lead.id });
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Audit Lead Error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
