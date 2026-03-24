# payments-api

## Rules
- Use repository pattern for all database access (no direct Prisma in routes)
- Validate all inputs with Zod schemas
- Use structured logging (req.log) not console.log
- Return structured error format: { error: { code, message } }
- All amounts in smallest currency unit (cents)
