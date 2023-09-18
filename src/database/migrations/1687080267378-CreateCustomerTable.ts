import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomerTable1687080267378 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customers",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "userId", type: "int", isNullable: false },
          { name: "companyId", type: "int", isNullable: false },
          { name: "firstName", type: "varchar", isNullable: false },
          { name: "lastName", type: "varchar", isNullable: false },
          { name: "email", type: "varchar", isNullable: false },
          { name: "password", type: "varchar", isNullable: false },
          { name: "phone", type: "varchar", isNullable: false },
          { name: "status", type: "int", isNullable: false },
          { name: "agent", type: "varchar", isNullable: false },
          { name: "createdBy", type: "varchar", isNullable: true },
          { name: "updatedBy", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("customers");
  }
}
