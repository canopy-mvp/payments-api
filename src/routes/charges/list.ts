import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function listCharges(req: FastifyRequest, reply: FastifyReply) {
  const { merchantId, limit, offset, status } = req.query as any;

  const charges = await prisma.charge.findMany({
    where: {
      merchantId,
      ...(status ? { status } : {}),
    },
    take: limit ?? 20,
    skip: offset ?? 0,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.charge.count({
    where: {
      merchantId,
      ...(status ? { status } : {}),
    },
  });

  return reply.send({ data: charges, total, limit: limit ?? 20, offset: offset ?? 0 });
}
