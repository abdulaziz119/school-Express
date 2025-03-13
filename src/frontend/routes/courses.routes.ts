import * as express from "express";
import {createValidator} from "express-joi-validation";;
import {CoursesController} from "../controllers";
import {CourseSchema, id_joi, params_joi} from "../../validation";
import {checkToken} from "../../utils";
const validator = createValidator({passError: true});

export const CoursesRoutes = (app: express.Application) => {
    app.post('/',checkToken, validator.body(CourseSchema), CoursesController.create);
    app.get('/findOne/:id',checkToken, validator.params(id_joi), CoursesController.getOne);
    app.get('/findAll',checkToken, validator.query(params_joi), CoursesController.getAll);
    app.get('/popular',checkToken, validator.query(params_joi), CoursesController.getPopularCourses);
    app.delete('/delete/:id',checkToken,validator.params(id_joi) , CoursesController.delete);
    app.put('/update/:id',checkToken, validator.params(id_joi), validator.body(CourseSchema), CoursesController.update);
};