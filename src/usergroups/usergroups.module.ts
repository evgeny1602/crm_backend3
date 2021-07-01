import { Module } from '@nestjs/common';
import { UsergroupsService } from './usergroups.service';
import { UsergroupsController } from './usergroups.controller';
import { Usergroup } from './entities/usergroup.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Usergroup])],
  controllers: [UsergroupsController],
  providers: [UsergroupsService],
  exports: [UsergroupsService]
})
export class UsergroupsModule { }
