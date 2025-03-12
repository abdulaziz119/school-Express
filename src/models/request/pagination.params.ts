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