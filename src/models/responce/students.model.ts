import {BaseModel} from "./base.model";

export interface StudentModel extends BaseModel {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    status?: number;
}