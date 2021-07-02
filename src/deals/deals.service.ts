import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { Deal } from './entities/deal.entity';
import { DealResponseInterface } from './types/dealResponse.interface';
import { DealsResponseInterface } from './types/dealsResponseInterface';
import {
  DeleteResult,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class DealsService {

  constructor(
    @InjectRepository(Deal)
    private readonly dealsRepository: Repository<Deal>
  ) { }

  async create(
    createItemDto: CreateDealDto
  ): Promise<Deal> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.dealsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Deal();
    Object.assign(item, createItemDto);
    return this.dealsRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ deals: Deal[], dealsCount: number }> {
    const tableName = 'deals';
    const queryBuilder = getRepository(Deal).createQueryBuilder(tableName);
    queryBuilder.leftJoinAndSelect(`${tableName}.dealtype`, 'dealtypes');
    queryBuilder.leftJoinAndSelect(`${tableName}.client`, 'clients');
    queryBuilder.leftJoinAndSelect(`${tableName}.workerUser`, 'users');
    queryBuilder.leftJoinAndSelect(`${tableName}.doneUser`, 'users');



    // Поля таблицы, по которым можно фильтровать.
    // Если имя поля в URL и в таблице различается,
    // то используем массив [имя_поля_в_URL, имя_поля_в_таблице]
    const columnsToSearch = [
      'description',
      'start_datetime',
      'end_datetime',
      'done_datetime',
      'amount',
      ['dealtype_id', 'dealtypeId'],
      ['done_user_id', 'doneUserId'],
      ['worker_user_id', 'workerUserId'],
      ['client_id', 'clientId'],
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
    const dealsCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    // console.log(queryBuilder.getQueryAndParameters())
    const deals = await queryBuilder.getMany();
    return { deals, dealsCount }
  }

  async findOne(
    id: number
  ): Promise<Deal> {
    const deal = await this.dealsRepository.findOne(
      id,
      { relations: ['dealtype', 'client', 'workerUser', 'doneUser'] }
    );
    if (!deal) {
      throw new HttpException(
        'Deal not found',
        HttpStatus.NOT_FOUND
      );
    }
    return deal;
  }

  async update(
    id: number,
    updateDealDto: UpdateDealDto
  ): Promise<Deal> {
    const deal = await this.findOne(id);
    Object.assign(deal, updateDealDto);
    return this.dealsRepository.save(deal);
  }

  async remove(id: number): Promise<DeleteResult> {
    const deal = await this.findOne(id);
    return this.dealsRepository.delete(deal.id);
  }

  buildDealResponse(
    deal: Deal
  ): DealResponseInterface {
    return { deal }
  }

  buildDealsResponse(
    deals: Deal[],
    dealsCount: number
  ): DealsResponseInterface {
    return { deals, dealsCount }
  }

}
