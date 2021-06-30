import { IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    readonly login: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    readonly first_name?: string;

    readonly middle_name?: string;

    readonly last_name?: string;

    readonly is_active?: boolean;

    readonly image?: string;

}
