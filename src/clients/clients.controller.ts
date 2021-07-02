import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { ClientResponseInterface } from './types/clientResponse.interface';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { ClientsResponseInterface } from './types/clientsResponseInterface';

@Controller('clients')
export class ClientsController {

  constructor(
    private readonly clientsService: ClientsService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createClientDto: CreateClientDto
  ): Promise<ClientResponseInterface> {
    const client = await this.clientsService.create(createClientDto);
    return this.clientsService.buildClientResponse(client);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: any
  ): Promise<ClientsResponseInterface> {
    const clientsData = await this.clientsService.findAll(query);
    return this.clientsService.buildClientsResponse(
      clientsData.clients,
      clientsData.clientsCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string
  ): Promise<ClientResponseInterface> {
    const client = await this.clientsService.findOne(+id);
    return this.clientsService.buildClientResponse(client);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<ClientResponseInterface> {
    const client = await this.clientsService.update(
      +id,
      updateClientDto
    );
    return this.clientsService.buildClientResponse(client);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string
  ) {
    return this.clientsService.remove(+id);
  }

}
