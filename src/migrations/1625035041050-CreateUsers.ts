import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1625035041050 implements MigrationInterface {
    name = 'CreateUsers1625035041050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
