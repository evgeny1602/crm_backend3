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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { EventResponseInterface } from './types/eventResponse.interface';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { EventsResponseInterface } from './types/eventsResponseInterface';

@Controller('events')
export class EventsController {

  constructor(
    private readonly eventsService: EventsService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createEventDto: CreateEventDto
  ): Promise<EventResponseInterface> {
    const event = await this.eventsService.create(createEventDto);
    return this.eventsService.buildEventResponse(event);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: any
  ): Promise<EventsResponseInterface> {
    const eventsData = await this.eventsService.findAll(query);
    return this.eventsService.buildEventsResponse(
      eventsData.events,
      eventsData.eventsCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string
  ): Promise<EventResponseInterface> {
    const event = await this.eventsService.findOne(+id);
    return this.eventsService.buildEventResponse(event);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<EventResponseInterface> {
    const event = await this.eventsService.update(
      +id,
      updateEventDto
    );
    return this.eventsService.buildEventResponse(event);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string
  ) {
    return this.eventsService.remove(+id);
  }

}
