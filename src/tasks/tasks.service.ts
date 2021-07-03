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
  FindManyOptions,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class TasksService {

  private readonly columnsToSearch = [
    'description',
    'start_datetime',
    'end_datetime',
    'done_datetime',
    'tasktype',
    ['event_id', 'eventId'],
    ['client_id', 'clientId'],
    ['deal_id', 'dealId'],
    ['master_user_id', 'master_userId'],
  ];

  private readonly relations: string[] = [
    'tasktype',
    'worker_users',
    'master_user',
    'create_user',
    'event',
    'deal',
    'client'
  ];

  constructor(@InjectRepository(Task) private readonly tasksRepository: Repository<Task>) { }

  async create(createItemDto: CreateTaskDto): Promise<Task> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.tasksRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(msg, HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }
    const item = new Task();
    Object.assign(item, createItemDto);
    return this.tasksRepository.save(item);
  }

  async findAll(query: any): Promise<{ tasks: Task[], tasksCount: number }> {
    const order: string = query.order ? query.order : 'id';
    let orderConfig = {};
    orderConfig[order] = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    let findConfig: FindManyOptions = {
      order: orderConfig,
      relations: this.relations
    };
    let whereLines = [];
    for (let column of this.columnsToSearch) {
      const c_0: string = Array.isArray(column) ? column[0] : column;
      const c_1: string = Array.isArray(column) ? column[1] : column;
      if (query[c_0]) {
        let filterConfig = {};
        filterConfig[c_0] = query[c_0];
        let whereLine = {};
        whereLine[c_1] = query[c_0];
        whereLines.push(whereLine);
      }
    }
    if (whereLines.length > 0) {
      findConfig.where = whereLines;
    }
    const tasksCount = await this.tasksRepository.count(findConfig);
    findConfig.skip = query.offset ? query.offset : 0;
    findConfig.take = query.limit ? query.limit : 10;
    const tasks = await this.tasksRepository.find(findConfig);
    return { tasks, tasksCount }
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne(id, { relations: this.relations });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<DeleteResult> {
    const task = await this.findOne(id);
    return this.tasksRepository.delete(task.id);
  }

  buildTaskResponse(task: Task): TaskResponseInterface {
    return { task }
  }

  buildTasksResponse(tasks: Task[], tasksCount: number): TasksResponseInterface {
    return { tasks, tasksCount }
  }

}
