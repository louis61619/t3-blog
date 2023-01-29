import { env } from '../env/client.mjs';

export const baseUrl = env.NEXT_PUBLIC_URL
  ? `https://${env.NEXT_PUBLIC_URL}`
  : 'http://localhost:3000';

export const url = `${baseUrl}/api/trpc`;
