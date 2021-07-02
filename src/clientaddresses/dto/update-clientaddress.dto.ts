import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateClientaddressDto } from './create-clientaddress.dto';

export class UpdateClientaddressDto extends PartialType(CreateClientaddressDto) {

    @IsNotEmpty()
    readonly id: number;

}
