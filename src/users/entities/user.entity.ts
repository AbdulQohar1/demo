import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn() 
  id: string;

  @Column() name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  // @Column({ default: 'user' })
  // role: string;

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
