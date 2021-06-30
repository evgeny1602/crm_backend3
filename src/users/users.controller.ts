import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UsePipes(new BackendValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.create(createUserDto);
    delete user.password;
    return this.usersService.buildUserResponse(user)
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

}
