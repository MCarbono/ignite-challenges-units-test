import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementsCreateStatusTransfer1618196233739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('statements', new TableColumn({
        name: "transfer_person",
        type: "enum",
        enum: ["receiver", "sender"],
        isNullable: true
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "transfer_person")
    }

}
