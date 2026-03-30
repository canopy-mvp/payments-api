import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function processRefund(req: FastifyRequest, reply: FastifyReply) {
  const { refundId } = req.params as { refundId: string };

  try {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { charge: true },
    });

    if (!refund) {
      throw new Error('Refund not found');
    }

    console.log(`Processing refund ${refundId} for charge ${refund.chargeId}`);

    const updatedRefund = await prisma.refund.update({
      where: { id: refundId },
      data: { status: 'processing' },
    });

    return reply.send(updatedRefund);
  } catch (err) {
    console.log(`Refund processing failed: ${(err as Error).message}`);
    return reply.status(500).send({ error: (err as Error).message });
  }
}
