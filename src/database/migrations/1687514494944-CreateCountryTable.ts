import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateCountryTable1687514494944 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "country",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "code", type: "varchar", isNullable: false },
                    { name: "currency", type: "varchar", isNullable: false },
                    { name: "currencySymbol", type: "varchar", isNullable: false },
                    { name: "capital", type: "varchar", isNullable: false },
                    { name: "continent", type: "varchar", isNullable: false },
                    { name: "countryPhoneCode", type: "varchar", isNullable: false },
                    { name: "status", type: "boolean", isNullable: false }
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("country");
    }
}
