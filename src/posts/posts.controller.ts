import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@dataui/crud';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/decorators';
import { UserRole } from '../users/entities/user.entity';

@Crud({
  model: {
    type: Post,
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    getOneBase: {
      decorators: [], 
    },
    getManyBase: {
      decorators: [],
    },
    createOneBase: {
      decorators: [
        UseGuards(JwtAuthGuard, RolesGuard), 
        Roles(UserRole.USER, UserRole.ADMIN)
      ], // Authenticated users and admins can create
    },
    updateOneBase: {
      decorators: [
        UseGuards(JwtAuthGuard, RolesGuard), 
        Roles(UserRole.USER, UserRole.ADMIN)
      ], // Authenticated users and admins can update
    },
    deleteOneBase: {
      decorators: [
        UseGuards(JwtAuthGuard, RolesGuard), 
        Roles(UserRole.USER, UserRole.ADMIN)
      ], // Authenticated users and admins can delete
    },
  },
})

@Controller('posts')
export class PostsController implements CrudController<Post> {
  constructor(public service: PostsService) {}

  get base(): CrudController<Post> {
    return this;
  }
}
