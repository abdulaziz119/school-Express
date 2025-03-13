import {pgPoolQuery} from "../database";
import {EnrollmentModel, PaginationEnrollmentParams, ProgressModel} from "../models";

export class EnrollmentsRepository {

    static async getAll(params: PaginationEnrollmentParams): Promise<EnrollmentModel[]> {
        try {
            const parameters: any = [];
            let pagination: string = '';
            let filter: string = '';

            if (params.limit && !isNaN(params.page)) {
                parameters.push(params.limit, (params.page - 1) * params.limit);
                pagination = ` LIMIT $1 OFFSET $2`;
            }

            if (params.status !== undefined) {
                filter += ` AND e.status = ${params.status}`;
            }

            if (params.student_id) {
                filter += ` AND e.student_id = ${params.student_id}`;
            }

            if (params.course_id) {
                filter += ` AND e.course_id = ${params.course_id}`;
            }

            const sql = `SELECT e.id,
                               e.student_id,
                               e.course_id,
                               e.enrolled_at,
                               e.status,
                               s.first_name,
                               s.last_name,
                               s.email,
                               c.title as course_title,
                               count(*) over () as count
                        FROM public.enrollments as e
                        JOIN students s ON e.student_id = s.id
                        JOIN courses c ON e.course_id = c.id
                        WHERE 1 = 1
                          AND s.deleted_at IS NULL 
                          AND c.deleted_at IS NULL ${filter}
                        ORDER BY e.enrolled_at DESC ${pagination};`

            const result = await pgPoolQuery(sql, parameters);

            return result.rows;
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            throw new Error('Error fetching enrollments');
        }
    }

    static async getOne(id: number) {
        try {
            const query = `
                SELECT e.id, e.student_id, e.course_id, e.enrolled_at, e.status,
                       s.first_name, s.last_name, s.email,
                       c.title as course_title
                FROM enrollments e
                JOIN students s ON e.student_id = s.id
                JOIN courses c ON e.course_id = c.id
                WHERE e.id = $1 AND s.deleted_at IS NULL AND c.deleted_at IS NULL
            `;

            const result = await pgPoolQuery(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching enrollment:', error);
            throw new Error('Error fetching enrollment');
        }
    }

    static async create(params: EnrollmentModel): Promise<EnrollmentModel | null> {
        try {
            const checkSql = `
            SELECT id FROM enrollments
            WHERE student_id = $1 AND course_id = $2 AND enrolled_at IS NULL
        `;

            const checkResult = await pgPoolQuery(checkSql, [
                params.student_id,
                params.course_id
            ]);

            if (checkResult.rows.length > 0) {
                return null;
            }

            const enrollmentSql = `
            INSERT INTO enrollments (student_id, course_id, status)
            VALUES ($1, $2, $3)
            RETURNING id, student_id, course_id, enrolled_at, status;
        `;

            const enrollmentResult = await pgPoolQuery(enrollmentSql, [
                params.student_id,
                params.course_id,
                params.status || 1
            ]);

            if (params.total_lessons) {
                const progressSql = `
                INSERT INTO progress (enrollment_id, total_lessons)
                VALUES ($1, $2)
                RETURNING id, enrollment_id, completed_lessons, total_lessons;
            `;

                await pgPoolQuery(progressSql, [
                    enrollmentResult.rows[0].id,
                    params.total_lessons
                ]);
            }

            return enrollmentResult.rows[0];
        } catch (error) {
            console.error('Error creating enrollment:', error);
            throw new Error('Error creating enrollment');
        }
    }

    static async update(params: EnrollmentModel): Promise<EnrollmentModel> {
        try {
            const sql = `
                UPDATE enrollments
                SET status = $1
                WHERE id = $2
                    RETURNING 
                id, 
                student_id, 
                course_id, 
                enrolled_at, 
                status;
            `;

            const result = await pgPoolQuery(sql, [params.status, params.id]);

            if (!result.rows || result.rows.length === 0) {
                throw new Error('Enrollment not found');
            }

            return result.rows[0];
        } catch (error) {
            console.error('Error updating enrollment:', error);
            throw new Error('Error updating enrollment');
        }
    }

    static async updateProgress(params: ProgressModel) {
        try {
            const sql = `UPDATE progress
                         SET completed_lessons = $1,
                             last_updated = CURRENT_TIMESTAMP
                         WHERE enrollment_id = $2
                             RETURNING id, enrollment_id, completed_lessons, total_lessons, completion_percentage;`

            const result = await pgPoolQuery(sql,
                [params.completed_lessons, params.enrollment_id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating progress:', error);
            throw new Error('Error updating progress');
        }
    }

    static async getProgress(enrollmentId: number): Promise<ProgressModel> {
        try {
            const sql = `SELECT p.*,
                               s.first_name,
                               s.last_name,
                               c.title as course_title
                        FROM progress p
                        JOIN enrollments e ON p.enrollment_id = e.id
                        JOIN students s ON e.student_id = s.id
                        JOIN courses c ON e.course_id = c.id
                        WHERE p.enrollment_id = $1;`

            const result = await pgPoolQuery(sql, [enrollmentId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching progress:', error);
            throw new Error('Error fetching progress');
        }
    }

    static async getCourseStats(courseId: number) {
        try {
            const sql = `SELECT c.id as course_id,
                               c.title as course_title,
                               COUNT(e.id) as total_students,
                               ROUND(AVG(p.completion_percentage), 2) as average_completion,
                               COUNT(CASE WHEN p.completion_percentage = 100 THEN 1 END) as completed_count
                        FROM courses c
                        JOIN enrollments e ON c.id = e.course_id
                        JOIN progress p ON e.id = p.enrollment_id
                        WHERE c.id = $1 AND e.status = 1
                        GROUP BY c.id, c.title;`

            const result = await pgPoolQuery(sql, [courseId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching course stats:', error);
            throw new Error('Error fetching course stats');
        }
    }
}