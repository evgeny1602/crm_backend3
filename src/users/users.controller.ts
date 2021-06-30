import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Get('current')
  async currentUser(@User() user: any): Promise<UserResponseInterface> {
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new BackendValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.login(loginUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post()
  @UsePipes(new BackendValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.buildUserResponse(user)
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

}
