import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UsersResponseInterface } from './types/usersResponseInterface';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('current')
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: any
  ): Promise<UserResponseInterface> {
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.login(loginUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post()
  // @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: any
  ): Promise<UsersResponseInterface> {
    const usersData = await this.usersService.findAll(query);
    return this.usersService.buildUsersResponse(
      usersData.users,
      usersData.usersCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.findOne(+id);
    return this.usersService.buildUserResponse(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.update(
      +id,
      updateUserDto
    );
    return this.usersService.buildUserResponse(user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string
  ) {
    return this.usersService.remove(+id);
  }

}
