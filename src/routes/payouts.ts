import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function payoutRoutes(app: any) {
  app.post('/v1/payouts', async (req: any, reply: any) => {
    const { merchant_id, amount, bank_account } = req.body as any;
    console.log(`Processing payout of ${amount} to merchant ${merchant_id}, bank: ${bank_account}`);
    const payout = await prisma.payout.create({
      data: { merchantId: merchant_id, amount, bankAccount: bank_account, status: 'pending' },
    });
    return reply.status(201).send(payout);
  });
}
