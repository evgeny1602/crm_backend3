import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  getRepository,
  Repository
} from 'typeorm';
import { CreateUsergroupDto } from './dto/create-usergroup.dto';
import { UpdateUsergroupDto } from './dto/update-usergroup.dto';
import { Usergroup } from './entities/usergroup.entity';
import { UsergroupResponseInterface } from './types/usergroupResponse.interface';
import { UsergroupsResponseInterface } from './types/usergroupsResponse.interface';

@Injectable()
export class UsergroupsService {

  constructor(
    @InjectRepository(Usergroup)
    private readonly usergroupsRepository: Repository<Usergroup>
  ) { }

  async create(
    createUsergroupDto: CreateUsergroupDto
  ): Promise<Usergroup> {
    const uniqueColumns = ['name'];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createUsergroupDto[column];
      const item = await this.usergroupsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Usergroup();
    Object.assign(item, createUsergroupDto);
    return this.usergroupsRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ usergroups: Usergroup[], usergroupsCount: number }> {
    const tableName = 'usergroups';
    const queryBuilder = getRepository(Usergroup).createQueryBuilder(tableName);

    // Поля таблицы, по которым можно фильтровать.
    // Если имя поля в URL и в таблице различается,
    // то используем массив [имя_поля_в_URL, имя_поля_в_таблице]
    const columnsToSearch = ['name'];
    for (let column of columnsToSearch) {
      const c_0: string = Array.isArray(column) ? column[0] : column;
      const c_1: string = Array.isArray(column) ? column[1] : column;
      if (query[c_0]) {
        let filterConfig = {};
        filterConfig[c_0] = `%${query[c_0]}%`;
        queryBuilder.andWhere(`${tableName}.${c_1} LIKE :${c_0}`, filterConfig);
      }
    }
    const usergroupsCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    console.log(queryBuilder.getQueryAndParameters())
    const usergroups = await queryBuilder.getMany();
    return { usergroups, usergroupsCount }
  }

  async findOne(id: number): Promise<Usergroup> {
    const usergroup = await this.usergroupsRepository.findOne(id);
    if (!usergroup) {
      throw new HttpException(
        'Usergroup not found',
        HttpStatus.NOT_FOUND
      );
    }
    return usergroup;
  }

  async update(
    id: number,
    updateUsergroupDto: UpdateUsergroupDto
  ): Promise<Usergroup> {
    const usergroup = await this.findOne(id);
    Object.assign(usergroup, updateUsergroupDto);
    return this.usergroupsRepository.save(usergroup);
  }

  async remove(id: number): Promise<DeleteResult> {
    const usergroup = await this.findOne(id);
    return this.usergroupsRepository.delete(usergroup.id);
  }

  buildUsergroupResponse(
    usergroup: Usergroup
  ): UsergroupResponseInterface {
    return { usergroup }
  }

  buildUsergroupsResponse(
    usergroups: Usergroup[],
    usergroupsCount: number
  ): UsergroupsResponseInterface {
    return {
      usergroups,
      usergroupsCount
    }
  }

}
