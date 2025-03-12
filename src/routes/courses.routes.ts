import * as express from "express";
import {createValidator} from "express-joi-validation";
import {createCourseSchema, id_joi, params_joi, updateCourseSchema} from "../validation";
import {CoursesController} from "../controllers";
const validator = createValidator({passError: true});

export const CoursesRoutes = (app: express.Application) => {
    app.post('/', validator.body(createCourseSchema), CoursesController.create);
    app.get('/findOne/:id', validator.params(id_joi), CoursesController.getOne);
    app.get('/findAll', validator.query(params_joi), CoursesController.getAll);
    app.delete('/delete/:id',validator.params(id_joi) , CoursesController.delete);
    app.put('/update/:id', validator.params(id_joi), validator.body(updateCourseSchema), CoursesController.update);
};