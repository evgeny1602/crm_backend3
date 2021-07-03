import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1625243324421 implements MigrationInterface {
    name = 'Init1625243324421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clientgroups" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_c73db484bcab24d0eee596c9a95" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "dealtypes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_083aa91b8e0fc051126f15645b4" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "usergroups" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_97782d55857b7673e6b06d8455d" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "tasktypes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_30dd936ce10513b0596755a149c" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "eventtypes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_6d51537bc598ebe07f542390e9e" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "start_datetime" datetime NOT NULL, "process_datetime" datetime, "eventtypeId" integer, "clientId" integer, "taskId" integer, "dealId" integer, "userId" integer, "processUserId" integer, CONSTRAINT "REL_45e4d9c7121e534fb79a6150b7" UNIQUE ("taskId"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "start_datetime" datetime NOT NULL, "end_datetime" datetime, "done_datetime" datetime, "tasktypeId" integer, "masterUserId" integer, "createUserId" integer, "dealId" integer, "clientId" integer)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), "usergroupId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "amount" integer NOT NULL, "start_datetime" datetime NOT NULL, "end_datetime" datetime, "done_datetime" datetime, "dealtypeId" integer, "clientId" integer, "workerUserId" integer, "doneUserId" integer)`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "phone" varchar NOT NULL DEFAULT (''), "birthday" datetime NOT NULL DEFAULT (''), "clientgroupId" integer)`);
        await queryRunner.query(`CREATE TABLE "clientaddresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "city" varchar NOT NULL, "index" varchar NOT NULL, "country" varchar NOT NULL, "region" varchar NOT NULL, "is_default" varchar NOT NULL DEFAULT (1), "clientId" integer)`);
        await queryRunner.query(`CREATE TABLE "users_tasks_worker_tasks" ("usersId" integer NOT NULL, "tasksId" integer NOT NULL, PRIMARY KEY ("usersId", "tasksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8dfbfb1fd557211b94583fba03" ON "users_tasks_worker_tasks" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_73952f9f5cf8a74ebd99bc1254" ON "users_tasks_worker_tasks" ("tasksId") `);
        await queryRunner.query(`CREATE TABLE "temporary_events" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "start_datetime" datetime NOT NULL, "process_datetime" datetime, "eventtypeId" integer, "clientId" integer, "taskId" integer, "dealId" integer, "userId" integer, "processUserId" integer, CONSTRAINT "REL_45e4d9c7121e534fb79a6150b7" UNIQUE ("taskId"), CONSTRAINT "FK_a38fe4ad7b992c1dceee3fccd7c" FOREIGN KEY ("eventtypeId") REFERENCES "eventtypes" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_2b2274cd969274843abe3219685" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_45e4d9c7121e534fb79a6150b74" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_746d6af21c8a93c794a2ba1ffa0" FOREIGN KEY ("dealId") REFERENCES "deals" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_ed96e905c054665c94d866a04b4" FOREIGN KEY ("processUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_events"("id", "description", "start_datetime", "process_datetime", "eventtypeId", "clientId", "taskId", "dealId", "userId", "processUserId") SELECT "id", "description", "start_datetime", "process_datetime", "eventtypeId", "clientId", "taskId", "dealId", "userId", "processUserId" FROM "events"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`ALTER TABLE "temporary_events" RENAME TO "events"`);
        await queryRunner.query(`CREATE TABLE "temporary_tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "start_datetime" datetime NOT NULL, "end_datetime" datetime, "done_datetime" datetime, "tasktypeId" integer, "masterUserId" integer, "createUserId" integer, "dealId" integer, "clientId" integer, CONSTRAINT "FK_7fd16101aa628a5d5938b26e927" FOREIGN KEY ("tasktypeId") REFERENCES "tasktypes" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_0312e4b3f590f83f0c80fb951bb" FOREIGN KEY ("masterUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_9c7f281292617cf9ac7d2c57a61" FOREIGN KEY ("createUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_4d5c77e1b081638da5c4248ac4a" FOREIGN KEY ("dealId") REFERENCES "deals" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4e7cd3aff0dbd7708e02b14ecb8" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tasks"("id", "description", "start_datetime", "end_datetime", "done_datetime", "tasktypeId", "masterUserId", "createUserId", "dealId", "clientId") SELECT "id", "description", "start_datetime", "end_datetime", "done_datetime", "tasktypeId", "masterUserId", "createUserId", "dealId", "clientId" FROM "tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_tasks" RENAME TO "tasks"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), "usergroupId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "FK_a209ab542b13c88eabdb7cf813f" FOREIGN KEY ("usergroupId") REFERENCES "usergroups" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId") SELECT "id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_deals" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "amount" integer NOT NULL, "start_datetime" datetime NOT NULL, "end_datetime" datetime, "done_datetime" datetime, "dealtypeId" integer, "clientId" integer, "workerUserId" integer, "doneUserId" integer, CONSTRAINT "FK_7fd58c2891708ea6cc46fff5e95" FOREIGN KEY ("dealtypeId") REFERENCES "dealtypes" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_4b96d900e3f444e2554042f8a56" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_f7c4a36cfb54302fbd9e893a041" FOREIGN KEY ("workerUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_f80750134cb0a6049fb5f85a866" FOREIGN KEY ("doneUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_deals"("id", "description", "amount", "start_datetime", "end_datetime", "done_datetime", "dealtypeId", "clientId", "workerUserId", "doneUserId") SELECT "id", "description", "amount", "start_datetime", "end_datetime", "done_datetime", "dealtypeId", "clientId", "workerUserId", "doneUserId" FROM "deals"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`ALTER TABLE "temporary_deals" RENAME TO "deals"`);
        await queryRunner.query(`CREATE TABLE "temporary_clients" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "phone" varchar NOT NULL DEFAULT (''), "birthday" datetime NOT NULL DEFAULT (''), "clientgroupId" integer, CONSTRAINT "FK_afb354c98b433f1b312f24ff30a" FOREIGN KEY ("clientgroupId") REFERENCES "clientgroups" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_clients"("id", "email", "first_name", "middle_name", "last_name", "phone", "birthday", "clientgroupId") SELECT "id", "email", "first_name", "middle_name", "last_name", "phone", "birthday", "clientgroupId" FROM "clients"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`ALTER TABLE "temporary_clients" RENAME TO "clients"`);
        await queryRunner.query(`CREATE TABLE "temporary_clientaddresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "city" varchar NOT NULL, "index" varchar NOT NULL, "country" varchar NOT NULL, "region" varchar NOT NULL, "is_default" varchar NOT NULL DEFAULT (1), "clientId" integer, CONSTRAINT "FK_8d55ea2f5b93822be07b6faa638" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_clientaddresses"("id", "address", "city", "index", "country", "region", "is_default", "clientId") SELECT "id", "address", "city", "index", "country", "region", "is_default", "clientId" FROM "clientaddresses"`);
        await queryRunner.query(`DROP TABLE "clientaddresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_clientaddresses" RENAME TO "clientaddresses"`);
        await queryRunner.query(`DROP INDEX "IDX_8dfbfb1fd557211b94583fba03"`);
        await queryRunner.query(`DROP INDEX "IDX_73952f9f5cf8a74ebd99bc1254"`);
        await queryRunner.query(`CREATE TABLE "temporary_users_tasks_worker_tasks" ("usersId" integer NOT NULL, "tasksId" integer NOT NULL, CONSTRAINT "FK_8dfbfb1fd557211b94583fba03f" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE, CONSTRAINT "FK_73952f9f5cf8a74ebd99bc1254c" FOREIGN KEY ("tasksId") REFERENCES "tasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("usersId", "tasksId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users_tasks_worker_tasks"("usersId", "tasksId") SELECT "usersId", "tasksId" FROM "users_tasks_worker_tasks"`);
        await queryRunner.query(`DROP TABLE "users_tasks_worker_tasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_users_tasks_worker_tasks" RENAME TO "users_tasks_worker_tasks"`);
        await queryRunner.query(`CREATE INDEX "IDX_8dfbfb1fd557211b94583fba03" ON "users_tasks_worker_tasks" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_73952f9f5cf8a74ebd99bc1254" ON "users_tasks_worker_tasks" ("tasksId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_73952f9f5cf8a74ebd99bc1254"`);
        await queryRunner.query(`DROP INDEX "IDX_8dfbfb1fd557211b94583fba03"`);
        await queryRunner.query(`ALTER TABLE "users_tasks_worker_tasks" RENAME TO "temporary_users_tasks_worker_tasks"`);
        await queryRunner.query(`CREATE TABLE "users_tasks_worker_tasks" ("usersId" integer NOT NULL, "tasksId" integer NOT NULL, PRIMARY KEY ("usersId", "tasksId"))`);
        await queryRunner.query(`INSERT INTO "users_tasks_worker_tasks"("usersId", "tasksId") SELECT "usersId", "tasksId" FROM "temporary_users_tasks_worker_tasks"`);
        await queryRunner.query(`DROP TABLE "temporary_users_tasks_worker_tasks"`);
        await queryRunner.query(`CREATE INDEX "IDX_73952f9f5cf8a74ebd99bc1254" ON "users_tasks_worker_tasks" ("tasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8dfbfb1fd557211b94583fba03" ON "users_tasks_worker_tasks" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "clientaddresses" RENAME TO "temporary_clientaddresses"`);
        await queryRunner.query(`CREATE TABLE "clientaddresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "city" varchar NOT NULL, "index" varchar NOT NULL, "country" varchar NOT NULL, "region" varchar NOT NULL, "is_default" varchar NOT NULL DEFAULT (1), "clientId" integer)`);
        await queryRunner.query(`INSERT INTO "clientaddresses"("id", "address", "city", "index", "country", "region", "is_default", "clientId") SELECT "id", "address", "city", "index", "country", "region", "is_default", "clientId" FROM "temporary_clientaddresses"`);
        await queryRunner.query(`DROP TABLE "temporary_clientaddresses"`);
        await queryRunner.query(`ALTER TABLE "clients" RENAME TO "temporary_clients"`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "phone" varchar NOT NULL DEFAULT (''), "birthday" datetime NOT NULL DEFAULT (''), "clientgroupId" integer)`);
        await queryRunner.query(`INSERT INTO "clients"("id", "email", "first_name", "middle_name", "last_name", "phone", "birthday", "clientgroupId") SELECT "id", "email", "first_name", "middle_name", "last_name", "phone", "birthday", "clientgroupId" FROM "temporary_clients"`);
        await queryRunner.query(`DROP TABLE "temporary_clients"`);
        await queryRunner.query(`ALTER TABLE "deals" RENAME TO "temporary_deals"`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "amount" integer NOT NULL, "start_datetime" datetime NOT NULL, "end_datetime" datetime, "done_datetime" datetime, "dealtypeId" integer, "clientId" integer, "workerUserId" integer, "doneUserId" integer)`);
        await queryRunner.query(`INSERT INTO "deals"("id", "description", "amount", "start_datetime", "end_datetime", "done_datetime", "dealtypeId", "clientId", "workerUserId", "doneUserId") SELECT "id", "description", "amount", "start_datetime", "end_datetime", "done_datetime", "dealtypeId", "clientId", "workerUserId", "doneUserId" FROM "temporary_deals"`);
        await queryRunner.query(`DROP TABLE "temporary_deals"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "login" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL DEFAULT (''), "middle_name" varchar NOT NULL DEFAULT (''), "last_name" varchar NOT NULL DEFAULT (''), "is_active" boolean NOT NULL DEFAULT (1), "image" varchar NOT NULL DEFAULT (''), "usergroupId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId") SELECT "id", "login", "password", "email", "first_name", "middle_name", "last_name", "is_active", "image", "usergroupId" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "temporary_tasks"`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "start_datetime" datetime NOT NULL, "end_datetime" datetime, "done_datetime" datetime, "tasktypeId" integer, "masterUserId" integer, "createUserId" integer, "dealId" integer, "clientId" integer)`);
        await queryRunner.query(`INSERT INTO "tasks"("id", "description", "start_datetime", "end_datetime", "done_datetime", "tasktypeId", "masterUserId", "createUserId", "dealId", "clientId") SELECT "id", "description", "start_datetime", "end_datetime", "done_datetime", "tasktypeId", "masterUserId", "createUserId", "dealId", "clientId" FROM "temporary_tasks"`);
        await queryRunner.query(`DROP TABLE "temporary_tasks"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME TO "temporary_events"`);
        await queryRunner.query(`CREATE TABLE "events" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL, "start_datetime" datetime NOT NULL, "process_datetime" datetime, "eventtypeId" integer, "clientId" integer, "taskId" integer, "dealId" integer, "userId" integer, "processUserId" integer, CONSTRAINT "REL_45e4d9c7121e534fb79a6150b7" UNIQUE ("taskId"))`);
        await queryRunner.query(`INSERT INTO "events"("id", "description", "start_datetime", "process_datetime", "eventtypeId", "clientId", "taskId", "dealId", "userId", "processUserId") SELECT "id", "description", "start_datetime", "process_datetime", "eventtypeId", "clientId", "taskId", "dealId", "userId", "processUserId" FROM "temporary_events"`);
        await queryRunner.query(`DROP TABLE "temporary_events"`);
        await queryRunner.query(`DROP INDEX "IDX_73952f9f5cf8a74ebd99bc1254"`);
        await queryRunner.query(`DROP INDEX "IDX_8dfbfb1fd557211b94583fba03"`);
        await queryRunner.query(`DROP TABLE "users_tasks_worker_tasks"`);
        await queryRunner.query(`DROP TABLE "clientaddresses"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "eventtypes"`);
        await queryRunner.query(`DROP TABLE "tasktypes"`);
        await queryRunner.query(`DROP TABLE "usergroups"`);
        await queryRunner.query(`DROP TABLE "dealtypes"`);
        await queryRunner.query(`DROP TABLE "clientgroups"`);
    }

}
