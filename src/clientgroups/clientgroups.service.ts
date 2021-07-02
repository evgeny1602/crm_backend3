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
import { CreateClientgroupDto } from './dto/create-clientgroup.dto';
import { UpdateClientgroupDto } from './dto/update-clientgroup.dto';
import { Clientgroup } from './entities/clientgroup.entity';
import { ClientgroupResponseInterface } from './types/clientgroupResponse.interface';
import { ClientgroupsResponseInterface } from './types/clientgroupsResponse.interface';

@Injectable()
export class ClientgroupsService {

  constructor(
    @InjectRepository(Clientgroup)
    private readonly clientgroupsRepository: Repository<Clientgroup>
  ) { }

  async create(
    createClientgroupDto: CreateClientgroupDto
  ): Promise<Clientgroup> {
    const uniqueColumns = ['name'];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createClientgroupDto[column];
      const item = await this.clientgroupsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Clientgroup();
    Object.assign(item, createClientgroupDto);
    return this.clientgroupsRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ clientgroups: Clientgroup[], clientgroupsCount: number }> {
    const tableName = 'clientgroups';
    const queryBuilder = getRepository(Clientgroup).createQueryBuilder(tableName);

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
    const clientgroupsCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    console.log(queryBuilder.getQueryAndParameters())
    const clientgroups = await queryBuilder.getMany();
    return { clientgroups, clientgroupsCount }
  }

  async findOne(id: number): Promise<Clientgroup> {
    const usergroup = await this.clientgroupsRepository.findOne(id);
    if (!usergroup) {
      throw new HttpException(
        'Clientgroup not found',
        HttpStatus.NOT_FOUND
      );
    }
    return usergroup;
  }

  async update(
    id: number,
    updateClientgroupDto: UpdateClientgroupDto
  ): Promise<Clientgroup> {
    const usergroup = await this.findOne(id);
    Object.assign(usergroup, updateClientgroupDto);
    return this.clientgroupsRepository.save(usergroup);
  }

  async remove(id: number): Promise<DeleteResult> {
    const usergroup = await this.findOne(id);
    return this.clientgroupsRepository.delete(usergroup.id);
  }

  buildClientgroupResponse(
    clientgroup: Clientgroup
  ): ClientgroupResponseInterface {
    return { clientgroup }
  }

  buildClientgroupsResponse(
    clientgroups: Clientgroup[],
    clientgroupsCount: number
  ): ClientgroupsResponseInterface {
    return {
      clientgroups,
      clientgroupsCount
    }
  }

}
