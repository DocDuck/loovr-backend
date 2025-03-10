# Loovr backend: Keycloak Express App

## Как запустить?

1. Клонируем:

```bash
git clone https://github.com/DocDuck/loovr-backend
```

2. Создаем и конфигурирукм .env:

````dosini
DB_HOST=postgres
DB_PORT=5432
DB_USER=loovr
DB_PASSWORD=secret
DB_NAME=loovr
FRONTEND_URL=https://localhost:5173
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=loovr-realm
KEYCLOAK_SECRET=sovershenno-sekretno

3. Запускаем прило в docker-compose:

```bash
docker-compose up --build
````

4. Создаем новый реалм в кейклоке

- Переходим в кейклок по адресу http://keycloak:8080
- Создаем реалм, например loovr-realm
  ![alt text](image-4.png)

5. Создаем новый клиент приложения в кейклоке
   ![alt text](image-5.png)
   ![alt text](image-2.png)
   ![alt text](image-1.png)
   ![alt text](image-7.png)

6. Добавляем тестового пользователя
   ![alt text](image-6.png)

7. TODO На фронте реализуем авторизацию кейклока используя эти настройки
