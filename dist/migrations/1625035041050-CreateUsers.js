"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsers1625035041050 = void 0;
class CreateUsers1625035041050 {
    constructor() {
        this.name = 'CreateUsers1625035041050';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.CreateUsers1625035041050 = CreateUsers1625035041050;
//# sourceMappingURL=1625035041050-CreateUsers.js.map