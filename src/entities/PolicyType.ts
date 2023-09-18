import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import PolicySubType from "./PolicySubType";
import CustomerPolicy from "./CustomerPolicy";

@Entity("policy_types")
class PolicyType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

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

  @OneToMany(() => PolicySubType, (policySubType) => policySubType.policyType)
  policySubType!: PolicySubType[];
}

export default PolicyType;
