import { Module } from '@nestjs/common';
import { EventtypesService } from './eventtypes.service';
import { EventtypesController } from './eventtypes.controller';
import { Eventtype } from './entities/eventtype.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Eventtype])],
  controllers: [EventtypesController],
  providers: [EventtypesService],
  exports: [EventtypesService]
})
export class EventtypesModule { }
