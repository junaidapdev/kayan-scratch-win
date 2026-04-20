import { Router } from 'express';
import { validate } from '@/middleware/validator';
import { requireAdmin } from '@/middleware/requireAdmin';
import { adminAuthValidators } from './auth.validators';
import * as auth from './auth.controller';

const router = Router();

// Public — no auth required. Issues the admin JWT.
router.post('/login', validate(adminAuthValidators.login), auth.login);

// Authenticated — everything below requires a valid admin token.
router.post('/logout', requireAdmin(), auth.logout);
router.get('/me', requireAdmin(), auth.me);

export { router as adminAuthRoutes };
