import * as passportJwt from "passport-jwt";
import CONFIG from "../config/config";
import { AppDataSource } from "../database/data-source";
import User from "../entities/User";
import Customer from "../entities/Customer";

const userRepository = AppDataSource.getRepository(User);
const custRepository = AppDataSource.getRepository(Customer);

const JwtStrategy = passportJwt.Strategy;
module.exports = (passport: any) => {
  console.log("yaaay-its-a-secret");
  const opts = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "yaaay-its-a-secret",
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const id = jwt_payload.sub;

        if (jwt_payload.iss === "dbe.customer") {
          const queryBuilder = custRepository.createQueryBuilder("customer");

          if (!id) {
            return done(null, false);
          }

          let customer: any = await queryBuilder.where("customer.id = :id", { id }).
            innerJoinAndSelect("customer.company", "company").getOne();

          if (customer) {
            if (customer.company && customer.company.id) {
              customer.companyId = customer.company.id;
            }

            const reqData = {
              cid: customer.companyId,
              uid: customer.id,
              uRole: 'customer'
            };
            return done(null, reqData, { scope: "read" });
          }

        } else if (jwt_payload.iss === "dbe.user") {
          const queryBuilder = userRepository.createQueryBuilder("user");

          if (!id) {
            return done(null, false);
          }

          if (id !== 1) {
            queryBuilder.innerJoinAndSelect("user.company", "company");
          }
          let user: any = await queryBuilder.where("user.id = :id", { id }).getOne();

          if (user) {
            if (user.company && user.company.id) {
              user.companyId = user.company.id;
            } else {
              user.companyId = null;
            }

            const reqData = {
              cid: user.companyId,
              uid: user.id,
              uRole: user.role,
            };
            return done(null, reqData, { scope: "read" });
          }
        }
        return done(null, false);

      } catch (error) {
        return done(error, false);
      }
    })
  );
};
