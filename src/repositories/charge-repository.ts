import { PrismaClient } from '@prisma/client';

interface CreateChargeInput {
  merchantId: string;
  amount: number;
  currency: string;
  description: string;
  metadata: Record<string, string>;
}

export class ChargeRepository {
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateChargeInput) {
    return this.prisma.charge.create({
      data: {
        merchantId: input.merchantId,
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        metadata: input.metadata,
        status: 'pending',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.charge.findUnique({ where: { id } });
  }
}
