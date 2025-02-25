# Loovr backend: Keycloak Express App

## Как запустить?

1. Клонируем:

```bash
git clone git@github.com:<>.git
```

2. Создаем и онфигурирукм .env: (все креды для входа в кейклок написаны в docker-compose.yml)

```dosini
# SERVER CONFIG
PORT= # PORT OF THE NODE JS SERVER
SERVER_URL= # URL OF THE NODE JS SERVER

# EXPRESS SESSION
SESSION_SECRET= # EXPRESS SESSION SECRET

# KEYCLOAK
KEYCLOAK_REALM= # KEYCLOAK REALM ID
KEYCLOAK_AUTH_SERVER_URL= # KEYCLOAK AUTH SERVER URL
KEYCLOAK_SSL_REQUIRED= # KEYCLOAK SSL REQUIRED
KEYCLOAK_RESOURCE= # KEYCLOAK RESOURCE ID
KEYCLOAK_CREDENTIALS_SECRET= # KEYCLOAK CREDENTIALS SERCRET
KEYCLOAK_CONFIDENTIAL_PORT= # KEYCLOAK CONFIDENTIAL PORT
```

3. Запускаем прило в docker-compose:

```bash
docker-compose up --build
```
