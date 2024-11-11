import { Injectable,   } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity'

@Injectable()
export class PostsService extends TypeOrmCrudService<Post>{
  constructor (
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>, 
  ) {
    super (postsRepository)
  }
}
