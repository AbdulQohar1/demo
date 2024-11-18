import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository)
  }

  // Method to find a user by email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Method to create a new user
  // async create(userData: Partial<User>): Promise<User> {
  //   // hash password before saving user
  //   if (userData.password) {
  //     userData.password = await this.hashPassword(userData.password);
  //   }
    
  //   const user = this.usersRepository.create(userData);
  //   return this.usersRepository.save(user);
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('CreateUserDto:', createUserDto);
    
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   console.log('CreateUserDto:', createUserDto);
    
  //   console.log('Original password:', createUserDto.password)
    
  //   // const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  //   // console.log('Hashed password:', hashedPassword);

  //   // const newUser = this.usersRepository.create({
  //     // createUserDto,
  //   //   password: hashedPassword, // Save the hashed password
  //   // });
  //   const newUser = this.usersRepository.create(createUserDto);
    
  //   return this.usersRepository.save(newUser);
  // }
}
