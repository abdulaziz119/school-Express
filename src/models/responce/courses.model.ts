import {BaseModel} from "./base.model";

export interface CoursesModel extends BaseModel {
    title: {
        uz: string;
        ru?: string;
        en?: string;
    },
    description: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    duration: number
    status: number;
}
