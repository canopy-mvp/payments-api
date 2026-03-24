import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function chargeLookupRoutes(app: any) {
  app.get('/v1/charges/lookup', async (req: any, reply: any) => {
    const { reference_id } = req.query;
    if (!reference_id) {
      return reply.status(400).send({ message: 'reference_id is required' });
    }
    try {
      const charge = await prisma.charge.findFirst({ where: { referenceId: reference_id } });
      if (!charge) {
        return reply.status(404).send({ message: 'Charge not found' });
      }
      return reply.send(charge);
    } catch (err) {
      console.error('Error looking up charge:', err);
      return reply.status(500).send({ message: 'Internal server error', error: String(err) });
    }
  });
}
