"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const config_1 = require("../config");
const jsonwebtoken_1 = require("jsonwebtoken");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const userByLogin = await this.usersRepository.findOne({
            login: createUserDto.login
        });
        if (userByLogin) {
            throw new common_1.HttpException('Login already exists', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const userByEmail = await this.usersRepository.findOne({
            email: createUserDto.email
        });
        if (userByEmail) {
            throw new common_1.HttpException('Email already exists', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const user = new user_entity_1.User();
        Object.assign(user, createUserDto);
        return this.usersRepository.save(user);
    }
    findAll() {
        return `This action returns all users`;
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
    buildUserResponse(user) {
        return {
            user: Object.assign(Object.assign({}, user), { token: this.generateJwt(user) })
        };
    }
    generateJwt(user) {
        return jsonwebtoken_1.sign({
            id: user.id,
            login: user.login,
            email: user.email
        }, config_1.JWT_SECRET);
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map