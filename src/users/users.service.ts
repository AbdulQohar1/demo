import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudRequest, GetManyDefaultResponse } from '@dataui/crud';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo)
  }
  
  async createOne(req: any, dto: DeepPartial<User>): Promise<User> {
   if (dto.password) {
     const salt = await bcrypt.genSalt(10);
       dto.password = await bcrypt.hash(dto.password, salt);
    }
    return super.createOne(req, dto);
  }

  // async register(req: any, dto: DeepPartial<User>): Promise<User> {

  //   const password = dto.password;
    
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   return this.repo.save({
  //     ...dto, password: hashedPassword 
  //   });
  // }

  // async validateUser(email: string, password: string) :Promise<User | null> {
  //   const user = await this.repo.findOne({where: {email} });
    
  //   if (user && await bcrypt.compare(password, user.password)) {
  //     return user
  //   }
  //   return null
  // }
  

  // async register(createUserDto: CreateUserDto): Promise<User> {
  //   const {password} = createUserDto;

  //   con
  // }
}
