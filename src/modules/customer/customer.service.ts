import { SelectQueryBuilder } from "typeorm";
import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import Customer from "../../entities/Customer";
import { NxService } from "../../shared/nx-library/nx-service";
import Company from "../../entities/Company";
import User from "../../entities/User";
import { MESSAGE, ROLE } from "../../shared/constants/app.const";
import { MailService } from "../../shared/services/mail.service";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { APP_ENUM } from "../../shared/enums/app.enum";

const nodemailer = require("nodemailer");

const customerRepository = AppDataSource.getRepository(Customer);
const companyRepository = AppDataSource.getRepository(Company);
const userRepository = AppDataSource.getRepository(User);

export class CustomerService {
  constructor(private nx: NxService, private mailService: MailService) { }

  /**
   * @name findAll
   * @param params
   */
  findAll = async (params: any): Promise<any> => {
    let response: IResponseType;
    const { cid, uid, uRole, page, limit, filter } = params;

    const queryBuilder = customerRepository
      .createQueryBuilder("customer")
      .innerJoinAndSelect("customer.company", "company")
      .innerJoinAndSelect("customer.user", "user");

    if (uRole === ROLE.ADMIN) {
      queryBuilder.where("customer.companyId = :cid", { cid });
    } else if (uRole === ROLE.AGENT) {
      queryBuilder.where("customer.userId = :uid", { uid });
    }

    if (filter && filter !== "") {
      queryBuilder.andWhere("customer.firstName like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("customer.lastName like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("customer.email like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("customer.phone like :filter", { filter: `%${filter}%` });
    }

    queryBuilder.select([
      "customer.id",
      "customer.firstName",
      "customer.lastName",
      "customer.email",
      "customer.status",
      "customer.phone",
      "customer.agent",
      "customer.createdAt",
      "customer.updatedAt",
      "company.id",
      "company.name",
      "user.id",
      "user.name",
    ]);

    const [customer, totalCount] = await applyPagination(queryBuilder, page, limit);

    response = { message: MESSAGE.GET_ALL, data: { result: customer, totalCount } };
    return response;
  };

  /**
   * @name findById
   * @param params
   */

  findById = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const { userId, uRole, id } = params;

      const queryBuilder = customerRepository;
      const result = await queryBuilder.createQueryBuilder("customer").innerJoinAndSelect("customer.user", "user").where("customer.id = :id", { id }).getOne();

      response = { message: MESSAGE.GET, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };
  // findById = async (params: any): Promise<any> => {
  //   let response: IResponseType;
  //   try {
  //     const result = await customerRepository.findOne({ where: { id: params.id } });
  //     response = { message: MESSAGE.GET, data: result };
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  /**
   * @name findByUserId
   * @param params
   */
  findByUserId = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const { cid, uid, uRole } = params;

      const queryBuilder = customerRepository.createQueryBuilder("customer");

      if (uRole === ROLE.AGENT) {
        queryBuilder.where("customer.createdBy = :uid", { uid });
      } else {
        queryBuilder.where("customer.companyId = :cid", { cid });
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
    let response: IResponseType;
    try {
      console.log("params", params);

      const { cid, uid, uType, email, agent } = params;

      let agentId = +agent;
      if (uType === ROLE.AGENT) {
        agentId = +uid;
      }

      let customer: any = await customerRepository.findOne({ where: { email: email } });

      if (customer) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.DUPLICATE.replace("{0}", `Email ${email}`));
      }

      const company = await companyRepository.createQueryBuilder("company").where("company.id = :cid", { cid }).getOne();
      if (!company) {
        throw new Error("Company not found");
      }

      const user = await userRepository.createQueryBuilder("user").where("user.id = :agentId", { agentId }).getOne();
      if (!user) {
        throw new Error("User not found");
      }

      const passwordHash = await this.nx.crypto.hashPassword(params.password);

      let customerModel: any = new Customer();
      customerModel = {
        company: company,
        user: user,
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email.toLowerCase(),
        phone: params.phone,
        agent: params.agent,
        password: passwordHash,
        status: params.status || 1,
        createdBy: uid,
        updatedBy: uid,
      };
      await customerRepository.save(customerModel);

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
              <p style="margin-bottom: 20px;">Congrats! ${params.firstName} ${params.lastName}</p>
              <p style="margin-bottom: 20px;">Your credentials are Email=${params.email} Password=${params.password}</p>
              <p style="margin-bottom: 20px;">To get started, please click the button below with your credentials:</p>
              <a href="https://customer.orbitplus.xyz" style="display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Orbit Plus Portal Link</a>
            </div>
          </div>
        </body>
        </html>`,
      });

      console.log("mailResponse", mailResponse);

      response = { message: MESSAGE.CREATE, data: customerModel };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name update
   * @param params
   */
  update = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const { cid, uid, agent, email } = params;

      let customer: any = await customerRepository.findOne({ where: { email: email } });

      if (customer) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.TYPE.ERROR.CONFLICT, MESSAGE.DUPLICATE.replace("{0}", `Email ${email}`));
      }

      const company = await companyRepository.createQueryBuilder("company").where("company.id = :cid", { cid }).getOne();
      const user: any = await userRepository.createQueryBuilder("user").where("user.id = :uid", { uid }).getOne();

      if (!user) {
        throw new Error("User not found");
      }
      // const agentData = await userRepository.createQueryBuilder("user").where("user.role = :agent", { agent }).getOne();

      let customerModel: any = await customerRepository.findOne({ where: { id: params.id } });
      if (!customerModel) {
        throw new Error("Customer not found");
      }
      customerModel = {
        company: company,
        user: user,
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email.toLowerCase(),
        phone: params.phone,
        agent: params.agent,
        status: params.status,
        updatedBy: uid,
      };
      const result = await customerRepository.update({ id: params.id }, customerModel);
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
      const result = await customerRepository.delete({ id: params.id });
      response = { message: MESSAGE.DELETE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
async function applyPagination(queryBuilder: SelectQueryBuilder<Customer>, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;

  const [results, totalCount] = await queryBuilder.take(take).skip(skip).getManyAndCount();

  return [results, totalCount];
}
