import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsersUniqueFields1625111161725 implements MigrationInterface {
    name = 'AddUsersUniqueFields1625111161725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), CONSTRAINT "UQ_e434774e30f19139e887099b747" UNIQUE ("login"), CONSTRAINT "UQ_75180bd8e62d624af9fa502f352" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image") SELECT "id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''))`);
        await queryRunner.query(`INSERT INTO "users"("id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image") SELECT "id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
