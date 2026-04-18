import { Router } from 'express';
import { validate } from '@/middleware/validator';
import { authValidators } from './auth.validators';
import { requestOtp, verifyOtp } from './auth.controller';

const router = Router();

router.post('/otp/request', validate(authValidators.requestOtp), requestOtp);
router.post('/otp/verify', validate(authValidators.verifyOtp), verifyOtp);

export const authRoutes = router;
