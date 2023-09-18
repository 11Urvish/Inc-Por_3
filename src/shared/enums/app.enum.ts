import { ErrorCodeEnum } from "./error-code.enum";
import { HttpStatusEnum } from "./http-status.enum";
import { LookupEnum } from "./lookup.enum";
import { PaymentMethodEnum } from "./payment-method.enum";
import { SortEnum } from "./sort.enum";
import { AgentApprovalsEnum, CompanyStatusEnum, DocUploadStatusEnum, PolicyStatusEnum, UserStatusEnum } from "./status.enum";
import { ErrorTypeEnum, PaymentTypeEnum, TransactionTypeEnum, UPITypeEnum, UserTypeEnum } from "./type.enum";

export const APP_ENUM = {
  ERROR_CODE: ErrorCodeEnum,
  HTTP_STATUS: HttpStatusEnum,
  LOOKUP: LookupEnum,
  SORT: SortEnum,
  PAYMENT_METHOD: PaymentMethodEnum,
  TYPE: {
    USER: UserTypeEnum,
    TRANSATION: TransactionTypeEnum,
    PAYMENT: PaymentTypeEnum,
    UPI: UPITypeEnum,
    ERROR: ErrorTypeEnum,
  },
  STATUS: {
    COMPANY: CompanyStatusEnum,
    USER: UserStatusEnum,
    DOC_UPLOAD: DocUploadStatusEnum,
    POLICY: PolicyStatusEnum,
    AGENT_APPROVAL: AgentApprovalsEnum
  },
};
