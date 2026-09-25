import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8000'),
  NEXT_PUBLIC_SOCKET_URL: z.string().url().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Fameo'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://fameo.vip'),
  NEXT_PUBLIC_APP_ORIGIN: z.string().url().default('https://uat-api.fameo.info'),
  NEXT_PUBLIC_PORTAL_MOCK: z.coerce.boolean().default(false),
  NEXT_PUBLIC_MAX_ORDER_INR: z.coerce.number().default(500000),
  NEXT_PUBLIC_LIVEKIT_URL: z.string().url().optional(),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_ORIGIN: z.string().url().default('http://localhost:8000'),
  // One backend since the merge: the products BFF and the main BFF reach the same service.
  PRODUCTS_ORIGIN: z.string().url().default('http://localhost:8000'),
  APP_ORIGIN: z.string().url().default('http://localhost:5001'),
  ASSISTANT_ORIGIN: z.string().url().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_ISSUER: z.string().optional(),
  JWT_AUDIENCE: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
  SMARTAUTH_KEY: z.string().optional(),
  SMARTAUTH_BASE: z.string().url().default('https://prod.smartauth.co'),
  DEV_MODE: z.coerce.boolean().default(true),
  TRUSTED_PROXY_HOPS: z.coerce.number().default(1),
});

const clientEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_ORIGIN: process.env.NEXT_PUBLIC_APP_ORIGIN,
  NEXT_PUBLIC_PORTAL_MOCK: process.env.NEXT_PUBLIC_PORTAL_MOCK,
  NEXT_PUBLIC_MAX_ORDER_INR: process.env.NEXT_PUBLIC_MAX_ORDER_INR,
  NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
};

const parsedClient = clientSchema.safeParse(clientEnvVars);
if (!parsedClient.success) {
  console.error("❌ Invalid client environment variables:", parsedClient.error.format());
  throw new Error("Invalid client environment variables");
}

let serverEnv = {};
if (typeof window === 'undefined') {
  const serverEnvVars = {
    NODE_ENV: process.env.NODE_ENV,
    API_ORIGIN: process.env.API_ORIGIN,
    PRODUCTS_ORIGIN: process.env.PRODUCTS_ORIGIN,
    APP_ORIGIN: process.env.APP_ORIGIN,
    ASSISTANT_ORIGIN: process.env.ASSISTANT_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    SMARTAUTH_KEY: process.env.SMARTAUTH_KEY,
    SMARTAUTH_BASE: process.env.SMARTAUTH_BASE,
    DEV_MODE: process.env.DEV_MODE,
    TRUSTED_PROXY_HOPS: process.env.TRUSTED_PROXY_HOPS,
  };
  
  const parsedServer = serverSchema.safeParse(serverEnvVars);
  if (!parsedServer.success) {
    console.error("❌ Invalid server environment variables:", parsedServer.error.format());
    throw new Error("Invalid server environment variables");
  }
  serverEnv = parsedServer.data;
}

export const env = {
  ...parsedClient.data,
  ...serverEnv,
  // Derived fallbacks
  NEXT_PUBLIC_SOCKET_URL: parsedClient.data.NEXT_PUBLIC_SOCKET_URL || parsedClient.data.NEXT_PUBLIC_API_URL,
};
