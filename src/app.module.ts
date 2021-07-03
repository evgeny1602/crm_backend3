import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { AuthMiddleware } from './users/middleware/auth.middleware';
import { UsersModule } from './users/users.module';
import { UsergroupsModule } from './usergroups/usergroups.module';
import { ClientgroupsModule } from './clientgroups/clientgroups.module';
import { ClientaddressesModule } from './clientaddresses/clientaddresses.module';
import { ClientsModule } from './clients/clients.module';
import { DealsModule } from './deals/deals.module';
import { DealtypesModule } from './dealtypes/dealtypes.module';
import { EventsModule } from './events/events.module';
import { EventtypesModule } from './eventtypes/eventtypes.module';
import { TasksModule } from './tasks/tasks.module';
import { TasktypesModule } from './tasktypes/tasktypes.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    UsergroupsModule,
    ClientgroupsModule,
    ClientaddressesModule,
    ClientsModule,
    DealsModule,
    DealtypesModule,
    EventsModule,
    EventtypesModule,
    TasksModule,
    TasktypesModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
