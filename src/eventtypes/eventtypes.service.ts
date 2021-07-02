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
import { CreateEventtypeDto } from './dto/create-eventtype.dto';
import { UpdateEventtypeDto } from './dto/update-eventtype.dto';
import { Eventtype } from './entities/eventtype.entity';
import { EventtypeResponseInterface } from './types/eventtypeResponse.interface';
import { EventtypesResponseInterface } from './types/eventtypesResponse.interface';

@Injectable()
export class EventtypesService {

  constructor(
    @InjectRepository(Eventtype)
    private readonly eventtypesRepository: Repository<Eventtype>
  ) { }

  async create(
    createEventtypeDto: CreateEventtypeDto
  ): Promise<Eventtype> {
    const uniqueColumns = ['name'];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createEventtypeDto[column];
      const item = await this.eventtypesRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Eventtype();
    Object.assign(item, createEventtypeDto);
    return this.eventtypesRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ eventtypes: Eventtype[], eventtypesCount: number }> {
    const tableName = 'Eventtypes';
    const queryBuilder = getRepository(Eventtype).createQueryBuilder(tableName);

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
    const eventtypesCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    console.log(queryBuilder.getQueryAndParameters())
    const eventtypes = await queryBuilder.getMany();
    return { eventtypes, eventtypesCount }
  }

  async findOne(id: number): Promise<Eventtype> {
    const eventtype = await this.eventtypesRepository.findOne(id);
    if (!eventtype) {
      throw new HttpException(
        'Eventtype not found',
        HttpStatus.NOT_FOUND
      );
    }
    return eventtype;
  }

  async update(
    id: number,
    updateEventtypeDto: UpdateEventtypeDto
  ): Promise<Eventtype> {
    const eventtype = await this.findOne(id);
    Object.assign(eventtype, updateEventtypeDto);
    return this.eventtypesRepository.save(eventtype);
  }

  async remove(id: number): Promise<DeleteResult> {
    const eventtype = await this.findOne(id);
    return this.eventtypesRepository.delete(eventtype.id);
  }

  buildEventtypeResponse(
    eventtype: Eventtype
  ): EventtypeResponseInterface {
    return { eventtype }
  }

  buildEventtypesResponse(
    eventtypes: Eventtype[],
    eventtypesCount: number
  ): EventtypesResponseInterface {
    return {
      eventtypes,
      eventtypesCount
    }
  }

}
