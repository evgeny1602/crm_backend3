import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskResponseInterface } from './types/taskResponse.interface';
import { TasksResponseInterface } from './types/tasksResponseInterface';
import {
  DeleteResult,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>
  ) { }

  async create(
    createItemDto: CreateTaskDto
  ): Promise<Task> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.tasksRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Task();
    Object.assign(item, createItemDto);
    return this.tasksRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ tasks: Task[], tasksCount: number }> {
    const tableName = 'tasks';
    const queryBuilder = getRepository(Task).createQueryBuilder(tableName);
    queryBuilder.leftJoinAndSelect(`${tableName}.tasktype`, 'tasktypes');
    queryBuilder.leftJoinAndSelect(`${tableName}.workerUsers`, 'users');
    queryBuilder.leftJoinAndSelect(`${tableName}.masterUser`, 'users');
    queryBuilder.leftJoinAndSelect(`${tableName}.createUser`, 'users');
    queryBuilder.leftJoinAndSelect(`${tableName}.event`, 'events');
    queryBuilder.leftJoinAndSelect(`${tableName}.deal`, 'deals');
    queryBuilder.leftJoinAndSelect(`${tableName}.client`, 'clients');

    // Поля таблицы, по которым можно фильтровать.
    // Если имя поля в URL и в таблице различается,
    // то используем массив [имя_поля_в_URL, имя_поля_в_таблице]
    const columnsToSearch = [
      'description',
      'start_datetime',
      'end_datetime',
      'done_datetime',
      'tasktype',
      ['event_id', 'eventId'],
      ['client_id', 'clientId'],
      ['deal_id', 'dealId'],
      ['master_user_id', 'masterUserId'],
    ];
    for (let column of columnsToSearch) {
      const c_0: string = Array.isArray(column) ? column[0] : column;
      const c_1: string = Array.isArray(column) ? column[1] : column;
      if (query[c_0]) {
        let filterConfig = {};
        filterConfig[c_0] = query[c_0];
        queryBuilder.andWhere(`${tableName}.${c_1}=:${c_0}`, filterConfig);
      }
    }
    const tasksCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    // console.log(queryBuilder.getQueryAndParameters())
    const tasks = await queryBuilder.getMany();
    return { tasks, tasksCount }
  }

  async findOne(
    id: number
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne(
      id,
      { relations: ['tasktype', 'workerUsers', 'masterUser', 'createUser', 'event', 'deal', 'client'] }
    );
    if (!task) {
      throw new HttpException(
        'Task not found',
        HttpStatus.NOT_FOUND
      );
    }
    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<DeleteResult> {
    const task = await this.findOne(id);
    return this.tasksRepository.delete(task.id);
  }

  buildTaskResponse(
    task: Task
  ): TaskResponseInterface {
    return { task }
  }

  buildTasksResponse(
    tasks: Task[],
    tasksCount: number
  ): TasksResponseInterface {
    return { tasks, tasksCount }
  }

}
