import { Module } from '@nestjs/common';
import { DealtypesService } from './dealtypes.service';
import { DealtypesController } from './dealtypes.controller';
import { Dealtype } from './entities/dealtype.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Dealtype])],
  controllers: [DealtypesController],
  providers: [DealtypesService],
  exports: [DealtypesService]
})
export class DealtypesModule { }
