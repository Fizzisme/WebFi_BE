import { Hono } from 'hono';
import { registerSchema, loginSchema } from '../../validations/memberValidation.ts';
import { zValidator } from '@hono/zod-validator';
import { memberController } from '../../controllers/memberController.ts';
import { jwt } from 'hono/jwt';
import { env } from '../../config/enviroment.ts';
const memberRoute = new Hono();

memberRoute.post('/register', zValidator('json', registerSchema), memberController.register);
memberRoute.post('/login', zValidator('json', loginSchema), memberController.login);
memberRoute.get(
    '/me',
    jwt({
        secret: env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        cookie: 'access_token',
    }),
    memberController.getMembers,
);

export default memberRoute;
