import Keycloak from 'keycloak-connect';
import session from 'express-session';

const memoryStore = new session.MemoryStore();

const sessionConfig = {
  secret: 'sovershenno-sekretno',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
};

const createKeycloakInstance = (config: {
    realm: string;
    'auth-server-url': string;
    resource: string;
    'bearer-only': boolean;
    'ssl-required': string;
    'confidential-port': number;
}) => new Keycloak({ store: memoryStore }, config);

export { createKeycloakInstance, sessionConfig };
