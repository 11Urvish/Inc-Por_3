import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomerPolicyDocTable1687080521853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customer_policy_docs",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "customerPolicyId", type: "int", isNullable: false },
          { name: "docType", type: "varchar", isNullable: false },
          { name: "docLink", type: "varchar", isNullable: false },
          { name: "status", type: "int", isNullable: false },
          { name: "description", type: "varchar", isNullable: false },
          { name: "agentApproval", type: "int", isNullable: false },
          { name: "uploadedAt", type: "timestamp", isNullable: true },
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
    await queryRunner.dropTable("customer_policy_docs");
  }
}
