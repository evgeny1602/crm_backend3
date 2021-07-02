import { IsNotEmpty } from "class-validator";

export class CreateClientgroupDto {

    @IsNotEmpty()
    readonly name: string

}
