import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import Company from "./Company";
import Customer from "./Customer";

// https://www.youtube.com/watch?v=c74zNWoCJiA

@Entity("users")
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

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

  @ManyToOne(() => Company, (company) => company.users)
  company!: Company;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers!: Customer[];
}

export default User;
