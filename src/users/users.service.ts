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
  // hash password 
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // Method to find a user by email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Method to create a new user
  async create(userData: Partial<User>): Promise<User> {
    // hash password before saving user
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }



  // async createOne(req: CrudRequest, dto: DeepPartial<User>): Promise<User> {
  //  if (dto.password) {
  //    const salt = await bcrypt.genSalt(10);
  //      dto.password = await bcrypt.hash(dto.password, salt);
  //   }
  //   return super.createOne(req, dto);
  // }

  // async register(req: any, dto: DeepPartial<User>): Promise<User> {

  //   const password = dto.password;
    
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   return this.repo.save({
  //     ...dto, password: hashedPassword 
  //   });
  // }

}
