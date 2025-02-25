import 'reflect-metadata';
import path from 'path';
import session from 'express-session';
import express from 'express';
import fileUpload from 'express-fileupload';
import { keycloak, sessionConfig } from './config/keycloak';
import { AppDataSource } from './config/data-source';
import boardRoutes from './routes/board.routes';
import userRoutes from './routes/user.routes';

AppDataSource.initialize().then(() => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(session(sessionConfig));
  app.use(fileUpload());
  app.use(keycloak.middleware());
  
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