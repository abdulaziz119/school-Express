import * as express from "express";
import {createValidator} from "express-joi-validation";
import {enrollmentQuerySchema, enrollmentSchema, id_joi, updateProgressSchema} from "../../validation";
import {EnrollmentsController} from "../controllers";
import {checkToken} from "../../utils";
const validator = createValidator({passError: true});

export const EnrollmentsRoutes = (app: express.Application) => {
    app.post('/', checkToken,validator.body(enrollmentSchema), EnrollmentsController.create);
    app.get('/findOne/:id',checkToken, validator.params(id_joi), EnrollmentsController.getOne);
    app.get('/findAll',checkToken, validator.query(enrollmentQuerySchema), EnrollmentsController.getAll);
    app.get('/progress/:id',checkToken, validator.params(id_joi), EnrollmentsController.getProgress);
    app.get('/course-stats/:id',checkToken, validator.params(id_joi), EnrollmentsController.getCourseStats);
    app.put('/update-progress',checkToken, validator.body(updateProgressSchema), EnrollmentsController.updateProgress);
    app.put('/update/:id',checkToken, validator.params(id_joi), validator.body(enrollmentSchema), EnrollmentsController.update);
};