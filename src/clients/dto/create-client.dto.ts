import { IsNotEmpty, IsEmail } from "class-validator";
import { Clientgroup } from "src/clientgroups/entities/clientgroup.entity";

export class CreateClientDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    readonly first_name?: string;

    readonly middle_name?: string;

    readonly last_name?: string;

    readonly phone?: string;

    readonly birthday?: Date;

    readonly clientgroup: Clientgroup;

}
