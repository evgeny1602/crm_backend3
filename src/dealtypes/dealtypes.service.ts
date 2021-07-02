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
import { CreateDealtypeDto } from './dto/create-dealtype.dto';
import { UpdateDealtypeDto } from './dto/update-dealtype.dto';
import { Dealtype } from './entities/dealtype.entity';
import { DealtypeResponseInterface } from './types/dealtypeResponse.interface';
import { DealtypesResponseInterface } from './types/dealtypesResponse.interface';

@Injectable()
export class DealtypesService {

  constructor(
    @InjectRepository(Dealtype)
    private readonly dealtypesRepository: Repository<Dealtype>
  ) { }

  async create(
    createDealtypeDto: CreateDealtypeDto
  ): Promise<Dealtype> {
    const uniqueColumns = ['name'];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createDealtypeDto[column];
      const item = await this.dealtypesRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Dealtype();
    Object.assign(item, createDealtypeDto);
    return this.dealtypesRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ dealtypes: Dealtype[], dealtypesCount: number }> {
    const tableName = 'Dealtypes';
    const queryBuilder = getRepository(Dealtype).createQueryBuilder(tableName);

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
    const dealtypesCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    console.log(queryBuilder.getQueryAndParameters())
    const dealtypes = await queryBuilder.getMany();
    return { dealtypes, dealtypesCount }
  }

  async findOne(id: number): Promise<Dealtype> {
    const dealtype = await this.dealtypesRepository.findOne(id);
    if (!dealtype) {
      throw new HttpException(
        'Dealtype not found',
        HttpStatus.NOT_FOUND
      );
    }
    return dealtype;
  }

  async update(
    id: number,
    updateDealtypeDto: UpdateDealtypeDto
  ): Promise<Dealtype> {
    const dealtype = await this.findOne(id);
    Object.assign(dealtype, updateDealtypeDto);
    return this.dealtypesRepository.save(dealtype);
  }

  async remove(id: number): Promise<DeleteResult> {
    const dealtype = await this.findOne(id);
    return this.dealtypesRepository.delete(dealtype.id);
  }

  buildDealtypeResponse(
    dealtype: Dealtype
  ): DealtypeResponseInterface {
    return { dealtype }
  }

  buildDealtypesResponse(
    dealtypes: Dealtype[],
    dealtypesCount: number
  ): DealtypesResponseInterface {
    return {
      dealtypes,
      dealtypesCount
    }
  }

}
