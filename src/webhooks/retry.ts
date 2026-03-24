import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function retryFailedWebhooks() {
  const failed = await prisma.webhook.findMany({ where: { status: 'failed' } });
  console.log('Retrying', failed.length, 'failed webhooks');
  for (const wh of failed) {
    console.log('Retrying webhook:', wh.id, 'url:', wh.url);
    // retry logic
  }
}
