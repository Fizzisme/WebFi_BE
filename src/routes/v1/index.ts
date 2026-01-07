import { Hono } from 'hono';
import memberRoute from './memberRoute.ts';

const APIs_V1 = new Hono();

APIs_V1.route('/member', memberRoute);

export default APIs_V1;
