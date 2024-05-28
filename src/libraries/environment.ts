import { TypeCompiler } from '@sinclair/typebox/compiler';
import { t } from 'elysia';

const environmentSchema = t.Object({
  port: t.Number(),
  resend: t.String(),
});

const environment = TypeCompiler.Compile(environmentSchema).Decode({
  port: Number(Bun.env.PORT) || 3001,
  resend: Bun.env.RESEND_API,
});

export default environment;
