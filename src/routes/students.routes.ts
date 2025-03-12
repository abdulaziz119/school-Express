import * as express from "express";
import {createValidator} from "express-joi-validation";
import {id_joi, studentQuerySchema, StudentSchema} from "../validation";
import { StudentsController} from "../controllers";
const validator = createValidator({passError: true});

export const StudentsRoutes = (app: express.Application) => {
    app.post('/', validator.body(StudentSchema), StudentsController.create);
    app.get('/findOne/:id', validator.params(id_joi), StudentsController.getOne);
    app.get('/findAll', validator.query(studentQuerySchema), StudentsController.getAll);
    app.get('/student-courses/:id', validator.params(id_joi), StudentsController.getStudentCourses);
    app.delete('/delete/:id',validator.params(id_joi) , StudentsController.delete);
    app.put('/update/:id', validator.params(id_joi), validator.body(StudentSchema), StudentsController.update);
};