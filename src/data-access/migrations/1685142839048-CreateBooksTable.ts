import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBooksTable1685142839048 implements MigrationInterface {
  name = 'CreateBooksTable1685142839048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "books" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "author" character varying NOT NULL, "genre" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "totalAvailable" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4675aad2c57a7a793d26afbae9" ON "books" ("author") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f50357a540439c8d17050c830" ON "books" ("genre") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f50357a540439c8d17050c830"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4675aad2c57a7a793d26afbae9"`,
    );
    await queryRunner.query(`DROP TABLE "books"`);
  }
}
