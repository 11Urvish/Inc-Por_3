import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import Company from "./Company";
import User from "./User";
import CustomerPolicy from "./CustomerPolicy";

// https://www.youtube.com/watch?v=c74zNWoCJiA

@Entity("customers")
class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  phone!: string;

  @Column()
  status!: number;

  @Column()
  agent!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;

  @ManyToOne(() => Company, (company) => company.customers)
  company!: Company;

  @ManyToOne(() => User, (user) => user.customers)
  user!: User;

  @OneToMany(() => CustomerPolicy, (customerPolicy) => customerPolicy.customer)
  customerPolicy!: CustomerPolicy[];
}

export default Customer;
