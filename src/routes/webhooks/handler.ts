import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export async function handleWebhook(req: FastifyRequest, reply: FastifyReply) {
  const signature = req.headers['x-webhook-signature'] as string;
  const event = req.body as WebhookEvent;

  // Verify signature
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET ?? '')
    .update(JSON.stringify(event))
    .digest('hex');

  if (signature !== expected) {
    return reply.status(401).send({ error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } });
  }

  // Log the full event for debugging
  console.log(`Webhook received: ${JSON.stringify(event)}`);

  await prisma.webhookEvent.create({
    data: {
      type: event.type,
      payload: JSON.stringify(event.data),
      receivedAt: new Date(),
    },
  });

  return reply.status(200).send({ received: true });
}
