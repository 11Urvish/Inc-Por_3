import { SelectQueryBuilder } from "typeorm";
import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";

import { MESSAGE, ROLE } from "../../shared/constants/app.const";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { APP_ENUM } from "../../shared/enums/app.enum";

import { NxService } from "../../shared/nx-library/nx-service";
import CustomerPolicyDoc from "../../entities/CustomerPolicyDoc";

const customerPolicyDocRepository = AppDataSource.getRepository(CustomerPolicyDoc);

export class CompanyService {
  constructor(private nx: NxService) {}
  /**
   * @name update
   * @param params
   */
  update = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const { id } = params;
      const policyDoc = await customerPolicyDocRepository.findOne({ where: { id: id } });

      if (!policyDoc) {
        throw new Error("Document not found");
      }
      // const customerPolicyDocModel = new CustomerPolicyDoc();
      policyDoc.docLink = params.docLink;
      policyDoc.status = APP_ENUM.STATUS.DOC_UPLOAD.UPLOADED;
      policyDoc.agentApproval = APP_ENUM.STATUS.AGENT_APPROVAL.PENDING;
      // await customerPolicyDocRepository.save(policyDoc);
      //const result = await customerPolicyDocRepository.save(policyDoc);
      const result = await customerPolicyDocRepository.update({ id: id }, policyDoc);

      response = { message: MESSAGE.UPDATE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };

  approvedByAgent = async (params: any): Promise<any> => {
    let response: IResponseType;
    try {
      const { id, status } = params;
      const policyDoc = await customerPolicyDocRepository.findOne({ where: { id: id } });

      if (!policyDoc) {
        throw new Error("Document not found");
      }
      policyDoc.agentApproval = status;
      const result = await customerPolicyDocRepository.update({ id: id }, policyDoc);
      response = { message: MESSAGE.UPDATE, data: result };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
