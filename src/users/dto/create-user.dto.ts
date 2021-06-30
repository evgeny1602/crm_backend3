import { IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    first_name?: string;

    middle_name?: string;

    last_name?: string;

    is_active?: boolean;

    image?: string;

}
