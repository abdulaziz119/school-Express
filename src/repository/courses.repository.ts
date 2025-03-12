import {pgPoolQuery} from "../database";
import {
    CoursesModel,
    PaginationStatusParams
} from "../models";

export class CoursesRepository {

    static async getAll(params: PaginationStatusParams): Promise<CoursesModel[]> {
      try {
          const parameters: any = [];
          let pagination: string = '';
          let filter: string = '';

          if (params.limit && !isNaN(params.page)) {
              parameters.push(params.limit, (params.page - 1) * params.limit);
              pagination = ` LIMIT $1 OFFSET $2`;
          }

          if (params.status !== undefined) {
              filter = ` AND status = ${params.status}`;
          }

          const sql = `SELECT c.id,
                        c.title,
                        c.description,
                        c.duration,
                        c.status,
                        c.created_at,
                        c.updated_at,
                        count(*) over () as count
                 FROM public.courses as c
                 WHERE 1 = 1
                   AND deleted_at IS NULL ${filter}
                 ORDER BY c.created_at DESC ${pagination};`

          const result = await pgPoolQuery(sql, parameters);

          return result.rows;
      }catch (error) {
      // logger.error(`Error in CoursesRepository.getAll: ${error}`);
      throw error;
      }
    }

    static async getOne(id:number):Promise<CoursesModel>  {
        try {
            const query = 'SELECT id, title, description, duration, status FROM courses WHERE id = $1 AND deleted_at IS NULL';
            const result = await pgPoolQuery(query, [id]);
            return result.rows[0];
        } catch (error) {
            // logger.error(`Error in CoursesRepository.findById: ${error}`);
            throw error;
        }
    }

    static async getById(id:number):Promise<CoursesModel>  {
        try {
            const query = 'SELECT id, title, description, duration, status FROM courses WHERE id = $1 AND deleted_at IS NULL';
            const result = await pgPoolQuery(query, [id]);
            return result.rows[0];
        } catch (error) {
            // logger.error(`Error in CoursesRepository.findById: ${error}`);
            throw error;
        }
    }

    static async create(params: CoursesModel):Promise<CoursesModel>  {
        try {
            const { title, description, duration, status = 1 } = params;

            const query = `
                INSERT INTO courses (title, description, duration, status) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, title, description, duration, status
            `;

            const result = await pgPoolQuery(query, [title, description, duration, status]);
            return result.rows[0];
        } catch (error) {
            // logger.error(`Error in CoursesRepository.create: ${error}`);
            throw error;
        }
    }

    static async update(params: CoursesModel): Promise<CoursesModel> {
        const sql = `UPDATE public.courses
                 SET title = $1,
                     description = $2,
                     duration = $3,
                     status = $4,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $5 
                   AND deleted_at IS NULL
                 RETURNING id, title, description, duration, status, created_at, updated_at;`

        const result = await pgPoolQuery(sql,
            [params.title, params.description, params.duration, params.status, params.id]);

        if (!result.rows || result.rows.length === 0) {
            return null as any;
        }

        return result.rows[0];
    }

    static async delete(id) {
        try {
            const query = 'UPDATE courses SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL';
            const result = await pgPoolQuery(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            // logger.error(`Error in CoursesRepository.delete: ${error}`);
            throw error;
        }
    }

    static async getPopularCourses(limit = 5) {
        try {
            const query = `
                SELECT c.id, c.title, c.description, c.duration, COUNT(e.id) AS student_count
                FROM courses c
                JOIN enrollments e ON c.id = e.course_id
                WHERE c.deleted_at IS NULL AND c.status = 1 AND e.status = 1
                GROUP BY c.id
                ORDER BY student_count DESC
                LIMIT $1
            `;

            const result = await pgPoolQuery(query, [limit]);
            return result.rows;
        } catch (error) {
            // logger.error(`Error in CoursesRepository.getPopularCourses: ${error}`);
            throw error;
        }
    }
}
