import { User } from '@prisma/client';

declare module 'ws' {
  interface WebSocket {
    user: User;
  }
}