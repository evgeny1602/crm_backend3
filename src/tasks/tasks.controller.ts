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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { TaskResponseInterface } from './types/taskResponse.interface';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { TasksResponseInterface } from './types/tasksResponseInterface';

@Controller('tasks')
export class TasksController {

  constructor(
    private readonly tasksService: TasksService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body() createTaskDto: CreateTaskDto
  ): Promise<TaskResponseInterface> {
    const task = await this.tasksService.create(createTaskDto);
    return this.tasksService.buildTaskResponse(task);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: any
  ): Promise<TasksResponseInterface> {
    const tasksData = await this.tasksService.findAll(query);
    return this.tasksService.buildTasksResponse(
      tasksData.tasks,
      tasksData.tasksCount
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string
  ): Promise<TaskResponseInterface> {
    const task = await this.tasksService.findOne(+id);
    return this.tasksService.buildTaskResponse(task);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseInterface> {
    const task = await this.tasksService.update(
      +id,
      updateTaskDto
    );
    return this.tasksService.buildTaskResponse(task);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string
  ) {
    return this.tasksService.remove(+id);
  }

}
