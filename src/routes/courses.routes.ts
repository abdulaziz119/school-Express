import * as express from "express";
import {createValidator} from "express-joi-validation";
import {CourseSchema, id_joi, params_joi} from "../validation";
import {CoursesController} from "../controllers";
const validator = createValidator({passError: true});

export const CoursesRoutes = (app: express.Application) => {
    app.post('/', validator.body(CourseSchema), CoursesController.create);
    app.get('/findOne/:id', validator.params(id_joi), CoursesController.getOne);
    app.get('/findAll', validator.query(params_joi), CoursesController.getAll);
    app.get('/popular', validator.query(params_joi), CoursesController.getPopularCourses);
    app.delete('/delete/:id',validator.params(id_joi) , CoursesController.delete);
    app.put('/update/:id', validator.params(id_joi), validator.body(CourseSchema), CoursesController.update);
};