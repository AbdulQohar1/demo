import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudRequest, GetManyDefaultResponse } from '@dataui/crud';
import { DeepPartial } from 'typeorm';

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
}
