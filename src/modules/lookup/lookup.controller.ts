import { Request, Response } from "express";
import { IResponseType } from "../../core/IResponseType";
import { ResponseBuilder } from "../../core/response-builder";
import { MESSAGE } from "../../shared/constants/app.const";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { LookupService } from "../lookup/lookup.service";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";

export class LookupController {
  constructor(private ds: LookupService) {}

  /**
   * @name Find
   * @method POST
   * @memberof LookupController
   */
  find = async (req: Request, res: Response) => {
    try {
      let result: IResponseType;
      const lookups: any[] = req.body;
      console.log(req.body);
      console.log(lookups);
      const collectionData: any = {};
      for (let i = 0; i < lookups.length; i++) {
        if (lookups[i].lookup === APP_ENUM.LOOKUP.COMPANY) {
          collectionData[APP_ENUM.LOOKUP.COMPANY] = await this.ds.findCompany();
        }
        if (lookups[i].lookup === APP_ENUM.LOOKUP.COUNTRY) {
          collectionData[APP_ENUM.LOOKUP.COUNTRY] = await this.ds.findCountry();
        }
      }
      result = {
        status: APP_ENUM.HTTP_STATUS.OK,
        data: collectionData,
        message: MESSAGE.GET,
      };
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      ResponseBuilder.InternalServerError(res, error);
    }
  };

  findStatesByCountryId = async (req: Request, res: Response) => {
    try {
      const params = { ...req.query, ...req.user };
      const result: IResponseType = await this.ds.findStatesByCountryId(params);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      if (error instanceof UnauthorizedAccessErrorResult) {
        return ResponseBuilder.UnauthorizedAccessError(res, error);
      }
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
