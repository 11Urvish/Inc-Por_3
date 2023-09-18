import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import User from "./User";
import Customer from "./Customer";

@Entity("companies")
class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  status!: number;

  @Column()
  plan!: string;

  @Column()
  address!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  @Column()
  pincode!: string;

  @Column()
  userCount!: number;

  @Column()
  activeUserCount!: number;

  @CreateDateColumn()
  expiryDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;

  @OneToMany(() => User, (user) => user.company)
  users!: User[];

  @OneToMany(() => Customer, (customer) => customer.company)
  customers!: Customer[];
}

export default Company;
