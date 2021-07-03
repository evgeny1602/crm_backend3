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
  FindManyOptions,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class EventsService {

  private readonly columnsToSearch = [
    'description',
    'start_datetime',
    'process_datetime',
    ['eventtype_id', 'eventtypeId'],
    ['client_id', 'clientId'],
    ['deal_id', 'dealId'],
    ['task_id', 'taskId'],
    ['processuser_id', 'processUserId'],
  ];

  private readonly relations: string[] = [
    'eventtype',
    'client',
    'task',
    'deal',
    'user',
    'processUser'
  ];

  constructor(@InjectRepository(Event) private readonly eventsRepository: Repository<Event>) { }

  async create(createItemDto: CreateEventDto): Promise<Event> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.eventsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(msg, HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }
    const item = new Event();
    Object.assign(item, createItemDto);
    return this.eventsRepository.save(item);
  }

  async findAll(query: any): Promise<{ events: Event[], eventsCount: number }> {
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
    const eventsCount = await this.eventsRepository.count(findConfig);
    findConfig.skip = query.offset ? query.offset : 0;
    findConfig.take = query.limit ? query.limit : 10;
    const events = await this.eventsRepository.find(findConfig);
    return { events, eventsCount }
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne(
      id,
      { relations: this.relations }
    );
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<DeleteResult> {
    const event = await this.findOne(id);
    return this.eventsRepository.delete(event.id);
  }

  buildEventResponse(event: Event): EventResponseInterface {
    return { event }
  }

  buildEventsResponse(events: Event[], eventsCount: number): EventsResponseInterface {
    return { events, eventsCount }
  }

}
