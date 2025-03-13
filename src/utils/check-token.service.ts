import { UNAUTHORIZED } from 'http-status-codes';
import {
    ErrorService, ErrorEnum, ValidatedRequest
} from '..';

export const checkToken = async (req: ValidatedRequest<any>, res, next) => {
    try {
        // let authorization = null;
        // if (req.headers && req.headers.authorization) {
        //     authorization = req.headers.authorization.split(' ')[1];
        // }
        next();

    } catch (error) {
        ErrorService.error(res, ErrorEnum.Unauthorized, UNAUTHORIZED)
    }
}
