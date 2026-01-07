// validations/user.validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(255),
    displayName: z
        .string()
        .min(3)
        .max(255),
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .max(255),
    gender: z.string(),
    country: z.string(),
});

export type IRegister = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .max(255),
});

export type ILogin = z.infer<typeof loginSchema>;

export type IGoogleLogin = {
    email: string;
    name: string;
    image: string;
    provider: string;
    providerId: string;
};
