import { IsNotEmpty } from "class-validator";
import { Client } from "src/clients/entities/client.entity";
import { Dealtype } from "src/dealtypes/entities/dealtype.entity";
import { User } from "src/users/entities/user.entity";

export class CreateDealDto {

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    start_datetime: Date;

    end_datetime?: Date;

    done_datetime?: Date;

    @IsNotEmpty()
    dealtype: Dealtype;

    @IsNotEmpty()
    client: Client;

    workerUser?: User;

    doneUser?: User;

}
