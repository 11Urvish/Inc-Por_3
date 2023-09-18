import { Request, Response } from "express";
import { FileUploadService } from "./file-upload.service";
import { IResponseType } from "../../core/IResponseType";
import { ResponseBuilder } from "../../core/response-builder";

interface MulterRequest extends Request {
  file?: any;
}

export class FileUploadController {
  constructor(private ds: FileUploadService) {}

  /**
   * @name uploadFile
   * @param req
   * @param res
   * @param next
   * @description Upload file
   * @returns
   * @memberof FileUploadController
   * @example http://localhost:3000/api/v1/file-upload/uploadFile
   */
  uploadFile = async (req: MulterRequest, res: Response) => {
    try {
      console.log("---FileUploadController---");
      console.log(req.file);

      const result: IResponseType = await this.ds.uploadSingleFile(req.body, req.file);
      ResponseBuilder.Ok<IResponseType>(res, result);
    } catch (error) {
      ResponseBuilder.InternalServerError(res, error);
    }
  };
}
