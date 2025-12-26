import { Hono } from 'hono';
import { registerSchema, loginSchema } from '../../validations/memberValidation.ts';
import { zValidator } from '@hono/zod-validator';
import { memberController } from '../../controllers/memberController.ts';

const memberRoute = new Hono();

memberRoute.post('/register', zValidator('json', registerSchema), memberController.register);
memberRoute.post('/login', zValidator('json', loginSchema), memberController.login);

export default memberRoute;
