import { IsNotEmpty } from "class-validator";

export class CreateDealtypeDto {

    @IsNotEmpty()
    readonly name: string

}
