import { Module } from '@nestjs/common';
import { ClientaddressesService } from './clientaddresses.service';
import { ClientaddressesController } from './clientaddresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clientaddress } from './entities/clientaddress.entity';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Clientaddress])],
  controllers: [ClientaddressesController],
  providers: [ClientaddressesService, AuthGuard],
  exports: [ClientaddressesService]
})
export class ClientaddressesModule { }
