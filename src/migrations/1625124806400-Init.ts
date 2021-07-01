import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1625124806400 implements MigrationInterface {
    name = 'Init1625124806400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), "usergroupId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "usergroups" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_97782d55857b7673e6b06d8455d" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), "usergroupId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "FK_a209ab542b13c88eabdb7cf813f" FOREIGN KEY ("usergroupId") REFERENCES "usergroups" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId") SELECT "id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), "usergroupId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId") SELECT "id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP TABLE "usergroups"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
