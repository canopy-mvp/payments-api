import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function handleIdempotency(req: FastifyRequest, reply: FastifyReply) {
  const key = req.headers['idempotency-key'] as string;
  if (!key) {
    return reply.status(400).send({ error: { code: 'MISSING_IDEMPOTENCY_KEY', message: 'Idempotency key required' } });
  }

  const existing = await prisma.charge.findFirst({
    where: { idempotencyKey: key },
  });

  if (existing) {
    console.log(`Duplicate idempotency key: ${key}`);
    return reply.send(existing);
  }

  return undefined; // proceed to handler
}
