import { SelectQueryBuilder } from "typeorm";
import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import User from "../../entities/User";
import { MESSAGE, ROLE } from "../../shared/constants/app.const";
import { NxService } from "../../shared/nx-library/nx-service";
import Company from "../../entities/Company";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { MailService } from "../../shared/services/mail.service";

const companyRepository = AppDataSource.getRepository(Company);
const userRepository = AppDataSource.getRepository(User);

export class UserService {
  constructor(private nx: NxService, private mailService: MailService) { }

  /**
   * @name findAll
   * @param params
   */
  findAll = async (params: any): Promise<any> => {
    let response: IResponseType;

    const { cid, uid, uRole, page, limit, sort, sortBy, filter, id } = params;

    let companyId = 0;
    if (id) {
      companyId = +id;
    }

    const queryBuilder = userRepository.createQueryBuilder("user").innerJoinAndSelect("user.company", "company");


    // let role: any = [];
    if (uRole !== ROLE.SUPER_ADMIN) {
      //role = [ROLE.ADMIN, ROLE.AGENT];
      queryBuilder.where("user.companyId = :cid", { cid });
    }

    let roles: any = [];

    if (uRole == ROLE.SUPER_ADMIN) {
      roles = [ROLE.ADMIN, ROLE.AGENT];
      if (companyId > 0) {
        queryBuilder.where("user.role IN (:...roles)", { roles });
        queryBuilder.andWhere("user.companyId = :companyId", { companyId });
      } else {
        queryBuilder.where("user.role IN (:...roles)", { roles });
      }
    } else if (uRole == ROLE.ADMIN) {
      roles = [ROLE.ADMIN, ROLE.AGENT];
      queryBuilder.andWhere("user.role IN (:...roles)", { roles });
    }

    if (filter && filter !== "") {
      queryBuilder.andWhere("user.name like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("user.email like :filter", { filter: `%${filter}%` });
      //queryBuilder.orWhere("user.role like :filter", { filter: `%${filter}%` });
    }

    queryBuilder.select(["company.id", "company.name", "user.id", "user.name", "user.email", "user.status", "user.role", "user.createdAt", "user.updatedAt"]);

    const [users, totalCount] = await applyPagination(queryBuilder, page, limit);

    response = { message: MESSAGE.GET_ALL, data: { result: users, totalCount } };
    return response;
  };

  /**
   * @name findById
   * @param params
   */
  findById = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const result = await userRepository.findOne({ where: { id: params.id } });
      response = { message: MESSAGE.GET, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findAgentByCompanyId
   * @param params
   */
  findAgentByCompanyId = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;
      const { cid, uid, uRole } = params;
      const queryBuilder = userRepository.createQueryBuilder("user");
      let roles: any[] = [ROLE.AGENT];

      if (uRole !== ROLE.SUPER_ADMIN) {
        queryBuilder.where("user.companyId = :cid", { cid });
        queryBuilder.andWhere("user.role IN (:...roles)", { roles });
      }
      const result = await queryBuilder.getMany();
      response = { message: MESSAGE.GET, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name create
   * @param params
   */
  create = async (params: any): Promise<any> => {
    try {
      const USER_STATUS: any = APP_ENUM.STATUS.USER;

      let response: IResponseType;
      const { cid, uid, uRole, email } = params;

      let user: any = await userRepository.findOne({ where: { email: email } });

      if (user) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.DUPLICATE.replace("{0}", `Email ${email}`));
      }

      if (uRole !== ROLE.ADMIN) {
        throw new Error("You are not authorized to create user");
      }

      const company = await companyRepository.createQueryBuilder("company").where("company.id = :cid", { cid }).getOne();
      if (!company) {
        throw new Error("Company not found");
      }

      const userCount = await userRepository.createQueryBuilder("user").where("user.companyId = :cid", { cid }).getCount();

      if (userCount >= company.userCount) {
        throw new Error("User limit reached");
      }

      const passwordHash = await this.nx.crypto.hashPassword(params.password);

      let userModel: any = new User();
      userModel = {
        company: company,
        name: params.name,
        email: params.email.toLowerCase(),
        password: passwordHash,
        role: params.role,
        status: USER_STATUS.ACTIVE,
        createdBy: uid,
        updatedBy: uid,
      };
      await userRepository.save(userModel);

      // update activeUserCount and userCount in company table
      company.activeUserCount = userCount + 1;
      await companyRepository.save(company);

      const mailResponse = await this.mailService.sendMail({
        to: params.email,
        subject: "Orbit - Account Created",
        html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Account Creation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #fff; padding: 30px; border-radius: 5px;">
              <h2>Welcome to OrbitPlus!</h2>
              <p style="margin-bottom: 20px;">Congrats! ${params.name}</p>
              <p style="margin-bottom: 20px;">Your credentials are Email=${params.email.toLowerCase()} Password=${params.password}</p>
              <p style="margin-bottom: 20px;">To get started, please click the button below with your credentials:</p>
              <a href="https://orbitplus.xyz" style="display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Orbit Plus Admin Portal Link</a>
            </div>
          </div>
        </body>
        </html>`,
      });

      response = { message: MESSAGE.CREATE, data: userModel };
      return response;
    } catch (error) {
      throw error;
    }
  };

  update = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;
      const { cid, uid, uRole, email, id } = params;

      let user: any = await userRepository.findOne({ where: { email: email } });

      if (user) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.DUPLICATE.replace("{0}", `Email ${email}`));
      }
      let uModel: any = await userRepository.findOne({ where: { id: id } });

      if (!uModel) {
        throw new Error("User not found");
      }
      const userModel = new User();

      userModel.id = params.id;
      userModel.name = params.name;
      userModel.role = params.role;
      userModel.email = params.email.toLowerCase();
      userModel.updatedBy = uid;

      const result = await userRepository.save(userModel);

      response = { message: MESSAGE.UPDATE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name delete
   * @param params
   */

  delete = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const result = await userRepository.delete({ id: params.id });
      response = { message: MESSAGE.DELETE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name changePassword
   * @param params
   */
  changePassword = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;
      const { uid, password, currPassword } = params;

      const user = await userRepository.findOne({ where: { id: uid } });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordMatch = await this.nx.crypto.verifyPassword(user.password, currPassword);

      if (!isPasswordMatch) {
        throw new Error("Current password is incorrect");
      }

      const passwordHash = await this.nx.crypto.hashPassword(password);
      const userModel = new User();
      userModel.id = uid;
      userModel.password = passwordHash;
      await userRepository.save(userModel);
      response = { message: MESSAGE.PASSWORD_CHANGE, data: null };
      return response;
    } catch (error) {
      throw error;
    }
  };
}

async function applyPagination(queryBuilder: SelectQueryBuilder<User>, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;
  const [results, totalCount] = await queryBuilder.take(take).skip(skip).getManyAndCount();
  return [results, totalCount];
}
