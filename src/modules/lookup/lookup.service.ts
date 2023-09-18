import { IResponseType } from "../../core/IResponseType";
import { AppDataSource } from "../../database/data-source";
import Company from "../../entities/Company";
import Country from "../../entities/Country";
import PolicySubType from "../../entities/PolicySubType";
import PolicyType from "../../entities/PolicyType";
import State from "../../entities/State";
import { MESSAGE } from "../../shared/constants/app.const";
import { NxService } from "../../shared/nx-library/nx-service";

const companyRepository = AppDataSource.getRepository(Company);
const policyTypeRepository = AppDataSource.getRepository(PolicyType);
const policySubTypeRepository = AppDataSource.getRepository(PolicySubType);
const countryRepository = AppDataSource.getRepository(Country);
const stateRepository = AppDataSource.getRepository(State);

export class LookupService {
  constructor(private nx: NxService) {}

  findCountry = async (): Promise<any> => {
    try {
      const result = await countryRepository.find();
      return result;
    } catch (error) {
      throw error;
    }
  };

  findCompany = async (): Promise<any> => {
    try {
      const result = await companyRepository.find();
      return result;
    } catch (error) {
      throw error;
    }
  };

  findStatesByCountryId = async (params: any): Promise<any> => {
    try {
      let response: IResponseType;
      const { id } = params;
      const queryBuilder = stateRepository.createQueryBuilder("state");
      const result = await queryBuilder.where("state.countryId = :id", { id }).getMany();
      response = {
        message: MESSAGE.GET,
        data: result,
      };

      return response;
    } catch (error) {
      throw error;
    }
  };
}
