
import { Controller, UseGuards } from '@nestjs/common';
import { 
  Crud, 
  CrudAuth,
  CrudController, 
} from '@dataui/crud';
import {User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../decorators/decorators';
import { Roles } from '../decorators/decorators';
import {RolesGuard} from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Crud({
  model: {
    type: User
  },
  query: {
    alwaysPaginate: true,
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto
  },
  routes: {
    getOneBase: {
      decorators: []
    },
    getManyBase: {
      decorators: []
    },
    createOneBase: {
      decorators: [
        Public(),
      ]    
    },
    updateOneBase: {
      decorators: [
        UseGuards(JwtAuthGuard, RolesGuard),
        Roles(UserRole.USER, UserRole.ADMIN)
      ]
    },
    deleteOneBase: {
      decorators: [
        UseGuards(JwtAuthGuard, RolesGuard),
        Roles(UserRole.USER, UserRole.ADMIN)
      ]
    }
  }
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
  
  get base(): CrudController<User> {
    return this;
  }  
}
