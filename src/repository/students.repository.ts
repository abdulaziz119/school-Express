import {pgPoolQuery} from "../database";
import { PaginationStudentParams, StudentModel} from "../models";

export class StudentsRepository {

    static async getAll(params: PaginationStudentParams): Promise<StudentModel[]> {
        try {
            const parameters: any = [];
            let pagination: string = '';
            let filter: string = '';

            if (params.limit && !isNaN(params.page)) {
                parameters.push(params.limit, (params.page - 1) * params.limit);
                pagination = ` LIMIT $1 OFFSET $2`;
            }

            if (params.status !== undefined) {
                filter += ` AND status = ${params.status}`;
            }

            if (params.email) {
                filter += ` AND email LIKE '%${params.email}%'`;
            }

            const sql = `SELECT s.id,
                               s.first_name,
                               s.last_name,
                               s.email,
                               s.phone,
                               s.status,
                               s.created_at,
                               s.updated_at,
                               count(*) over () as count
                        FROM public.students as s
                        WHERE 1 = 1
                          AND deleted_at IS NULL ${filter}
                        ORDER BY s.created_at DESC ${pagination};`

            const result = await pgPoolQuery(sql, parameters);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getOne(id: number):Promise<StudentModel>  {
        try {
            const query = 'SELECT id, first_name, last_name, email, phone, status FROM students WHERE id = $1 AND deleted_at IS NULL';
            const result = await pgPoolQuery(query, [id]);
            return result.rows[0];
        } catch (error) {
            // logger.error(`Error in StudentsRepository.findById: ${error}`);
            throw error;
        }
    }

    static async create(params: StudentModel):Promise<StudentModel>  {
        try {
            const { first_name, last_name, email, phone, status = 1 } = params;

            const query = `
                INSERT INTO students (first_name, last_name, email, phone, status)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, first_name, last_name, email, phone, status
            `;

            const result = await pgPoolQuery(query, [first_name, last_name, email, phone, status]);
            return result.rows[0];
        } catch (error) {
            // logger.error(`Error in StudentsRepository.create: ${error}`);
            throw error;
        }
    }

    static async update(params: StudentModel): Promise<StudentModel> {
        const sql = `UPDATE public.students
                     SET first_name = $1,
                         last_name = $2,
                         email = $3,
                         phone = $4,
                         status = $5,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = $6 
                       AND deleted_at IS NULL
                     RETURNING id, first_name, last_name, email, phone, status, created_at, updated_at;`

        const result = await pgPoolQuery(sql,
            [params.first_name, params.last_name, params.email, params.phone, params.status, params.id]);

        if (!result.rows || result.rows.length === 0) {
            return null as any;
        }

        return result.rows[0];
    }

    static async delete(id: number) {
        try {
            // Soft delete
            const query = 'UPDATE students SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL';
            const result = await pgPoolQuery(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            // logger.error(`Error in StudentsRepository.delete: ${error}`);
            throw error;
        }
    }

    static async getStudentCourses(studentId: number) {
        try {
            const query = `
                SELECT c.id, c.title, c.description, c.duration, e.enrolled_at,
                       p.completed_lessons, p.total_lessons, p.completion_percentage
                FROM enrollments e
                JOIN courses c ON e.course_id = c.id
                LEFT JOIN progress p ON e.id = p.enrollment_id
                WHERE e.student_id = $1 AND e.status = 1 AND c.deleted_at IS NULL
                ORDER BY e.enrolled_at DESC
            `;

            const result = await pgPoolQuery(query, [studentId]);
            console.log(result.rows,'result.rows')
            return result.rows;
        } catch (error) {
            // logger.error(`Error in StudentsRepository.getStudentCourses: ${error}`);
            throw error;
        }
    }
}
