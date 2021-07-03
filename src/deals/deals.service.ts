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
  FindManyOptions,
  Repository
} from 'typeorm';

@Injectable()
export class DealsService {

  private readonly columnsToSearch = [
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

  private readonly relations: string[] = [
    'dealtype',
    'client',
    'workerUser',
    'doneUser'
  ];

  constructor(@InjectRepository(Deal) private readonly dealsRepository: Repository<Deal>) { }

  async create(createItemDto: CreateDealDto): Promise<Deal> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.dealsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(msg, HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }
    const item = new Deal();
    Object.assign(item, createItemDto);
    return this.dealsRepository.save(item);
  }

  async findAll(query: any): Promise<{ deals: Deal[], dealsCount: number }> {
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
    const dealsCount = await this.dealsRepository.count(findConfig);
    findConfig.skip = query.offset ? query.offset : 0;
    findConfig.take = query.limit ? query.limit : 10;
    const deals = await this.dealsRepository.find(findConfig);
    return { deals, dealsCount }
  }

  async findOne(id: number): Promise<Deal> {
    const deal = await this.dealsRepository.findOne(id, { relations: this.relations });
    if (!deal) {
      throw new HttpException('Deal not found', HttpStatus.NOT_FOUND);
    }
    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto): Promise<Deal> {
    const deal = await this.findOne(id);
    Object.assign(deal, updateDealDto);
    return this.dealsRepository.save(deal);
  }

  async remove(id: number): Promise<DeleteResult> {
    const deal = await this.findOne(id);
    return this.dealsRepository.delete(deal.id);
  }

  buildDealResponse(deal: Deal): DealResponseInterface {
    return { deal }
  }

  buildDealsResponse(deals: Deal[], dealsCount: number): DealsResponseInterface {
    return { deals, dealsCount }
  }

}
