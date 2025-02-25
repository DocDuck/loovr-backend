import Keycloak from 'keycloak-connect';
import session from 'express-session';

const memoryStore = new session.MemoryStore();

const sessionConfig = {
  secret: 'sovershenno-sekretno',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
};

const keycloakConfig = {
  realm: 'excalidraw',
  'auth-server-url': process.env.KEYCLOAK_URL!,
  resource: 'excalidraw-backend',
  'bearer-only': true,
  'ssl-required': 'external',
  'confidential-port': 0,
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

export { keycloak, sessionConfig };
