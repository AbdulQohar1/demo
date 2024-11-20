import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; 
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // user registration with password hashing
  async register( createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, role } = createUserDto

    // check if user already exists in the db
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user with the hashed password
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  // login and validate user credentials
  async validateUser(email: string, password: string): Promise<any> {

    // check if user credentials is provided
	if (!email || !password) {
		throw new BadRequestException('Please provide email and password')
	};
    // find user using the repository from usersService
    const user = await this.userRepository.findOne({
      where: {email},
      // select: ['id', 'email' , 'password', 'role']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Login attempt:');
    console.log('Email:', email);
    console.log('Provided password:', password);
    console.log('Stored hashed password:', user.password);
    
    // Verify password using bcrypt
    try {
      console.log('Attempting password verification...');
  
      const isPasswordValid = await bcrypt.compare(
        password, user.password
      );
      console.log('Password verification result:', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      };
  
      // generate JWT token
      const token = this.generateToken(user)
  
      // return user encrypted details
      return {email: user.email, access_token: token}
    } catch (error) {
      console.error('Password comparison error:', error);
      throw new UnauthorizedException('Error verifying credentials')
    }

    
  }
  
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    console.log('Token Payload:', payload);
    return this.jwtService.sign(payload);
  };



  async  verifyToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      console.log('Verified Token Payload:', payload);

      const user = await this.userRepository.findOne({
        where: {id: payload.sub},
        // select: ['id', 'email', 'role'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error)
     {
      console.error('Token Verification Error:', error);
      throw new UnauthorizedException('Invalid token')
    }
  }
}
