import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ClientgroupsService } from './clientgroups.service';
import { CreateClientgroupDto } from './dto/create-clientgroup.dto';
import { UpdateClientgroupDto } from './dto/update-clientgroup.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { ClientgroupResponseInterface } from './types/clientgroupResponse.interface';
import { ClientgroupsResponseInterface } from './types/clientgroupsResponse.interface';

@Controller('clientgroups')
export class ClientgroupsController {

  constructor(
    private readonly clientgroupsService: ClientgroupsService
  ) { }

  @Post()
  // @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createClientgroupDto: CreateClientgroupDto
  ): Promise<ClientgroupResponseInterface> {
    const clientgroup = await this.clientgroupsService.create(createClientgroupDto);
    return this.clientgroupsService.buildClientgroupResponse(clientgroup);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findAll(
    @Query() query: any
  ): Promise<ClientgroupsResponseInterface> {
    const clientgroupsData = await this.clientgroupsService.findAll(query);
    return this.clientgroupsService.buildClientgroupsResponse(
      clientgroupsData.clientgroups,
      clientgroupsData.clientgroupsCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findOne(
    @Param('id') id: string
  ): Promise<ClientgroupResponseInterface> {
    const clientgroup = await this.clientgroupsService.findOne(+id);
    return this.clientgroupsService.buildClientgroupResponse(clientgroup);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateClientgroupDto: UpdateClientgroupDto
  ): Promise<ClientgroupResponseInterface> {
    const clientgroup = await this.clientgroupsService.update(
      +id,
      updateClientgroupDto
    );
    return this.clientgroupsService.buildClientgroupResponse(clientgroup);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.clientgroupsService.remove(+id);
  }
}
