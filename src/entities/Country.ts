import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import State from "./State";


@Entity("country")
class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @Column()
  currency!: string;

  @Column()
  currencySymbol!: string;

  @Column()
  capital!: string;

  @Column()
  continent!: string;

  @Column()
  countryPhoneCode!: number;

  @Column()
  status!: boolean;

  @OneToMany(() => State, (state) => state.country)
  state!: State[];
}

export default Country;
