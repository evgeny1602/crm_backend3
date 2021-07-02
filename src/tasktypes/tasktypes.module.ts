import { Module } from '@nestjs/common';
import { TasktypesService } from './tasktypes.service';
import { TasktypesController } from './tasktypes.controller';
import { Tasktype } from './entities/tasktype.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Tasktype])],
  controllers: [TasktypesController],
  providers: [TasktypesService],
  exports: [TasktypesService]
})
export class TasktypesModule { }
