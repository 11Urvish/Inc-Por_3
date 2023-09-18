import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import PolicyTypes from "./PolicyType";
import CustomerPolicy from "./CustomerPolicy";

@Entity("policy_sub_types")
class PolicySubType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  status!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;

  @ManyToOne(() => PolicyTypes, (policyType) => policyType.policySubType)
  policyType!: PolicyTypes;
}

export default PolicySubType;
