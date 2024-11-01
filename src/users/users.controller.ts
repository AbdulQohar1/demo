
import { Controller } from '@nestjs/common';
import { Crud, CrudAuth,
  CrudController, 
  ParsedRequest, CrudRequest
} from '@dataui/crud';
import {User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    
    // only: [
    //   'createOneBase', 
    //   'getOneBase', 
    //   'getManyBase', 
    //   'updateOneBase', 
    //   'deleteOneBase'
    // ] 
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    id: user.id // Users can only access their own data
  })
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }
}

