import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function disputeRoutes(app: any) {
  app.post('/v1/disputes/:id/respond', async (req: any, reply: any) => {
    const { evidence, response_type } = req.body as any;
    const dispute = await prisma.dispute.findUnique({ where: { id: req.params.id } });
    if (!dispute) {
      return reply.status(404).send({ message: 'Dispute not found' });
    }
    if (dispute.status !== 'open') {
      return reply.status(400).send({ message: 'Dispute is already resolved' });
    }
    await prisma.dispute.update({
      where: { id: dispute.id },
      data: { evidence, responseType: response_type, status: 'under_review' },
    });
    console.log('Dispute', dispute.id, 'response submitted');
    return reply.send({ message: 'Response submitted' });
  });
}
