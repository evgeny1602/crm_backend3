"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let BackendValidationPipe = class BackendValidationPipe {
    async transform(value, metadata) {
        const object = class_transformer_1.plainToClass(metadata.metatype, value);
        if (typeof object !== 'object') {
            return value;
        }
        const errors = await class_validator_1.validate(object);
        if (errors.length === 0) {
            return value;
        }
        throw new common_1.HttpException({ errors: this.formatErrors(errors) }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
    }
    formatErrors(errors) {
        return errors.reduce((acc, error) => {
            acc[error.property] = Object.values(error.constraints);
            return acc;
        }, {});
    }
};
BackendValidationPipe = __decorate([
    common_1.Injectable()
], BackendValidationPipe);
exports.BackendValidationPipe = BackendValidationPipe;
//# sourceMappingURL=backendValidation.pipe.js.map