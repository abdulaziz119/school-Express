import {Response } from 'express';
import {StatusCodes} from "http-status-codes";
import {
    CoursesModel,
    ErrorEnum, PaginationParams,
    PaginationStatusParams,
    ValidatedRequest,
    ValidatedRequestBody,
    ValidatedRequestParams, ValidatedRequestQuery
} from "../models";
import {CoursesRepository} from "../repository";
import {ErrorService, ResponseHelper} from "../utils";


export class CoursesController {

    static async create(req: ValidatedRequest<ValidatedRequestBody<CoursesModel>>, res: Response) {
        try {
            const result = await CoursesRepository.create(req.body)

            if (!result) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.CoursesCreateAd)

            return ResponseHelper.success(res, result,StatusCodes.CREATED)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }


    static async getOne(req: ValidatedRequest<ValidatedRequestParams<{id: number}>>, res: Response) {
        try {
            const result = await CoursesRepository.getOne(req.params.id)
            return ResponseHelper.success(res, result,StatusCodes.OK)
        } catch (error) {
            return ErrorService.error(res, error)
        }
    }

    static async getAll(req: ValidatedRequest<ValidatedRequestQuery<PaginationStatusParams>>, res) {
        try {
            const result  = await CoursesRepository.getAll(req.query)

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



    static async update(req: ValidatedRequest<ValidatedRequestBody<CoursesModel>>, res) {
        try {
            req.body.id = req.params.id;
            let data = await CoursesRepository.update(req.body);

            return res.send(data);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async delete(req: ValidatedRequest<ValidatedRequestParams<{ id: number }>>, res) {
        try {

            await CoursesRepository.delete(req.params.id);
            return res.send({ success: true });

        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getPopularCourses(req: ValidatedRequest<ValidatedRequestQuery<PaginationParams>>, res) {
        try {
            const result:any  = await CoursesRepository.getPopularCourses(req.query)

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

}
