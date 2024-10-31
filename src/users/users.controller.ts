
import { Controller } from '@nestjs/common';
import { Crud, 
  CrudController, 
  CrudRequest, 
  ParsedRequest,
  GetManyDefaultResponse, 
} from '@dataui/crud';
import {User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Crud({
  model: {
    type: User
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto
  },
  routes: {
    only: [
      'createOneBase', 
      'getOneBase', 
      'getManyBase', 
      'updateOneBase', 
      'deleteOneBase'
    ] 
  },
})
@ApiTags('users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  
  
  // @ApiOperation({ summary: 'Get a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the user with the provided id',
  //   type: User,
  // })
  // getOneBase(req: CrudRequest): Promise<User> {
  //   return this.base.getOneBase(req)
  // };

  // @ApiOperation({ summary: 'Get all users' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns all users',
  //   type: User,
  // })
  // getManyBase(req: CrudRequest): Promise<GetManyDefaultResponse<User> | User[]> {
  //   return this.base.getManyBase(req)
  // };

  // @ApiOperation({ summary: 'Creates a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the created user',
  //   type: User,
  // })
  // createOneBase(req: CrudRequest, dto: User): Promise<User> {
  //   return this.base.createOneBase(req , dto)
  // };

  // @ApiOperation({ summary: 'Update a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the updated user',
  //   type: User,
  // })
  // updateOneBase(req: CrudRequest, dto: Partial<User>): Promise<User> {
  //   return this.base.updateOneBase(req, dto)
  // };

  // @ApiOperation({ summary: 'deletes a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the deleted user',
  //   type: User,
  // })
  // deleteOneBase(req: CrudRequest): Promise<void | User> {
  //   return this.base.deleteOneBase(req)
  // }
}

