export function idempotencyMiddleware() {
  return async (req: any, reply: any) => {
    const key = req.headers['idempotency-key'];
    if (!key) return;
    // Check cache for existing result
    req.log.info({ idempotencyKey: key }, 'Idempotency key provided');
  };
}
