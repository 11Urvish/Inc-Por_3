import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateStateTable1687514504094 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "state",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "countryId", type: "int", isNullable: false },
                    { name: "code", type: "varchar", isNullable: false },
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "status", type: "boolean", isNullable: false }
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("state");
    }
}
