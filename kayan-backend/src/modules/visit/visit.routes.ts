import { Router } from 'express';

import { validate } from '@/middleware/validator';
import { requireAuth } from '@/lib/jwt';

import { visitValidators } from './visit.validators';
import { scan, scanLookup } from './visit.controller';

const router = Router();

// Unauthenticated — returning-customer recognition. Rate-limited by IP inside
// the controller (see visit.service#recordLookupAndCheckLimits).
router.post(
  '/scan/lookup',
  validate(visitValidators.scanLookup),
  scanLookup,
);

// Accepts either the 5-minute scan token from /scan/lookup OR a long-lived
// session token from a previous OTP verification.
router.post(
  '/scan',
  requireAuth(['scan', 'session']),
  validate(visitValidators.scan),
  scan,
);

export const visitRoutes = router;
