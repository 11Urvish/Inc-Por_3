import { DataSource } from "typeorm";
import User from "../entities/User";
import Company from "../entities/Company";
import Customer from "../entities/Customer";
import CustomerPolicy from "../entities/CustomerPolicy";
import CustomerPolicyDoc from "../entities/CustomerPolicyDoc";
import { CreateCompanyTable1687080143945 } from "./migrations/1687080143945-CreateCompanyTable";
import { CreateUserTable1687080085700 } from "./migrations/1687080085700-CreateUserTable";
import { CreateCustomerTable1687080267378 } from "./migrations/1687080267378-CreateCustomerTable";
import { CreateCustomerPolicyTable1687080440966 } from "./migrations/1687080440966-CreateCustomerPolicyTable";
import { CreateCustomerPolicyDocTable1687080521853 } from "./migrations/1687080521853-CreateCustomerPolicyDocTable";
import Country from "../entities/Country";
import State from "../entities/State";
import { CreateStateTable1687514504094 } from "./migrations/1687514504094-CreateStateTable";
import { CreateCountryTable1687514494944 } from "./migrations/1687514494944-CreateCountryTable";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "db-mysql-fra1-89326-do-user-14211676-0.b.db.ondigitalocean.com",
  port: 25060,
  username: "doadmin",
  password: "AVNS_Jn1x50A661FjUBcMCqP",
  database: "insurance_docs_portal_db",
  synchronize: true,
  logging: false,
  entities: [Company, User, Customer, CustomerPolicy, CustomerPolicyDoc, Country, State],
  migrations: [
    CreateCompanyTable1687080143945,
    CreateUserTable1687080085700,
    CreateCustomerTable1687080267378,
    CreateCustomerPolicyTable1687080440966,
    CreateCustomerPolicyDocTable1687080521853,
    CreateCountryTable1687514494944,
    CreateStateTable1687514504094
  ],
  subscribers: [],
});
// entities: ["src/entities/**/*.ts"],

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!");
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization", err);
//   });

export { AppDataSource };
