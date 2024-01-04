import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1704390791497 implements MigrationInterface {
    name = 'Migrations1704390791497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "text" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f27f5d88941e57442be75ba9c8" ON "note" ("text") `);
        await queryRunner.query(`CREATE TABLE "note_to_user" ("id" SERIAL NOT NULL, "note_id" integer NOT NULL, "user_id" integer NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_96755f74f17a5047b76c82f0eac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note_to_user" ADD CONSTRAINT "FK_7d3e3d7278e2a176c36cc45f5dd" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note_to_user" ADD CONSTRAINT "FK_b72f473d2616d4190825e6c853f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_to_user" DROP CONSTRAINT "FK_b72f473d2616d4190825e6c853f"`);
        await queryRunner.query(`ALTER TABLE "note_to_user" DROP CONSTRAINT "FK_7d3e3d7278e2a176c36cc45f5dd"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "note_to_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f27f5d88941e57442be75ba9c8"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
