import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import PolicyType from "./PolicyType";
import PolicySubType from "./PolicySubType";
import Customer from "./Customer";
import CustomerPolicyDoc from "./CustomerPolicyDoc";

@Entity("customer_policies")
class CustomerPolicy {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  policyNo!: string;

  @Column()
  policyType!: string;

  @Column()
  policySubType!: string;

  @Column()
  status!: number;

  @Column()
  registeredDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;

  @ManyToOne(() => Customer, (customer) => customer.customerPolicy)
  customer!: Customer;

  @OneToMany(() => CustomerPolicyDoc, (customerPolicyDoc) => customerPolicyDoc.customerPolicy)
  customerPolicyDoc!: CustomerPolicyDoc[];
}

export default CustomerPolicy;
