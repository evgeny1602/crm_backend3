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
import { CreateTasktypeDto } from './dto/create-tasktype.dto';
import { UpdateTasktypeDto } from './dto/update-tasktype.dto';
import { Tasktype } from './entities/tasktype.entity';
import { TasktypeResponseInterface } from './types/tasktypeResponse.interface';
import { TasktypesResponseInterface } from './types/tasktypesResponse.interface';

@Injectable()
export class TasktypesService {

  constructor(
    @InjectRepository(Tasktype)
    private readonly tasktypesRepository: Repository<Tasktype>
  ) { }

  async create(
    createTasktypeDto: CreateTasktypeDto
  ): Promise<Tasktype> {
    const uniqueColumns = ['name'];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createTasktypeDto[column];
      const item = await this.tasktypesRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Tasktype();
    Object.assign(item, createTasktypeDto);
    return this.tasktypesRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ tasktypes: Tasktype[], tasktypesCount: number }> {
    const tableName = 'tasktypes';
    const queryBuilder = getRepository(Tasktype).createQueryBuilder(tableName);

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
    const tasktypesCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    console.log(queryBuilder.getQueryAndParameters())
    const tasktypes = await queryBuilder.getMany();
    return { tasktypes, tasktypesCount }
  }

  async findOne(id: number): Promise<Tasktype> {
    const tasktype = await this.tasktypesRepository.findOne(id);
    if (!tasktype) {
      throw new HttpException(
        'Tasktype not found',
        HttpStatus.NOT_FOUND
      );
    }
    return tasktype;
  }

  async update(
    id: number,
    updateTasktypeDto: UpdateTasktypeDto
  ): Promise<Tasktype> {
    const tasktype = await this.findOne(id);
    Object.assign(tasktype, updateTasktypeDto);
    return this.tasktypesRepository.save(tasktype);
  }

  async remove(id: number): Promise<DeleteResult> {
    const tasktype = await this.findOne(id);
    return this.tasktypesRepository.delete(tasktype.id);
  }

  buildTasktypeResponse(
    tasktype: Tasktype
  ): TasktypeResponseInterface {
    return { tasktype }
  }

  buildTasktypesResponse(
    tasktypes: Tasktype[],
    tasktypesCount: number
  ): TasktypesResponseInterface {
    return {
      tasktypes,
      tasktypesCount
    }
  }

}
