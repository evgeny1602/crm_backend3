import { IsNotEmpty } from "class-validator";

export class CreateUsergroupDto {

    @IsNotEmpty()
    readonly name: string

}
