import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import CustomerPolicy from "./CustomerPolicy";

@Entity("customer_policy_docs")
class CustomerPolicyDoc {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  docType!: string;

  @Column()
  docLink!: string;

  @Column()
  status!: number;

  @Column()
  description!: string;

  @Column()
  agentApproval!: number;

  @UpdateDateColumn()
  uploadedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;

  @ManyToOne(() => CustomerPolicy, (customerPolicy) => customerPolicy.customerPolicyDoc)
  customerPolicy!: CustomerPolicy;
}

export default CustomerPolicyDoc;
