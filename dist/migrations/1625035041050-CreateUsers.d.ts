import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUsers1625035041050 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
