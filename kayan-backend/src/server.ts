import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { apiSuccess } from '@/lib/apiResponse';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/requestLogger';
import { branchRoutes } from '@/modules/branch';
import { authRoutes } from '@/modules/auth';
import { customerRoutes } from '@/modules/customer';
import { visitRoutes } from '@/modules/visit';

export function createApp(): Application {
  const app = express();

  // Trust one reverse-proxy hop so req.ip reflects the real client IP when
  // deployed behind Vercel / Nginx / similar. Tune if you add more hops.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ALLOWED_ORIGINS,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  app.get('/health', (_req: Request, res: Response): void => {
    res.json(apiSuccess({ status: 'ok' }));
  });

  // Feature routers mount here as they are built, e.g.:
  app.use('/branches', branchRoutes);
  app.use('/auth', authRoutes);
  app.use('/customers', customerRoutes);
  app.use('/visits', visitRoutes);

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
