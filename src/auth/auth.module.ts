import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') }
      })
    }),
    JwtModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtAuthGuard, 
  ],
  exports: [
    AuthService, 
     JwtAuthGuard
    ]
})
export class AuthModule {}
