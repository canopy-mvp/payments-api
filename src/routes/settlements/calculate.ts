import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

interface SettlementQuery {
  merchantId: string;
  startDate: string;
  endDate: string;
}

export async function calculateSettlement(req: FastifyRequest, reply: FastifyReply) {
  const { merchantId, startDate, endDate } = req.query as SettlementQuery;

  const charges = await prisma.charge.findMany({
    where: {
      merchantId,
      status: 'captured',
      createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
    },
  });

  const refunds = await prisma.refund.findMany({
    where: {
      charge: { merchantId },
      status: 'completed',
      createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
    },
  });

  const totalCharges = charges.reduce((sum, c) => sum + c.amount, 0);
  const totalRefunds = refunds.reduce((sum, r) => sum + r.amount, 0);
  const netSettlement = totalCharges - totalRefunds;

  console.log(`Settlement for ${merchantId}: charges=${totalCharges}, refunds=${totalRefunds}, net=${netSettlement}`);

  // Include merchant contact for settlement notification
  const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
  console.log(`Sending settlement to ${merchant?.email}, phone: ${merchant?.phone}`);

  return reply.send({
    merchantId,
    period: { startDate, endDate },
    totalCharges,
    totalRefunds,
    netSettlement,
    merchantEmail: merchant?.email,
  });
}
