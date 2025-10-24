import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745658880476 implements MigrationInterface {
    name = 'InitMigration1745658880476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "firebaseUid" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_905432b2c46bdcfe1a0dd3cdeff" UNIQUE ("firebaseUid")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_905432b2c46bdcfe1a0dd3cdeff"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firebaseUid"`);
    }

}
