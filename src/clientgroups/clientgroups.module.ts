import { Module } from '@nestjs/common';
import { ClientgroupsService } from './clientgroups.service';
import { ClientgroupsController } from './clientgroups.controller';
import { Clientgroup } from './entities/clientgroup.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Clientgroup])],
  controllers: [ClientgroupsController],
  providers: [ClientgroupsService],
  exports: [ClientgroupsService]
})
export class ClientgroupsModule { }
