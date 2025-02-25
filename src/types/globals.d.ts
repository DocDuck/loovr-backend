import { Grant, Token } from 'keycloak-connect';

declare global {
  namespace Express {
    interface Request {
      kauth: {
        grant?: Grant;
      }
    }
  }
}

declare module 'keycloak-connect' {
  interface Token {
    content: {
      sub: string;
      email?: string;
      given_name?: string;
      family_name?: string;
    };
  }
}