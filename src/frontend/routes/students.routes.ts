import * as express from "express";
import {createValidator} from "express-joi-validation";
import {id_joi, StudentLoginSchema, studentQuerySchema, StudentSchema} from "../../validation";
import { StudentsController} from "../controllers";
import {checkToken, StudentsService} from "../../utils";
const validator = createValidator({passError: true});

export const StudentsRoutes = (app: express.Application) => {
    app.post('/register',  validator.body(StudentSchema), StudentsService.register);
    app.post('/login',validator.body(StudentLoginSchema) , StudentsService.login);

    app.get('/findOne/:id',checkToken, validator.params(id_joi), StudentsController.getOne);
    app.get('/findAll',checkToken, validator.query(studentQuerySchema), StudentsController.getAll);
    app.get('/student-courses/:id',checkToken, validator.params(id_joi), StudentsController.getStudentCourses);
    app.delete('/delete/:id',checkToken,validator.params(id_joi) , StudentsController.delete);
    app.put('/update/:id',checkToken, validator.params(id_joi), validator.body(StudentSchema), StudentsController.update);
};