import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventResponseInterface } from './types/eventResponse.interface';
import { EventsResponseInterface } from './types/eventsResponseInterface';
import {
  DeleteResult,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) { }

  async create(
    createItemDto: CreateEventDto
  ): Promise<Event> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.eventsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Event();
    Object.assign(item, createItemDto);
    return this.eventsRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ events: Event[], eventsCount: number }> {
    const tableName = 'events';
    const queryBuilder = getRepository(Event).createQueryBuilder(tableName);
    queryBuilder.leftJoinAndSelect(`${tableName}.eventtype`, 'eventtypes');
    queryBuilder.leftJoinAndSelect(`${tableName}.client`, 'clients');
    queryBuilder.leftJoinAndSelect(`${tableName}.task`, 'tasks');
    queryBuilder.leftJoinAndSelect(`${tableName}.deal`, 'deals');
    queryBuilder.leftJoinAndSelect(`${tableName}.user`, 'users');
    queryBuilder.leftJoinAndSelect(`${tableName}.processUser`, 'users');


    // Поля таблицы, по которым можно фильтровать.
    // Если имя поля в URL и в таблице различается,
    // то используем массив [имя_поля_в_URL, имя_поля_в_таблице]
    const columnsToSearch = [
      'description',
      'start_datetime',
      'process_datetime',
      ['eventtype_id', 'eventtypeId'],
      ['client_id', 'clientId'],
      ['deal_id', 'dealId'],
      ['task_id', 'taskId'],
      ['processuser_id', 'processUserId'],
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
    const eventsCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    // console.log(queryBuilder.getQueryAndParameters())
    const events = await queryBuilder.getMany();
    return { events, eventsCount }
  }

  async findOne(
    id: number
  ): Promise<Event> {
    const event = await this.eventsRepository.findOne(
      id,
      { relations: ['eventtype', 'client', 'task', 'deal', 'user', 'processUser'] }
    );
    if (!event) {
      throw new HttpException(
        'Event not found',
        HttpStatus.NOT_FOUND
      );
    }
    return event;
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto
  ): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<DeleteResult> {
    const event = await this.findOne(id);
    return this.eventsRepository.delete(event.id);
  }

  buildEventResponse(
    event: Event
  ): EventResponseInterface {
    return { event }
  }

  buildEventsResponse(
    events: Event[],
    eventsCount: number
  ): EventsResponseInterface {
    return { events, eventsCount }
  }

}
