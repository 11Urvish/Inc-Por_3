import { SelectQueryBuilder } from "typeorm";
import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import Customer from "../../entities/Customer";
import { NxService } from "../../shared/nx-library/nx-service";
import Company from "../../entities/Company";
import User from "../../entities/User";
import { MESSAGE, ROLE } from "../../shared/constants/app.const";
import { MailService } from "../../shared/services/mail.service";
import CustomerPolicy from "../../entities/CustomerPolicy";

const companyRepository = AppDataSource.getRepository(Company);
const customerRepository = AppDataSource.getRepository(Customer);
const userRepository = AppDataSource.getRepository(User);
const customerPolicyRepository = AppDataSource.getRepository(CustomerPolicy);

export class DashboardService {
  constructor(private nx: NxService, private mailService: MailService) {}

  /**
   * @name findAll
   * @param params
   */
  findAdminMasterData = async (params: any): Promise<any> => {
    let response: IResponseType;
    const { cid, uid, uRole } = params;
    let masterData: any[] = [];

    if (uRole === ROLE.SUPER_ADMIN) {
      const companyQueryBuilder = companyRepository.createQueryBuilder("company");

      const companyCount = await companyQueryBuilder.getCount();
      masterData.push({ title: "Total Companies", value: companyCount, icon: "users" });

      const userQueryBuilder = userRepository.createQueryBuilder("user");
      const roles = [ROLE.ADMIN, ROLE.AGENT];
      userQueryBuilder.where("user.role IN (:...roles)", { roles });
      const userCount = await userQueryBuilder.getCount();
      masterData.push({ title: "Total Users", value: userCount, icon: "users" });

      const customerQueryBuilder = customerRepository.createQueryBuilder("customer");
      const customerCount = await customerQueryBuilder.getCount();
      masterData.push({ title: "Total Customers", value: customerCount, icon: "users" });
    } else if (uRole === ROLE.ADMIN) {
      const userQueryBuilder = userRepository.createQueryBuilder("user");
      const roles = [ROLE.ADMIN, ROLE.AGENT];
      userQueryBuilder.where("user.role IN (:...roles)", { roles });
      userQueryBuilder.andWhere("user.companyId = :cid", { cid });
      const userCount = await userQueryBuilder.getCount();
      masterData.push({ title: "Total Users", value: userCount, icon: "users" });

      const customerQueryBuilder = customerRepository.createQueryBuilder("customer");
      customerQueryBuilder.where("customer.companyId = :cid", { cid });
      const customerCount = await customerQueryBuilder.getCount();
      masterData.push({ title: "Total Customers", value: customerCount, icon: "users" });

      const customerPolicyQueryBuilder = customerPolicyRepository.createQueryBuilder("customerPolicy");
      customerPolicyQueryBuilder.leftJoinAndSelect("customerPolicy.customer", "customer");
      customerPolicyQueryBuilder.where("customer.companyId = :cid", { cid });
      const customerPolicyCount = await customerPolicyQueryBuilder.getCount();
      masterData.push({ title: "Total Policies", value: customerPolicyCount, icon: "users" });
    } else if (uRole === ROLE.AGENT) {
      const customerQueryBuilder = customerRepository.createQueryBuilder("customer");
      customerQueryBuilder.where("customer.createdBy = :uid", { uid });
      const customerCount = await customerQueryBuilder.getCount();
      masterData.push({ title: "Total Customers", value: customerCount, icon: "users" });

      const customerPolicyQueryBuilder = customerPolicyRepository.createQueryBuilder("customerPolicy");
      customerPolicyQueryBuilder.leftJoinAndSelect("customerPolicy.customer", "customer");
      customerPolicyQueryBuilder.where("customer.companyId = :cid", { cid });
      // customerPolicyQueryBuilder.where("customerPolicy.createdBy = :uid", { uid });
      const customerPolicyCount = await customerPolicyQueryBuilder.getCount();
      masterData.push({ title: "Total Policies", value: customerPolicyCount, icon: "users" });
    }

    response = { message: MESSAGE.GET_ALL, data: masterData };
    return response;
  };

  /**
   * @name findById
   * @param params
   */
  findCustomerDashboard = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const result = await customerRepository.find({ where: { id: params.id } });
      response = { message: MESSAGE.GET, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
