import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientaddressDto } from './dto/create-clientaddress.dto';
import { UpdateClientaddressDto } from './dto/update-clientaddress.dto';
import { Clientaddress } from './entities/clientaddress.entity';
import { ClientaddressResponseInterface } from './types/clientaddressResponse.interface';
import { ClientaddressesResponseInterface } from './types/clientaddressesResponseInterface';
import {
  DeleteResult,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class ClientaddressesService {

  constructor(
    @InjectRepository(Clientaddress)
    private readonly clientaddressesRepository: Repository<Clientaddress>
  ) { }

  async create(
    createItemDto: CreateClientaddressDto
  ): Promise<Clientaddress> {
    const uniqueColumns = [];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.clientaddressesRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Clientaddress();
    Object.assign(item, createItemDto);
    return this.clientaddressesRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ clientaddresses: Clientaddress[], clientaddressesCount: number }> {
    const tableName = 'clientaddresses';
    const queryBuilder = getRepository(Clientaddress).createQueryBuilder(tableName);
    queryBuilder.leftJoinAndSelect(`${tableName}.client`, 'clients');

    // Поля таблицы, по которым можно фильтровать.
    // Если имя поля в URL и в таблице различается,
    // то используем массив [имя_поля_в_URL, имя_поля_в_таблице]
    const columnsToSearch = [
      ['client_id', 'clientId'],
      'address',
      'city',
      'index',
      'country',
      'region',
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
    const clientaddressesCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    // console.log(queryBuilder.getQueryAndParameters())
    const clientaddresses = await queryBuilder.getMany();
    return { clientaddresses, clientaddressesCount }
  }

  async findOne(
    id: number
  ): Promise<Clientaddress> {
    const client = await this.clientaddressesRepository.findOne(
      id,
      { relations: ['client'] }
    );
    if (!client) {
      throw new HttpException(
        'Client not found',
        HttpStatus.NOT_FOUND
      );
    }
    return client;
  }

  async update(
    id: number,
    updateClientaddressDto: UpdateClientaddressDto
  ): Promise<Clientaddress> {
    const clientaddress = await this.findOne(id);
    Object.assign(clientaddress, updateClientaddressDto);
    return this.clientaddressesRepository.save(clientaddress);
  }

  async remove(id: number): Promise<DeleteResult> {
    const clientaddress = await this.findOne(id);
    return this.clientaddressesRepository.delete(clientaddress.id);
  }

  buildClientaddressResponse(
    clientaddress: Clientaddress
  ): ClientaddressResponseInterface {
    return { clientaddress }
  }

  buildClientaddressesResponse(
    clientaddresses: Clientaddress[],
    clientaddressesCount: number
  ): ClientaddressesResponseInterface {
    return { clientaddresses, clientaddressesCount }
  }

}
