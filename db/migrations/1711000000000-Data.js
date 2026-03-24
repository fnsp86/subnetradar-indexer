module.exports = class Data1711000000000 {
    name = 'Data1711000000000'

    async up(db) {
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "from_id" character varying, "to_id" character varying, "amount" numeric NOT NULL, "fee" numeric, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401571" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d6624eacc30144ea97915fe846" ON "transfer" ("block_number")`)
        await db.query(`CREATE INDEX "IDX_be54ea276e0f665ffc38630fc0" ON "transfer" ("timestamp")`)
        await db.query(`CREATE INDEX "IDX_070c555a86b0b41a534a55a659" ON "transfer" ("extrinsic_hash")`)
        await db.query(`CREATE INDEX "IDX_76bdfed1a7eb27c6d8ecbb7349" ON "transfer" ("from_id")`)
        await db.query(`CREATE INDEX "IDX_0751309c66e97eac9ef1149362" ON "transfer" ("to_id")`)
        await db.query(`CREATE TABLE "stake_event" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "coldkey_id" character varying, "hotkey" text NOT NULL, "netuid" integer NOT NULL, "amount_staked" numeric NOT NULL, CONSTRAINT "PK_stake_event" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_stake_event_block_number" ON "stake_event" ("block_number")`)
        await db.query(`CREATE INDEX "IDX_stake_event_timestamp" ON "stake_event" ("timestamp")`)
        await db.query(`CREATE INDEX "IDX_stake_event_extrinsic_hash" ON "stake_event" ("extrinsic_hash")`)
        await db.query(`CREATE INDEX "IDX_stake_event_coldkey_id" ON "stake_event" ("coldkey_id")`)
        await db.query(`CREATE INDEX "IDX_stake_event_hotkey" ON "stake_event" ("hotkey")`)
        await db.query(`CREATE INDEX "IDX_stake_event_netuid" ON "stake_event" ("netuid")`)
        await db.query(`CREATE TABLE "unstake_event" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "coldkey_id" character varying, "hotkey" text NOT NULL, "netuid" integer NOT NULL, "amount_unstaked" numeric NOT NULL, CONSTRAINT "PK_unstake_event" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_unstake_event_block_number" ON "unstake_event" ("block_number")`)
        await db.query(`CREATE INDEX "IDX_unstake_event_timestamp" ON "unstake_event" ("timestamp")`)
        await db.query(`CREATE INDEX "IDX_unstake_event_extrinsic_hash" ON "unstake_event" ("extrinsic_hash")`)
        await db.query(`CREATE INDEX "IDX_unstake_event_coldkey_id" ON "unstake_event" ("coldkey_id")`)
        await db.query(`CREATE INDEX "IDX_unstake_event_hotkey" ON "unstake_event" ("hotkey")`)
        await db.query(`CREATE INDEX "IDX_unstake_event_netuid" ON "unstake_event" ("netuid")`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_0751309c66e97eac9ef11493623" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "stake_event" ADD CONSTRAINT "FK_stake_event_coldkey" FOREIGN KEY ("coldkey_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "unstake_event" ADD CONSTRAINT "FK_unstake_event_coldkey" FOREIGN KEY ("coldkey_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "unstake_event" DROP CONSTRAINT "FK_unstake_event_coldkey"`)
        await db.query(`ALTER TABLE "stake_event" DROP CONSTRAINT "FK_stake_event_coldkey"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_0751309c66e97eac9ef11493623"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496"`)
        await db.query(`DROP TABLE "unstake_event"`)
        await db.query(`DROP TABLE "stake_event"`)
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP TABLE "account"`)
    }
}
