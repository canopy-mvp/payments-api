import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

interface BatchRefundBody {
  refunds: Array<{
    chargeId: string;
    amount: number;
    reason: string;
  }>;
}

export async function batchRefund(req: FastifyRequest, reply: FastifyReply) {
  const { refunds } = req.body as BatchRefundBody;

  console.log(`Processing batch refund: ${refunds.length} items`);

  const results = [];
  for (const item of refunds) {
    const charge = await prisma.charge.findUnique({ where: { id: item.chargeId } });
    if (!charge) {
      results.push({ chargeId: item.chargeId, status: 'failed', reason: 'Charge not found' });
      continue;
    }

    const refund = await prisma.refund.create({
      data: { chargeId: item.chargeId, amount: item.amount, reason: item.reason, status: 'pending' },
    });

    results.push({ chargeId: item.chargeId, refundId: refund.id, status: 'created' });
  }

  return reply.send({ results });
}
