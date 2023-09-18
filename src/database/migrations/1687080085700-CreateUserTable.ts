import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1687080085700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "companyId", type: "int", isNullable: true },
          { name: "name", type: "varchar", isNullable: false },
          { name: "email", type: "varchar", isNullable: false },
          { name: "password", type: "varchar", isNullable: false },
          { name: "role", type: "varchar", isNullable: false },
          { name: "status", type: "int", isNullable: false },
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
    await queryRunner.dropTable("users");
  }
}
