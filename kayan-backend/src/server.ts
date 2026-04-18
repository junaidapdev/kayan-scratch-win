import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { apiSuccess } from '@/lib/apiResponse';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ALLOWED_ORIGINS,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response): void => {
    res.json(apiSuccess({ status: 'ok' }));
  });

  // Feature routers mount here as they are built, e.g.:
  // app.use('/customers', customersRouter);
  // app.use('/visits', visitsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function start(): void {
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info('Kayan backend listening', {
      port: env.PORT,
      env: env.NODE_ENV,
    });
  });
}

// Only start the HTTP listener when this file is the entry point. This keeps
// createApp() importable from tests without side effects.
if (require.main === module) {
  start();
}
