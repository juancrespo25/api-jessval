import {z} from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(4001),
    HOST:  z.string().default("localhost"),
    URL_USER: z.string().default("localhost"),
    URL_AUTH: z.string().default("localhost"),
    URL_CUSTOMER: z.string().default("localhost"),
    URL_CENTERCOST: z.string().default("localhost"),
    URL_UBIGEO: z.string().default("localhost"),
    URL_PROVINCE: z.string().default("localhost"),
});

type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = envSchema.parse(process.env);