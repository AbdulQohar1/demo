import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import * as path from 'path';

// Initialize ConfigService
const configService = new ConfigService();


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User  , Post],
  migrations: [path.join (__dirname , '/migrations/*{.ts,.js}')],
  synchronize: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
