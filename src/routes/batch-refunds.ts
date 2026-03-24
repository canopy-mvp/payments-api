import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function batchRefundRoutes(app: any) {
  app.post('/v1/refunds/batch', async (req: any, reply: any) => {
    const { refunds } = req.body as any;
    console.log('Processing batch of', refunds.length, 'refunds');
    const results = [];
    for (const r of refunds) {
      const refund = await prisma.refund.create({
        data: { chargeId: r.charge_id, amount: r.amount, reason: r.reason, status: 'pending' },
      });
      console.log('Created refund', refund.id, 'for charge', r.charge_id);
      results.push(refund);
    }
    return reply.status(201).send({ data: results });
  });
}
