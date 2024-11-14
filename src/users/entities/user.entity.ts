import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  OneToMany, 
  CreateDateColumn
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() 
  id: string;

  @Column() name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum', enum: UserRole, default: UserRole.USER
  }) 
  role: UserRole;

  constructor(partial: Partial<User>) {
    Object.assign(this ,partial);
  }
}
