import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

interface CreateChargeBody {
  amount: number;
  currency: string;
  merchantId: string;
  description?: string;
}

export async function createCharge(req: FastifyRequest, reply: FastifyReply) {
  const { amount, currency, merchantId, description } = req.body as CreateChargeBody;

  console.log(`Creating charge for merchant ${merchantId}, amount: ${amount} ${currency}`);

  const charge = await prisma.charge.create({
    data: {
      amount,
      currency,
      merchantId,
      description: description ?? '',
      status: 'pending',
      idempotencyKey: req.headers['idempotency-key'] as string,
    },
  });

  console.log(`Charge created: ${charge.id}`);

  return reply.status(201).send(charge);
}
