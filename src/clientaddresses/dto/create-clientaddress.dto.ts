import { IsNotEmpty, IsEmail } from "class-validator";
import { Client } from "src/clients/entities/client.entity";

export class CreateClientaddressDto {

    @IsNotEmpty()
    readonly address: string;

    @IsNotEmpty()
    readonly city: string;

    @IsNotEmpty()
    readonly index: string;

    @IsNotEmpty()
    readonly country: string;

    @IsNotEmpty()
    readonly region: string;

    @IsNotEmpty()
    readonly is_default: string;

    @IsNotEmpty()
    readonly client: Client;

}
