import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1755092556161 implements MigrationInterface {
    name = 'Init1755092556161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "favorite_topics" ("id" SERIAL NOT NULL, "userId" integer, "topicId" integer, CONSTRAINT "UQ_0582ce21ba14ac30f78c61e78b0" UNIQUE ("userId", "topicId"), CONSTRAINT "PK_618f9a1132cfb25ad1d12eb41a4" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "topics" ("id" SERIAL NOT NULL, "slug" character varying(32) NOT NULL, "name" character varying(32) NOT NULL, "description" character varying(255) NOT NULL, "postCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "UQ_97c66ab0029f49fde30517f8199" UNIQUE ("slug"), CONSTRAINT "UQ_1304b1c61016e63f60cd147ce6b" UNIQUE ("name"), CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "postId" integer, "userId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_9fedf58adcfb0eaac5d470ba6c" ON "comments" ("postId", "id") `)
        await queryRunner.query(
            `CREATE TABLE "likes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, "postId" integer, CONSTRAINT "UQ_74b9b8cd79a1014e50135f266fe" UNIQUE ("userId", "postId"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "topicLocalId" integer NOT NULL, "viewCount" integer NOT NULL DEFAULT '0', "commentCount" integer NOT NULL DEFAULT '0', "likeCount" integer NOT NULL DEFAULT '0', "ip" character varying(15), "authorId" integer, "topicId" integer, "likesId" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_a72a4814d9256fbb39bb12bffc" ON "posts" ("topicId", "id") `)
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1')`)
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(32) NOT NULL, "nickname" character varying(32), "password" character varying(255) NOT NULL, "email" character varying(320) NOT NULL, "description" character varying(255), "profileImage" character varying(255), "role" "public"."users_role_enum" NOT NULL DEFAULT '1', "points" integer NOT NULL DEFAULT '0', "postCount" integer NOT NULL DEFAULT '0', "commentCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "favorite_topics" ADD CONSTRAINT "FK_0169d16f5ecfc0fa4ddffb580a9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "favorite_topics" ADD CONSTRAINT "FK_c8ab193092216284d91772764fb" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "topics" ADD CONSTRAINT "FK_62a84331503e467c317cc9396fe" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "likes" ADD CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_7053388f60ec8ee652b912bcc7e" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_5497a85000a53c152b3432e75c3" FOREIGN KEY ("likesId") REFERENCES "likes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_5497a85000a53c152b3432e75c3"`)
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7053388f60ec8ee652b912bcc7e"`)
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`)
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50"`)
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`)
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`)
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`)
        await queryRunner.query(`ALTER TABLE "topics" DROP CONSTRAINT "FK_62a84331503e467c317cc9396fe"`)
        await queryRunner.query(`ALTER TABLE "favorite_topics" DROP CONSTRAINT "FK_c8ab193092216284d91772764fb"`)
        await queryRunner.query(`ALTER TABLE "favorite_topics" DROP CONSTRAINT "FK_0169d16f5ecfc0fa4ddffb580a9"`)
        await queryRunner.query(`DROP TABLE "users"`)
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_a72a4814d9256fbb39bb12bffc"`)
        await queryRunner.query(`DROP TABLE "posts"`)
        await queryRunner.query(`DROP TABLE "likes"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_9fedf58adcfb0eaac5d470ba6c"`)
        await queryRunner.query(`DROP TABLE "comments"`)
        await queryRunner.query(`DROP TABLE "topics"`)
        await queryRunner.query(`DROP TABLE "favorite_topics"`)
    }
}
