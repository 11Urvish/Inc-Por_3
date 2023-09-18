import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomerPolicyTable1687080440966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customer_policies",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "customerId", type: "int", isNullable: false },
          { name: "policyType", type: "varchar", isNullable: false },
          { name: "policySubType", type: "varchar", isNullable: false },
          { name: "policyNo", type: "varchar", isNullable: false },
          { name: "registeredDate", type: "timestamp", isNullable: false },
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
    await queryRunner.dropTable("customer_policies");
  }
}
