import { Controller, UseGuards, Patch, Delete, Body, Param, Req, UnauthorizedException } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@dataui/crud';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/decorators';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../decorators/decorators';

@Crud({
  model: {
    type: Post,
  },
  query: {
    alwaysPaginate: true,
    join: {
      user: {
        eager: true,
        exclude: ['password'],
      }
    }
  },
  routes: {
    getOneBase: {
      decorators: [Public()], 
    },
    getManyBase: {
      decorators: [Public()],
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
// @CrudAuth({
//   property: 'user',
//   persist: (user: any) => ({
//     userId: user.id
//   })
// })

@Controller('posts')
// @UseGuards(JwtAuthGuard)
export class PostsController implements CrudController<Post> {
  constructor(public service: PostsService) {}

  get base(): CrudController<Post> {
    return this;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') postId: string,
    @Req() req,
    @Body() updateData: Partial<Post>
  ) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not found in request');

     // update post
     return this.service.updatePost(postId, userId, updateData);
  };

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') postId: string, @Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not found in request');

    await this.service.deletePost(postId, userId);
    return { message: 'Post deleted successfully' };
  }
}
