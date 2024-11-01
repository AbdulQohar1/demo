import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; 
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // find user using the repository from usersService
    const user = await this.userRepository.findOne({
      where: {email},
      select: [ 'email' , 'password']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    };

    // generate JWT token
    const token = this.generateToken(user);

    // return user encrypted details
    return { email: user.email, token };
  }
  
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email
    }

    return this.jwtService.sign(payload);
  };

  async  verifyToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        where: {id: payload.sub}
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error)
     {
      throw new UnauthorizedException('Invalid token')
    }
  }


  /*async register(email:string, password: string, dto: DeepPartial<User>): Promise<User> {

    const user = await this.userService.findOne(email)

  //   const password = dto.password;
  
  // const hashedPassword = await bcrypt.hash(password, 10);
  // return this.repo.save({ ...dto, password: hashedPassword })
  return {
    // email: user.email,
    // token: accessToken,
  }
 }
  */
}
