import {BaseModel} from "./base.model";

export interface EnrollmentModel extends BaseModel{
    student_id: number;
    course_id: number;
    total_lessons?: number;
    status?: number;
    enrolled_at?: Date;
}

export interface ProgressModel extends BaseModel{
    enrollment_id: number;
    completed_lessons: number;
    total_lessons: number;
    completion_percentage?: number;
    last_updated?: Date;
}