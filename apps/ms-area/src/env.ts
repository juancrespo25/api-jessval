import {z} from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    DB_TYPE: z.string().default("postgres"),
    PORT: z.coerce.number().default(4001),
    HOST:  z.string().default("localhost"),
    DB_PORT: z.coerce.number().default(3306),
    DB_HOST: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASS: z.string().optional(),
    DB_NAME: z.string().optional(),
    DB_SYNC: z.string().optional(),
    DB_LOG: z.string().optional(),
    DB_POOL_SIZE: z.string().optional(),
});

type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = envSchema.parse(process.env);