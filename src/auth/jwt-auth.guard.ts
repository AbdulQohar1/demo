import { 
  Injectable, 
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import * as jwt from 'jsonwebtoken';
import { AuthService } from "./auth.service";
import { User } from '../users/entities/user.entity';
// import { ConfigService } from '@nestjs/config';
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    // private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // verify token in AuthService
      const user = await this.authService.verifyToken(token);

      if (!user) throw new UnauthorizedException('Invalid user');
      // Add user to request object for @CrudAuth to use
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
  
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// async verifyToken (token: string): Promise<User> {
//   const jwtSecret = this.configService.get<string>('JWT_SECRET');
//   const decoded = jwt.verify(token, jwtSecret)
  
//   return decoded as User;

// }