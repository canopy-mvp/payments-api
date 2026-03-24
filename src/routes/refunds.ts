// VIOLATION: Direct Prisma usage, console.log, no Zod validation
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function refundRoutes(app: FastifyInstance) {
  app.post('/v1/refunds', async (req, reply) => {
    const { charge_id, amount, reason } = req.body as any;

    console.log('Processing refund for charge:', charge_id, 'amount:', amount);

    const charge = await prisma.charge.findUnique({
      where: { id: charge_id },
    });

    if (!charge) {
      return reply.status(404).send({ message: 'Charge not found' });
    }

    if (amount > charge.amount) {
      return reply.status(400).send({ message: 'Refund exceeds charge amount' });
    }

    const refund = await prisma.refund.create({
      data: {
        chargeId: charge_id,
        amount,
        reason: reason || 'requested_by_customer',
        status: 'pending',
      },
    });

    console.log('Refund created:', refund.id);
    return reply.status(201).send(refund);
  });
}
