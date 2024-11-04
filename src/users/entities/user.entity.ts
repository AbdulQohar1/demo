import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: string;

  @Column() name: string;

  @Column({ unique: true })
  email: string;

  // @Exclude()
  // @Column({ select: false })
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  // constructor(partial: Partial<User>) {
  //   Object.assign(this ,partial);
  // }
}
