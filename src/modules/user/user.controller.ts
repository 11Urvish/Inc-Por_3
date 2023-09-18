import { Request, Response } from "express";
import { IResponseType } from "../../core/IResponseType";
import { UserService } from "./user.service";
import { ResponseBuilder } from "../../core/response-builder";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";

export class UserController {
  constructor(private ds: UserService) {}

  findAll = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: any = await this.ds.findAll(params);
      ResponseBuilder.Ok<any>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      const result: IResponseType = await this.ds.findById(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  findAgentByCompanyId = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      const result: IResponseType = await this.ds.findAgentByCompanyId(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: any = await this.ds.create(params);
      ResponseBuilder.Ok<any>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.body };
      const result: IResponseType = await this.ds.update(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.body };
      const result: IResponseType = await this.ds.delete(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const params = { ...req.body, ...req.user };
      const result: IResponseType = await this.ds.changePassword(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
