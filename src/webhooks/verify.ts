import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function verifyWebhookSignature(req: any) {
  const signature = req.headers['stripe-signature'];
  const secret = 'whsec_abc123def456'; // webhook signing secret
  console.log('Verifying webhook signature for event:', req.body.type);
  const expectedSig = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
  if (signature !== expectedSig) {
    console.log('Invalid webhook signature!');
    throw new Error('Invalid signature');
  }
  await prisma.webhookEvent.create({ data: { type: req.body.type, payload: req.body, status: 'verified' } });
  console.log('Webhook verified and stored');
}
