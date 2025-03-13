import {AuthorizationService, ErrorEnum, StudentModel, StudentsRepository} from '..';
import { Md5 } from 'ts-md5';
import {ValidationException} from "../exceptions/validation.exception";


export class StudentsService {

    static async register(params: any): Promise<any> {
        try {
            const authorizationService: AuthorizationService = new AuthorizationService();
            params.password = Md5.hashStr(params.password)
            const user = await StudentsRepository.create(params)
            const token:string = await authorizationService.sign(user)
            let data = {
                user_id :user.id,
                token : token
            }
            return data
        }catch (error) {
            throw new ValidationException(ErrorEnum.StudentCreateFailed)
        }
    }

    static async login(params: { email: string, phone: string }): Promise<any> {
        try {
            const authorizationService: AuthorizationService = new AuthorizationService();
            const user: StudentModel= await StudentsRepository.getOneByEmail(params.email)

            const token:string = await authorizationService.sign(user)
            let data = {
                user_id :user.id,
                token : token
            }
            return data
        }catch (error) {
            throw new ValidationException(ErrorEnum.ProgressNotFound)
        }
    }
}
