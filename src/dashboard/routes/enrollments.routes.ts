import * as express from "express";
import {createValidator} from "express-joi-validation";
import {EnrollmentsController} from "../controllers";
import {enrollmentQuerySchema, enrollmentSchema, id_joi, updateProgressSchema} from "../../validation";
const validator = createValidator({passError: true});

export const EnrollmentsRoutes = (app: express.Application) => {
    app.post('/', validator.body(enrollmentSchema), EnrollmentsController.create);
    app.get('/findOne/:id', validator.params(id_joi), EnrollmentsController.getOne);
    app.get('/findAll', validator.query(enrollmentQuerySchema), EnrollmentsController.getAll);
    app.get('/progress/:id', validator.params(id_joi), EnrollmentsController.getProgress);
    app.get('/course-stats/:id', validator.params(id_joi), EnrollmentsController.getCourseStats);
    app.put('/update-progress', validator.body(updateProgressSchema), EnrollmentsController.updateProgress);
    app.put('/update/:id', validator.params(id_joi), validator.body(enrollmentSchema), EnrollmentsController.update);
};