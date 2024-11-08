
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
import { Roles } from '../decorators/decorators';
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
      decorators: [
        UseGuards(JwtAuthGuard, RolesGuard),
        Roles(UserRole.USER, UserRole.ADMIN)
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
@CrudAuth({
  property: 'user',
  // Admins can modify all posts; others only their own.
  persist: (user: User) => ({ authorId: user.id }), 
  // Automatically set the author ID on create
  filter: (user: User) => {
    if (user && user.role === UserRole.ADMIN) {
      return {};
    }
    return { authorId: user?.id };
    
    // (user.role === UserRole.ADMIN ? {} : { authorId: user.id }), 
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
// @Controller('posts')
// export class PostsController implements CrudController<Post> {
//   constructor(public service: PostsService) {}
// }

