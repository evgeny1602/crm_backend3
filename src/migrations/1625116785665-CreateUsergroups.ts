import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsergroups1625116785665 implements MigrationInterface {
    name = 'CreateUsergroups1625116785665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usergroups" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_97782d55857b7673e6b06d8455d" UNIQUE ("name"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usergroups"`);
    }

}
