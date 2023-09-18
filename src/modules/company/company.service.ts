import { SelectQueryBuilder } from "typeorm";
import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import Company from "../../entities/Company";
import { MESSAGE, ROLE } from "../../shared/constants/app.const";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { APP_ENUM } from "../../shared/enums/app.enum";
import User from "../../entities/User";
import { NxService } from "../../shared/nx-library/nx-service";

const companyRepository = AppDataSource.getRepository(Company);
const userRepository = AppDataSource.getRepository(User);

export class CompanyService {
  constructor(private nx: NxService) { }

  /**
   * @name findAll
   * @param params
   */
  findAll = async (params: any): Promise<any> => {
    const { cid, uid, uRole, page, limit, filter } = params;
    let response: IResponseType;
    if (uRole == ROLE.CUSTOMER) {
      throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_USER_ROLE);
    }

    const queryBuilder = companyRepository.createQueryBuilder("company");

    if (uRole !== ROLE.SUPER_ADMIN) {
      throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_USER_ROLE);
    }
    if (filter && filter !== "") {
      queryBuilder.andWhere("company.name like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("company.email like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("company.phone like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("company.address like :filter", { filter: `%${filter}%` });
    }
    const [company, totalCount] = await applyPagination(queryBuilder, page, limit);

    response = { message: MESSAGE.GET_ALL, data: { result: company, totalCount } };
    return response;

  };


  /**
   * @name findById
   * @param params
   */
  findById = async (params: any): Promise<any> => {
    try {
      const { cid, uid, uRole, id } = params;

      let response: IResponseType;

      if (uRole == ROLE.CUSTOMER) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_USER_ROLE);
      }
      const result = await companyRepository.findOne({ where: { id: id } });
      response = { message: MESSAGE.DELETE, data: result };
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
      const COMPANY_STATUS: any = APP_ENUM.STATUS.COMPANY;
      const USER_STATUS: any = APP_ENUM.STATUS.USER;
      const { cid, uid, uRole, user } = params;
      let response: IResponseType;

      if (uRole == ROLE.CUSTOMER) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_USER_ROLE);
      }

      let countMonth = 0;
      if (params.plan == "monthly") {
        countMonth = 1;
      } else if (params.plan == "quarterly") {
        countMonth = 3;
      } else if (params.plan == "half_yearly") {
        countMonth = 6;
      } else if (params.plan == "yearly") {
        countMonth = 12;
      }

      const d = new Date();
      const date = d.getDate();
      const month = d.getMonth() + 1 + countMonth;
      const year = d.getFullYear();

      const generateExpiryDate = (date: number, month: number, year: number) => {
        const expiryDate = new Date(year, month, date);
        return expiryDate;
      };

      let companyModel: any = new Company();
      companyModel = {
        name: params.name,
        email: params.email.toLowerCase(),
        phone: params.phone,
        address: params.address,
        country: params.country,
        state: params.state,
        city: params.city,
        pincode: params.pincode,
        plan: params.plan || "monthly",
        userCount: +params.userCount,
        activeUserCount: 1,
        status: +params.status || COMPANY_STATUS.ACTIVE,
        expiryDate: generateExpiryDate(date, month, year),
        createdBy: uid,
        updatedBy: uid,
      };
      await companyRepository.save(companyModel);

      const company: any = await companyRepository.findOne({ where: { id: companyModel.id } });

      const passwordHash = await this.nx.crypto.hashPassword(user.password);
      let userModel: any = new User();
      userModel = {
        name: user.name,
        email: user.email.toLowerCase(),
        password: passwordHash,
        role: ROLE.ADMIN,
        company: company,
        status: USER_STATUS.ACTIVE,
        createdBy: uid,
        updatedBy: uid,
      };
      await userRepository.save(userModel);

      response = { message: MESSAGE.CREATE, data: companyModel };
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
      const { uid } = params;
      const cModel = await companyRepository.findOne({ where: { id: params.id } });
      if (!cModel) {
        throw new Error("Company not found");
      }
      let companyModel: any = new Company();
      companyModel = {
        id: params.id,
        name: params.name,
        email: params.email.toLowerCase(),
        phone: params.phone,
        plan: params.plan,
        address: params.address,
        country: params.country,
        state: params.state,
        city: params.city,
        pincode: params.pincode,
        userCount: +params.userCount,
        status: +params.status,
        updatedBy: uid,
      };
      const result = await companyRepository.update({ id: params.id }, companyModel);

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
      const result = await companyRepository.delete({ id: params.id });
      response = { message: MESSAGE.DELETE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };
}

/**
 * @name applyPagination
 * @param queryBuilder
 * @param page
 * @param limit
 */
async function applyPagination(queryBuilder: SelectQueryBuilder<Company>, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;

  const [results, totalCount] = await queryBuilder.take(take).skip(skip).getManyAndCount();

  return [results, totalCount];
}
