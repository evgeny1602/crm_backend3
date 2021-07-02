import { IsNotEmpty, IsEmail } from "class-validator";
import { Client } from "src/clients/entities/client.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Eventtype } from "src/eventtypes/entities/eventtype.entity";
import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";

export class CreateEventDto {

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    start_datetime: Date;

    process_datetime?: Date;

    @IsNotEmpty()
    eventtype: Eventtype;

    client?: Client;

    task?: Task;

    deal?: Deal;

    user?: User;

    processUser?: User;

}
