import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User} from './users/entities/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Post } from './posts/entities/post.entity';
import { PostsModule } from './posts/posts.module';
// import { PostsModule } from './posts/posts.module';

@Module({
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    }
  ],
  imports: [
    ConfigModule.forRoot(
      { isGlobal: true},
    ),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        entities: [Post, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PostsModule,
  ],
})
export class AppModule {}
