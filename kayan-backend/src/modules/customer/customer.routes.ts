import { Router } from 'express';
import { validate } from '@/middleware/validator';
import { requireAuth } from '@/lib/jwt';
import { customerValidators } from './customer.validators';
import { registerCustomer, getCustomerProfile } from './customer.controller';

const router = Router();

router.post('/register', requireAuth(['registration']), validate(customerValidators.register), registerCustomer);
router.get('/me', requireAuth(['session']), getCustomerProfile);

export const customerRoutes = router;
