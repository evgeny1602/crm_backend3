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
import { EventtypesService } from './eventtypes.service';
import { CreateEventtypeDto } from './dto/create-eventtype.dto';
import { UpdateEventtypeDto } from './dto/update-eventtype.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { EventtypeResponseInterface } from './types/eventtypeResponse.interface';
import { EventtypesResponseInterface } from './types/eventtypesResponse.interface';

@Controller('eventtypes')
export class EventtypesController {

  constructor(
    private readonly eventtypesService: EventtypesService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createEventtypeDto: CreateEventtypeDto
  ): Promise<EventtypeResponseInterface> {
    const eventtype = await this.eventtypesService.create(createEventtypeDto);
    return this.eventtypesService.buildEventtypeResponse(eventtype);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findAll(
    @Query() query: any
  ): Promise<EventtypesResponseInterface> {
    const eventtypesData = await this.eventtypesService.findAll(query);
    return this.eventtypesService.buildEventtypesResponse(
      eventtypesData.eventtypes,
      eventtypesData.eventtypesCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findOne(
    @Param('id') id: string
  ): Promise<EventtypeResponseInterface> {
    const eventtype = await this.eventtypesService.findOne(+id);
    return this.eventtypesService.buildEventtypeResponse(eventtype);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateEventtypeDto: UpdateEventtypeDto
  ): Promise<EventtypeResponseInterface> {
    const eventtype = await this.eventtypesService.update(
      +id,
      updateEventtypeDto
    );
    return this.eventtypesService.buildEventtypeResponse(eventtype);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.eventtypesService.remove(+id);
  }
}
