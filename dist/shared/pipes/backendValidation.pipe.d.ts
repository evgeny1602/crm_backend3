import { ArgumentMetadata, PipeTransform, ValidationError } from '@nestjs/common';
export declare class BackendValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    formatErrors(errors: ValidationError[]): {};
}
