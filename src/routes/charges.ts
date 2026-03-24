import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ChargeRepository } from '../repositories/charge-repository';

const CreateChargeSchema = z.object({
  merchant_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  description: z.string().max(500),
  metadata: z.record(z.string()).optional(),
});

export async function chargeRoutes(app: FastifyInstance) {
  const chargeRepo = new ChargeRepository(app.prisma);

  app.post('/v1/charges', async (req, reply) => {
    const body = CreateChargeSchema.parse(req.body);
    const charge = await chargeRepo.create({
      merchantId: body.merchant_id,
      amount: body.amount,
      currency: body.currency,
      description: body.description,
      metadata: body.metadata ?? {},
    });
    req.log.info({ chargeId: charge.id }, 'Charge created');
    return reply.status(201).send(charge);
  });
}
