import { Request, Response } from "express";
import { IResponseType } from "../../core/IResponseType";
import { ResponseBuilder } from "../../core/response-builder";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private ds: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: any = await this.ds.login(params);
      ResponseBuilder.Ok<any>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  customerLogin = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: any = await this.ds.customerLogin(params);
      ResponseBuilder.Ok<any>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const result: any = await this.ds.forgotPassword(params);
      ResponseBuilder.Ok<any>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
