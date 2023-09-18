import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCompanyTable1687080143945 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "companies",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isNullable: false },
          { name: "email", type: "varchar", isNullable: false },
          { name: "phone", type: "varchar", isNullable: false },
          { name: "plan", type: "varchar", isNullable: false },
          { name: "address", type: "varchar", isNullable: false },
          { name: "country", type: "varchar", isNullable: false },
          { name: "state", type: "varchar", isNullable: false },
          { name: "city", type: "varchar", isNullable: false },
          { name: "pincode", type: "varchar", isNullable: false },
          { name: "status", type: "int", isNullable: false },
          { name: "userCount", type: "int", isNullable: true },
          { name: "activeUserCount", type: "int", isNullable: true },
          { name: "expiryDate", type: "timestamp", isNullable: false },
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
    await queryRunner.dropTable("companies");
  }
}
