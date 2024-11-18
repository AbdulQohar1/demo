import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  OneToMany, 
  BeforeInsert,
  CreateDateColumn
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

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
  @Column(
    {nullable: true},
    // { select: false }
  )
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  // @BeforeInsert()
  // async hashPassword() {
  //   if (this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }

  @Column({
    type: 'enum', enum: UserRole, default: UserRole.USER
  }) 
  role: UserRole;

  constructor(partial: Partial<User>) {
    Object.assign(this ,partial);
  }
}
