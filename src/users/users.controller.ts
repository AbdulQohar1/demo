
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth,
  CrudController, 
} from '@dataui/crud';
import {User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Crud({
  model: {
    type: User
  },
  query: {
    exclude: ['password'],
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
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    // id: user.id // Users can only access their own data
    // email: user.email
  })
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }
}

