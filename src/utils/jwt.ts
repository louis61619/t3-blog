import jwt from 'jsonwebtoken';
import { env } from '../env/server.mjs';

const SECRET = env.JWT_SECRET || 'changeme';

export function signJwt(data: { [key: string]: string }) {
  return jwt.sign(data, SECRET);
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
