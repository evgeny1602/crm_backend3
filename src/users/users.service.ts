import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JWT_SECRET } from 'src/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';
import { UsersResponseInterface } from './types/usersResponseInterface';
import { DeleteResult, getRepository, Repository } from 'typeorm';

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

  async create(createItemDto: CreateUserDto): Promise<User> {
    const uniqueColumns = ['login', 'email'];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.usersRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(msg, HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }
    const item = new User();
    Object.assign(item, createItemDto);
    return this.usersRepository.save(item);
  }

  async findAll(query: any): Promise<{ users: User[], usersCount: number }> {
    const queryBuilder = getRepository(User).createQueryBuilder('users');
    const usersCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`users.${order}`, orderType);
    const users = await queryBuilder.getMany();
    return {
      users: users,
      usersCount: usersCount
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.findOne(id);
    return await this.usersRepository.delete(id);
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

  buildUsersResponse(users: User[], usersCount: number): UsersResponseInterface {
    let usersArr = [];
    for (let user of users) {
      delete user.password;
      usersArr.push(
        {
          ...user,
          token: this.generateJwt(user)
        }
      );
    };
    return {
      users: usersArr,
      usersCount: usersCount
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
