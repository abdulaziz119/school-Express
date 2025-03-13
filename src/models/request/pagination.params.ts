export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationStatusParams {
    page: number;
    limit: number;
    status?: number
}

export interface PaginationStudentParams {
    page: number;
    limit: number;
    status?: number;
    email?: string;
}

export interface PaginationEnrollmentParams {
    page: number;
    limit: number;
    status?: number;
    student_id?: number;
    course_id?: number;
}