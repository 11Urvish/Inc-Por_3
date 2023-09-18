import { Request, Response } from "express";
import { IResponseType } from "../../core/IResponseType";
import { ResponseBuilder } from "../../core/response-builder";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  constructor(private ds: DashboardService) {}

  findAdminMasterData = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: any = await this.ds.findAdminMasterData(params);
      ResponseBuilder.Ok<any>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  findCustomerDashboard = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      const result: IResponseType = await this.ds.findCustomerDashboard(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
