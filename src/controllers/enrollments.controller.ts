import {Response } from 'express';
import {StatusCodes} from "http-status-codes";
import {
    EnrollmentModel,
    ErrorEnum,
    PaginationEnrollmentParams, ProgressModel,
    ValidatedRequest,
    ValidatedRequestBody,
    ValidatedRequestParams, ValidatedRequestQuery
} from "../models";
import { EnrollmentsRepository} from "../repository";
import {ErrorService, ResponseHelper} from "../utils";



export class EnrollmentsController {

    static async create(req: ValidatedRequest<ValidatedRequestBody<EnrollmentModel>>, res: Response) {
        try {
            const result = await EnrollmentsRepository.create(req.body)

            if (!result) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.EnrollmentCreateFailed)

            return ResponseHelper.success(res, result,StatusCodes.CREATED)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }


    static async getOne(req: ValidatedRequest<ValidatedRequestParams<{id: number}>>, res: Response) {
        try {
            const result = await EnrollmentsRepository.getOne(req.params.id)
            if (!result) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.EnrollmentNotFound)

            return ResponseHelper.success(res, result,StatusCodes.OK)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }

    static async getAll(req: ValidatedRequest<ValidatedRequestQuery<PaginationEnrollmentParams>>, res: Response) {
        try {
            const result  = await EnrollmentsRepository.getAll(req.query)

            let [page, limit] = [req.query.page ?? 1, req.query.limit ?? 20]

            let count: number = result[0] ? Number(result[0].count) : 0

            result.map(item => {
                delete item.count
            })

            return ResponseHelper.pagination(res, result, page, limit, count)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }



    static async update(req: ValidatedRequest<ValidatedRequestBody<EnrollmentModel>>, res: Response) {
        try {
            req.body.id = req.params.id;
            let data = await EnrollmentsRepository.update(req.body);
            if (!data) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.EnrollmentUpdateFailed)

            return res.send(data);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async updateProgress(req: ValidatedRequest<ValidatedRequestBody<ProgressModel>>, res: Response) {
        try {
            const result = await EnrollmentsRepository.updateProgress(req.body)
            if (!result) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.ProgressUpdateFailed)

            return ResponseHelper.success(res, result,StatusCodes.CREATED)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }

    static async getProgress(req: ValidatedRequest<ValidatedRequestParams<{id: number}>>, res: Response) {
        try {
            const result = await EnrollmentsRepository.getProgress(req.params.id)
            if (!result) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.ProgressNotFound)

            return ResponseHelper.success(res, result,StatusCodes.OK)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }

    static async getCourseStats(req: ValidatedRequest<ValidatedRequestParams<{id: number}>>, res: Response) {
        try {
            const result = await EnrollmentsRepository.getCourseStats(req.params.id)
            if (!result) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.ProgressNotFound)

            return ResponseHelper.success(res, result,StatusCodes.OK)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }

}
