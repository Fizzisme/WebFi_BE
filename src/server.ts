import { Hono } from 'hono';
import { logger } from 'hono/logger';
import APIs_V1 from './routes/v1';
import { connectDB } from './config/db.ts';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { graphQLServer } from './graphql';

const app = new Hono();

await connectDB();

app.use(logger());

app.use(
    cors({
        origin: 'http://localhost:3000',
        allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
        allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        maxAge: 600,
        credentials: true,
    }),
);

// Endpoint grapQLAPI
app.use('/graphql', graphQLServer);

app.route('/v1', APIs_V1);

app.get('/', (c) => c.text('Hono!'));

app.onError((err, c) => {
    console.error(`${err}`); // Log lỗi ra server console để debug

    // Nếu là lỗi chủ động ném ra bằng HTTPException
    if (err instanceof HTTPException) {
        return c.json(
            {
                status: 'error',
                message: err.message,
            },
            err.status,
        );
    }

    // Các lỗi không xác định (DB crash, code lỗi logic...) -> Trả về 500
    return c.json(
        {
            status: 'error',
            message: 'Internal Server Error',
        },
        500,
    );
});

export default {
    port: 8080,
    fetch: app.fetch,
};
