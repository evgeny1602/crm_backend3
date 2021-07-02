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
import { ClientaddressesService } from './clientaddresses.service';
import { CreateClientaddressDto } from './dto/create-clientaddress.dto';
import { UpdateClientaddressDto } from './dto/update-clientaddress.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { ClientaddressResponseInterface } from './types/clientaddressResponse.interface';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { ClientaddressesResponseInterface } from './types/clientaddressesResponseInterface';

@Controller('clientaddresses')
export class ClientaddressesController {

  constructor(
    private readonly clientaddressesService: ClientaddressesService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createClientaddressDto: CreateClientaddressDto
  ): Promise<ClientaddressResponseInterface> {
    const clientaddress = await this.clientaddressesService.create(createClientaddressDto);
    return this.clientaddressesService.buildClientResponse(clientaddress);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: any
  ): Promise<ClientaddressesResponseInterface> {
    const clientaddressesData = await this.clientaddressesService.findAll(query);
    return this.clientaddressesService.buildClientsResponse(
      clientaddressesData.clientaddresses,
      clientaddressesData.clientaddressesCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string
  ): Promise<ClientaddressResponseInterface> {
    const clientaddress = await this.clientaddressesService.findOne(+id);
    return this.clientaddressesService.buildClientResponse(clientaddress);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateClientaddressDto: UpdateClientaddressDto
  ): Promise<ClientaddressResponseInterface> {
    const clientaddress = await this.clientaddressesService.update(
      +id,
      updateClientaddressDto
    );
    return this.clientaddressesService.buildClientResponse(clientaddress);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string
  ) {
    return this.clientaddressesService.remove(+id);
  }

}
