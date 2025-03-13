import { Response } from 'express';
import { StatusCodes } from "http-status-codes";
import {
    ErrorEnum,
    PaginationStudentParams,
    StudentModel,
    ValidatedRequest,
    ValidatedRequestBody,
    ValidatedRequestParams,
    ValidatedRequestQuery
} from "../models";
import { ErrorService, ResponseHelper } from "../utils";
import { StudentsRepository } from "../repository";

export class StudentsController {
    static async create(req: ValidatedRequest<ValidatedRequestBody<StudentModel>>, res: Response) {
        try {
            const result = await StudentsRepository.create(req.body);
            if (!result) {
                return ErrorService.error(res, {}, StatusCodes.BAD_REQUEST, ErrorEnum.StudentCreateFailed);
            }

            return ResponseHelper.success(res, result, StatusCodes.CREATED);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getOne(req: ValidatedRequest<ValidatedRequestParams<{ id: number }>>, res: Response) {
        try {
            const result = await StudentsRepository.getOne(req.params.id);
            if (!result) {
                return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.StudentNotFound);
            }

            return ResponseHelper.success(res, result, StatusCodes.OK);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getAll(req: ValidatedRequest<ValidatedRequestQuery<PaginationStudentParams>>, res: Response) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const result = await StudentsRepository.getAll(req.query);

            const count = result[0]?.count ? Number(result[0].count) : 0;
            const data = result.map(({ count, ...item }) => item);

            return ResponseHelper.pagination(res, data, page, limit, count);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async update(req: ValidatedRequest<ValidatedRequestBody<StudentModel> & ValidatedRequestParams<{ id: number }>>, res: Response) {
        try {
            const data = await StudentsRepository.update({
                ...req.body,
                id: Number(req.params.id)
            });

            if (!data) {
                return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.StudentUpdateFailed);
            }

            return ResponseHelper.success(res, data, StatusCodes.OK);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async delete(req: ValidatedRequest<ValidatedRequestParams<{ id: number }>>, res: Response) {
        try {
            const result = await StudentsRepository.delete(req.params.id);
            if (!result) {
                return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.StudentDeleteFailed);
            }

            return ResponseHelper.success(res, { success: true }, StatusCodes.OK);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getStudentCourses(req: ValidatedRequest<ValidatedRequestParams<{ id: number }>>, res: Response) {
        try {
            const result = await StudentsRepository.getStudentCourses(req.params.id);
            if (!result) {
                return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.StudentNotFound);
            }

            return ResponseHelper.success(res, result, StatusCodes.OK);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }
}