import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ClientResponseInterface } from './types/clientResponse.interface';
import { ClientsResponseInterface } from './types/clientsResponseInterface';
import {
  DeleteResult,
  getRepository,
  Repository
} from 'typeorm';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>
  ) { }

  async create(
    createItemDto: CreateClientDto
  ): Promise<Client> {
    const uniqueColumns = [
      'email'
    ];
    for (const column of uniqueColumns) {
      let filter = {};
      filter[column] = createItemDto[column];
      const item = await this.clientsRepository.findOne(filter);
      if (item) {
        let msg = `${column} already exists.`;
        msg = msg.replace(/^\w/, (c) => c.toUpperCase())
        throw new HttpException(
          msg,
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
    }
    const item = new Client();
    Object.assign(item, createItemDto);
    return this.clientsRepository.save(item);
  }

  async findAll(
    query: any
  ): Promise<{ clients: Client[], clientsCount: number }> {
    const tableName = 'clients';
    const queryBuilder = getRepository(Client).createQueryBuilder(tableName);
    queryBuilder.leftJoinAndSelect(`${tableName}.clientgroup`, 'clientgroups');

    // Поля таблицы, по которым можно фильтровать.
    // Если имя поля в URL и в таблице различается,
    // то используем массив [имя_поля_в_URL, имя_поля_в_таблице]
    const columnsToSearch = [
      ['clientgroup_id', 'clientgroupId'],
      'email',
      'first_name',
      'middle_name',
      'last_name',
      'phone',
      'birthday'
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
    const clientsCount = await queryBuilder.getCount();
    queryBuilder.limit(query.limit ? query.limit : 10);
    queryBuilder.offset(query.offset ? query.offset : 0);
    const orderType: "ASC" | "DESC" = query.ordertype ? query.ordertype.toUpperCase() : 'ASC';
    const order: string = query.order ? query.order : 'id';
    queryBuilder.orderBy(`${tableName}.${order}`, orderType);
    // console.log(queryBuilder.getQueryAndParameters())
    const clients = await queryBuilder.getMany();
    return { clients, clientsCount }
  }

  async findOne(
    id: number
  ): Promise<Client> {
    const client = await this.clientsRepository.findOne(
      id,
      { relations: ['clientgroup'] }
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
    updateClientDto: UpdateClientDto
  ): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<DeleteResult> {
    const client = await this.findOne(id);
    return this.clientsRepository.delete(client.id);
  }

  buildClientResponse(
    client: Client
  ): ClientResponseInterface {
    return { client }
  }

  buildClientsResponse(
    clients: Client[],
    clientsCount: number
  ): ClientsResponseInterface {
    return { clients, clientsCount }
  }

}
