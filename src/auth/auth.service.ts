import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/entities/user.entity'
import {  LoginDto, RegisterDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return {
      message: 'User registered successfully'
    }
  }


  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {email: loginDto.email}
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    };

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    };

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
