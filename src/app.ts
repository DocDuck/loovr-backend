import 'reflect-metadata';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import express from 'express';
import fileUpload from 'express-fileupload';
import { createKeycloakInstance, sessionConfig } from './config/keycloak';
import { AppDataSource } from './config/data-source';
import boardRoutes from './routes/board.routes';
import userRoutes from './routes/user.routes';

AppDataSource.initialize().then(() => {
  const app = express();

  // Middleware
  const corsOptions ={
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // access-control-allow-credentials:true
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ["Authorization"], // если фронтенд читает кастомные заголовки
  }
  app.use(cors(corsOptions));
  // Обработка предварительных OPTIONS-запросов
  app.options('*', cors(corsOptions));
  // Для всех роутов
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.use(session(sessionConfig));
  // Keycloak middlewares
  const keycloak = createKeycloakInstance({
    realm: 'loovr-realm',
    'auth-server-url': process.env.KEYCLOAK_URL!,
    resource: 'loovr',
    'bearer-only': true,
    'ssl-required': 'none',// 'external',
    'confidential-port': 0,
  })
  app.use(keycloak.middleware());
  // TODO разобраться почему access denied app.use(keycloak.protect());
  app.use(express.json());
  app.use(fileUpload());
  
  // Статические файлы
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Routes
  app.use('/boards', boardRoutes);
  app.use('/users', userRoutes);

  // Обработка ошибок
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}).catch(error => {
  console.error('Database initialization failed', error);
  process.exit(1);
});