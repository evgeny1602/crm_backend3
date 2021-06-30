import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "src/config";
import { ExpressRequestInterface } from "src/types/expressRequest.interface";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private readonly usersService: UsersService) { }

    async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null;
            next();
            return;
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decode = verify(token, JWT_SECRET) as { id: number };
            const user = await this.usersService.findOne(decode.id);
            req.user = user;
            next();
        } catch (err) {
            console.log(err)
            req.user = null;
            next();
        }
    }

}