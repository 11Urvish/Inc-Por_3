import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import User from "../../entities/User";
import { UnauthorizedAccessErrorResult } from "../../core/error-result";
import { APP_ENUM } from "../../shared/enums/app.enum";
import { MESSAGE } from "../../shared/constants/app.const";
import { NxService } from "../../shared/nx-library/nx-service";
import Customer from "../../entities/Customer";
import { MailService } from "../../shared/services/mail.service";

const userRepository = AppDataSource.getRepository(User);
const customerRepository = AppDataSource.getRepository(Customer);

export class AuthService {
  constructor(private nx: NxService, private mailService: MailService) {}

  /**
   * @name login
   * @param params
   * @returns
   * @description
   * 1. Check if user exists
   * 2. Verify password
   * 3. Generate token
   * 4. Return user details and token
   */
  login = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;

      const { username, password } = params;
      const email = username.toLowerCase();

      const user = await userRepository.createQueryBuilder("user").where("user.email = :email", { email }).getOne();
      if (!user) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      }

      const isPasswordVerified = await this.nx.crypto.verifyPassword(user.password, password);
      if (!isPasswordVerified) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      }

      const token = await this.nx.crypto.getToken(user);

      const userDetails = {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase(),
        role: user.role,
      };

      response = { data: { user: userDetails, token }, message: MESSAGE.LOGIN };

      return response;
    } catch (e) {
      throw e;
    }
  };

  /**
   * @name customerLogin
   * @param params
   * @returns
   * @description
   * 1. Check if customer exists
   * 2. Verify password
   * 3. Generate token
   * 4. Return user details and token
   */
  customerLogin = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;

      const { username, password } = params;
      const email = username.toLowerCase();

      const customer = await customerRepository.createQueryBuilder("customer").where("customer.email = :email", { email }).getOne();
      if (!customer) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      }

      const isPasswordVerified = await this.nx.crypto.verifyPassword(customer.password, password);
      if (!isPasswordVerified) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      }

      const token = await this.nx.crypto.getCustomeToken(customer);

      const customerDetails = {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email.toLowerCase(),
        phone: customer.phone,
      };

      response = { data: { user: customerDetails, token }, message: MESSAGE.LOGIN };

      return response;
    } catch (e) {
      throw e;
    }
  };

  /**
   * @name forgotPassword
   */
  forgotPassword = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;

      const email = params.email.toLowerCase();

      const user: any = await userRepository.createQueryBuilder("user").where("user.email = :email", { email }).getOne();
      if (!user) {
        throw new UnauthorizedAccessErrorResult(APP_ENUM.ERROR_CODE.NOT_FOUND, MESSAGE.INVALID_CREDENTIAL);
      }

      const password = this.nx.utils.generateRandomPassword(8);
      const passwordHash = await this.nx.crypto.hashPassword(password);

      await userRepository.update(user.id, { password: passwordHash });

      await this.mailService.sendMail({
        to: params.email,
        subject: "Orbit - Reset Password",
        html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Account Creation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #fff; padding: 30px; border-radius: 5px;">
              <h2>Welcome to OrbitPlus!</h2>
              <p style="margin-bottom: 20px;">Congrats! ${user.firstName} ${user.lastName}</p>
              <p style="margin-bottom: 20px;">Your credentials are Email=${user.email} Password=${password}</p>
            </div>
          </div>
        </body>
        </html>`,
      });

      response = { data: null, message: MESSAGE.PASSWORD_RESET_LINK };

      return response;
    } catch (e) {
      throw e;
    }
  };
}
