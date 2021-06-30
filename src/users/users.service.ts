import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JWT_SECRET } from 'src/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(
      {
        login: loginUserDto.login
      },
      {
        select: ['id', 'login', 'password', 'email', 'first_name', 'middle_name', 'last_name', 'is_active', 'image']
      }
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Password is invalid', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userByLogin = await this.usersRepository.findOne({
      login: createUserDto.login
    });
    if (userByLogin) {
      throw new HttpException('Login already exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const userByEmail = await this.usersRepository.findOne({
      email: createUserDto.email
    })
    if (userByEmail) {
      throw new HttpException('Email already exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user = new User();
    Object.assign(user, createUserDto);
    return this.usersRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  buildUserResponse(user: User): UserResponseInterface {
    delete user.password;
    return {
      user: {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }

  generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        login: user.login,
        email: user.email
      },
      JWT_SECRET
    );
  }

}
