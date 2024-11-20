import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException    } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService extends TypeOrmCrudService<Post>{
  constructor (
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>, 
  ) {
    super (postsRepository)
  }

  // fetch a post by id with authorization check
  async findAuthorizedPost(postId: string, userId: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: postId},
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('You are not authorized to access this post')
    }

    return post;
  };

  // update a post if the user is the creator
  // async updatePost(postId: string, userId: string, updateData: Partial<Post>): Promise<Post> {
  //   const post = await this.findAuthorizedPost(postId, userId);

  //   Object.assign(post, updateData);
  //   return this.postsRepository.save(post);
  // } 
  async updatePost(postId: string, userId: string, updateData: Partial<Post>) {
    const post = await this.postsRepository.findOne({
      where: { id: postId, user: { id: userId } },
      relations: ['user'],
    });

    if (!post) {
      throw new UnauthorizedException('You are not authorized to update this post');
    }

    // update the post with new data
    Object.assign(post, updateData);
    return this.postsRepository.save(post);
  }

  // delete post if the user is the creator
  async deletePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: {id: postId, user: {id: userId}},
    });

    if (!post) {
      throw new UnauthorizedException('You are not authorized to delete this post');
    };

    return this.postsRepository.remove(post)
    // const post = await this.findAuthorizedPost(postId, userId);

    // await this.postsRepository.remove(post);

    // return post
  }
}
