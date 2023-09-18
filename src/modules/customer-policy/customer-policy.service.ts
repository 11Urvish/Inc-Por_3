import { SelectQueryBuilder } from "typeorm";
import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import { MESSAGE, ROLE } from "../../shared/constants/app.const";
import CustomerPolicy from "../../entities/CustomerPolicy";
import { NxService } from "../../shared/nx-library/nx-service";
import { MailService } from "@sendgrid/mail";
import { response } from "express";
import User from "../../entities/User";
import Customer from "../../entities/Customer";
import { APP_ENUM } from "../../shared/enums/app.enum";
import CustomerPolicyDoc from "../../entities/CustomerPolicyDoc";

const userRepository = AppDataSource.getRepository(User);
const customerRepository = AppDataSource.getRepository(Customer);
const customerPolicyRepository = AppDataSource.getRepository(CustomerPolicy);
const customerPolicyDocRepository = AppDataSource.getRepository(CustomerPolicyDoc);

export class CustomerPolicyService {
  constructor(private nx: NxService) { }

  /**
   * @name findAll
   * @description
   */
  findAll = async (params: any): Promise<any> => {
    let response: IResponseType;

    const { cid, uid, uRole, page, limit, filter } = params;

    // const queryBuilder = customerPolicyRepository.createQueryBuilder("customerPolicy")
    // .innerJoinAndSelect("customerPolicy.customer", "customer");

    const queryBuilder = customerPolicyRepository.createQueryBuilder("customerPolicy");

    if (uRole !== ROLE.SUPER_ADMIN) {
      queryBuilder
        .leftJoinAndSelect("customerPolicy.customer", "customer")
        // .leftJoin(Customer, "cust", "customerPolicy.customerId = cust.id")
        .where("customer.companyId = :cid", { cid })
        .select([
          "customerPolicy.id",
          "customerPolicy.policyNo",
          "customerPolicy.policyType",
          "customerPolicy.policySubType",
          "customerPolicy.status",
          "customerPolicy.registeredDate",
          "customerPolicy.createdAt",
          "customerPolicy.updatedAt",
          "customer.firstName",
          "customer.lastName",
        ]);
    } else {
      queryBuilder.innerJoinAndSelect("customerPolicy.customer", "customer");
    }

    // .leftJoin(Customer, "customer", "customerPolicy.customerId = customer.id");

    // if (uRole !== ROLE.SUPER_ADMIN) {
    // queryBuilder.where("customerPolicy.customer.companyId = :cid", { cid });
    // }

    if (filter && filter !== "") {
      queryBuilder.andWhere("customerPolicy.policyNo like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("customerPolicy.policyType like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("customerPolicy.firstName like :filter", { filter: `%${filter}%` });
      queryBuilder.orWhere("customerPolicy.lastName like :filter", { filter: `%${filter}%` });
    }
    const [policies, totalCount] = await applyPagination(queryBuilder, page, limit);

    response = { message: MESSAGE.GET_ALL, data: { result: policies, totalCount } };
    return response;
  };

  /**
   * @name findById
   * @description
   */
  findById = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;
      const { uid, uRole, id } = params;

      const queryBuilder = customerPolicyRepository;
      const result = await queryBuilder
        .createQueryBuilder("customerPolicy")
        .innerJoinAndSelect("customerPolicy.customer", "customer")
        .leftJoinAndSelect("customerPolicy.customerPolicyDoc", "customerPolicyDoc")
        .where("customerPolicy.id = :id", { id })
        .getOne();

      response = { message: MESSAGE.GET, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  findPolicyById = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;
      const { uid, uRole, id } = params;

      const queryBuilder = customerPolicyRepository;
      const result = await queryBuilder
        .createQueryBuilder("customerPolicy")
        .leftJoinAndSelect("customerPolicy.customerPolicyDoc", "customerPolicyDoc")
        .where("customerPolicy.id = :id", { id })
        .getOne();

      response = { message: MESSAGE.GET, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name findByPolicyCustomerId
   * @param params
   */
  findPolicyByCustomerId = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const { uid, uRole, page, limit } = params;

      // if (uRole !== ROLE.CUSTOMER) {
      //     queryBuilder.where("customerPolicy.createdBy = :uid", { uid });
      //     return{}
      // }

      const queryBuilder = customerPolicyRepository.createQueryBuilder("customerPolicy").where("customerPolicy.customerId = :uid", { uid });

      const [customerPolicies, totalCount] = await applyPagination(queryBuilder, page, limit);

      response = { message: MESSAGE.GET_ALL, data: { result: customerPolicies, totalCount } };
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @name create
   * @description
   * @param params
   * @returns
   */

  create = async (params: any): Promise<any> => {
    const POLICY_STATUS: any = APP_ENUM.STATUS.POLICY;
    const DOC_UPLOAD_STATUS: any = APP_ENUM.STATUS.DOC_UPLOAD;
    const AGENT_APPROVAL_STATUS: any = APP_ENUM.STATUS.AGENT_APPROVAL;
    let response: IResponseType;
    try {
      console.log("params", params);
      const { cid, uid, customerId, docTypeList } = params;

      const customer = await customerRepository.createQueryBuilder("customer").where("customer.id = :customerId", { customerId }).getOne();
      if (!customer) {
        throw new Error("Customer not found");
      }

      const dateRegistered = new Date(params.registeredDate);

      let customerPolicyModel: any = new CustomerPolicy();
      customerPolicyModel = {
        customer: customer,
        policyNo: params.policyNo,
        policyType: params.policyType,
        policySubType: params.policySubType,
        registeredDate: dateRegistered,
        status: POLICY_STATUS.PENDING,
        createdBy: uid,
        updatedBy: uid,
      };
      await customerPolicyRepository.save(customerPolicyModel);

      if (docTypeList && docTypeList.length > 0) {
        let custPolicyDocModelList: any = [];
        docTypeList.forEach((item: any) => {
          let custPolicyDocModel: any = new CustomerPolicyDoc();
          custPolicyDocModel = {
            customerPolicy: customerPolicyModel,
            docType: item.docType,
            docLink: item.docLink || "",
            status: DOC_UPLOAD_STATUS.PENDING,
            agentApproval: AGENT_APPROVAL_STATUS.PENDING,
            description: item.description || "",
            uploadedAt: new Date() || "",
            createdBy: uid,
            updatedBy: uid,
          };
          custPolicyDocModelList.push(custPolicyDocModel);
        });
        await customerPolicyDocRepository.save(custPolicyDocModelList);
      }
      response = { message: MESSAGE.CREATE, data: customerPolicyModel };
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
    const POLICY_STATUS: any = APP_ENUM.STATUS.POLICY;
    const DOC_UPLOAD_STATUS: any = APP_ENUM.STATUS.DOC_UPLOAD;
    const AGENT_APPROVAL_STATUS: any = APP_ENUM.STATUS.AGENT_APPROVAL;
    let response: IResponseType;
    try {
      const { cid, uid, id, docTypeList } = params;

      let customerPolicyModel: any = await customerPolicyRepository.findOne({ where: { id: id } });

      if (!customerPolicyModel) {
        throw new Error("CustomerPolicy not found");
      }

      customerPolicyModel = {
        policyNo: params.policyNo,
        policyType: params.policyType,
        policySubType: params.policySubType,
        updatedBy: uid,
      };

      await customerPolicyRepository.update({ id: params.id }, customerPolicyModel);

      const customerPolicy = await customerPolicyRepository.findOne({ where: { id: id } });

      if (docTypeList && docTypeList.length > 0) {
        let custPolicyDocModelList: any = [];
        docTypeList.forEach((item: any) => {
          if (item.id === 0 || item.id === null || item.id === undefined || item.id === "") {
            let custPolicyDocModel: any = new CustomerPolicyDoc();
            custPolicyDocModel = {
              customerPolicy: customerPolicy,
              docType: item.docType,
              docLink: item.docLink || "",
              status: DOC_UPLOAD_STATUS.PENDING,
              agentApproval: AGENT_APPROVAL_STATUS.PENDING,
              description: item.description || "",
              uploadedAt: new Date() || "",
              createdBy: uid,
              updatedBy: uid,
            };
            custPolicyDocModelList.push(custPolicyDocModel);
          }
        });
        await customerPolicyDocRepository.save(custPolicyDocModelList);
      }

      response = { message: MESSAGE.UPDATE, data: customerPolicyModel };
      return response;
    } catch (error) {
      throw error;
    }
  };
  /**
   * @name delete
   * @description
   * @param params
   * @returns
   * @memberof CustomerPolicyService
   */

  delete = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const result = await customerPolicyRepository.delete({ id: params.id });
      response = { message: MESSAGE.DELETE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
//   delete = async (params: any): Promise<any> => {
//     let response: IResponseType;
//     try {
//       const result = await customerPolicyRepository.delete({ id: params.id });
//       response = { message: MESSAGE.DELETE, data: result };
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };
// }

async function applyPagination(queryBuilder: SelectQueryBuilder<CustomerPolicy>, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;

  const [results, totalCount] = await queryBuilder.take(take).skip(skip).getManyAndCount();

  return [results, totalCount];
}
