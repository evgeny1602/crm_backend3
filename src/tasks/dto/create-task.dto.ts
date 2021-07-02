import { IsNotEmpty, IsEmail } from "class-validator";
import { Client } from "src/clients/entities/client.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Tasktype } from "src/tasktypes/entities/tasktype.entity";
import { User } from "src/users/entities/user.entity";

export class CreateTaskDto {

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly start_datetime: Date;

    readonly end_datetime?: Date;

    readonly done_datetime?: Date;

    @IsNotEmpty()
    readonly tasktype: Tasktype;

    @IsNotEmpty()
    readonly workerUser: User;

    @IsNotEmpty()
    readonly masterUser: User;

    @IsNotEmpty()
    readonly createUser: User;

    readonly event?: Event;

    readonly deal?: Deal;

    readonly client?: Client;

}
