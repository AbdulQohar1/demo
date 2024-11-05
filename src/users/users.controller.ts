
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
import {RolesGuard} from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Crud({
  model: {
    type: User
  },
  query: {
    // exclude: ['password'],1
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
      decorators: []
    },
    updateOneBase: {
      decorators: [UseGuards(JwtAuthGuard)]
    },
    deleteOneBase: {
      decorators: [UseGuards(JwtAuthGuard)]
    }
  }
})
// @CrudAuth({
//   property: 'user',
//   filter: (user: User) => ({
//      id: user.id}), //filters by user id
//   persist: (user: User) => ({id: user.id}) 
//   //sets userid on create/update
// })
// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }
}

