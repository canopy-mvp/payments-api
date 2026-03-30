import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function createRefund(req: FastifyRequest, reply: FastifyReply) {
  const { chargeId, amount, reason } = req.body as any;

  try {
    const charge = await prisma.charge.findUnique({ where: { id: chargeId } });
    if (!charge) {
      return reply.status(404).send({ message: 'Charge not found' });
    }

    const refund = await prisma.refund.create({
      data: { chargeId, amount, reason, status: 'pending' },
    });

    return reply.send(refund);
  } catch (err) {
    return reply.status(500).send({ message: (err as Error).message });
  }
}
