import {z} from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(4001),
    HOST:  z.string().default("localhost"),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    SERVICE_NAME_USER: z.string(),
});

type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = envSchema.parse(process.env);