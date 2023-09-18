import { Request, Response } from "express";
import { IResponseType } from "../../core/IResponseType";
import { CustomerService } from "./customer.service";
import { ResponseBuilder } from "../../core/response-builder";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";

export class CustomerController {
  constructor(private ds: CustomerService) { }

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

  findByUserId = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      const result: IResponseType = await this.ds.findByUserId(params);
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
      const params = { ...req.body, ...req.user };
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
      const params = { ...req.query, ...req.user };
      const result: IResponseType = await this.ds.delete(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
