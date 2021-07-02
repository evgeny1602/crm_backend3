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
import { TasktypesService } from './tasktypes.service';
import { CreateTasktypeDto } from './dto/create-tasktype.dto';
import { UpdateTasktypeDto } from './dto/update-tasktype.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { TasktypeResponseInterface } from './types/tasktypeResponse.interface';
import { TasktypesResponseInterface } from './types/tasktypesResponse.interface';

@Controller('tasktypes')
export class TasktypesController {

  constructor(
    private readonly tasktypesService: TasktypesService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createTasktypeDto: CreateTasktypeDto
  ): Promise<TasktypeResponseInterface> {
    const tasktype = await this.tasktypesService.create(createTasktypeDto);
    return this.tasktypesService.buildTasktypeResponse(tasktype);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findAll(
    @Query() query: any
  ): Promise<TasktypesResponseInterface> {
    const tasktypesData = await this.tasktypesService.findAll(query);
    return this.tasktypesService.buildTasktypesResponse(
      tasktypesData.tasktypes,
      tasktypesData.tasktypesCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async findOne(
    @Param('id') id: string
  ): Promise<TasktypeResponseInterface> {
    const tasktype = await this.tasktypesService.findOne(+id);
    return this.tasktypesService.buildTasktypeResponse(tasktype);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateTasktypeDto: UpdateTasktypeDto
  ): Promise<TasktypeResponseInterface> {
    const tasktype = await this.tasktypesService.update(
      +id,
      updateTasktypeDto
    );
    return this.tasktypesService.buildTasktypeResponse(tasktype);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.tasktypesService.remove(+id);
  }
}
