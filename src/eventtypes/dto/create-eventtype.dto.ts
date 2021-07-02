import { IsNotEmpty } from "class-validator";

export class CreateEventtypeDto {

    @IsNotEmpty()
    readonly name: string

}
