import { 
  Injectable, 
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
    // private jwtService: JwtService
    // private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true; 
      // Allow public route access
    }

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
