import { v4 as uuidv4 } from "uuid";
import { IResponseType } from "../../core/IResponseType";
import { MESSAGE } from "../../shared/constants/app.const";
import { NxService } from "../../shared/nx-library/nx-service";

import CONFIG from "../../config/config";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { APP_ENUM } from "../../shared/enums/app.enum";
const AWS = require("aws-sdk");

const region = CONFIG.AWS_REGION;
const awsBucket = CONFIG.AWS_BUCKET;
const accessKeyId = CONFIG.AWS_ACCESS_KEY;
const secretAccessKey = CONFIG.AWS_SECRET_KEY;

// AWS.config.update({ region });

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export class FileUploadService {
  constructor(private nx: NxService) {}

  /**
   * @name uploadSingleFile
   * @param params
   * @param file
   */
  uploadSingleFile = async (params: any, file: any): Promise<any> => {
    try {
      const {} = params;
      let response: IResponseType;

      const fileType = file.originalname.split(".")[1];
      const uniqueId = uuidv4();
      const fileName = `${uniqueId}.${fileType}`;

      const uploadParams = {
        Bucket: awsBucket,
        Key: fileName,
        Body: file.buffer,
      };
      const uploadedObject = await s3.upload(uploadParams).promise();
      console.log("File uploaded successfully to S3");
      const fileUrl = uploadedObject.Location;
      response = { message: MESSAGE.FILE_UPLOAD, data: { fileUrl, fileName } };
      return response;
    } catch (error) {
      throw error;
    }
  };
}
