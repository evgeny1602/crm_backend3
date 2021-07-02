import { IsNotEmpty } from "class-validator";

export class CreateTasktypeDto {

    @IsNotEmpty()
    readonly name: string

}
