import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import Country from "./Country";

@Entity("state")
class State {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  status!: boolean;

  @ManyToOne(() => Country, (country) => country.state)
  country!: Country;
}

export default State;
