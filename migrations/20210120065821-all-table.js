var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.runSql(`
        -- 1. Kurslar jadvali
        CREATE TABLE IF NOT EXISTS public.courses (
            id SERIAL PRIMARY KEY,
            title JSONB NOT NULL, -- Kurs nomi (ko'p tilli bo'lishi uchun JSONB)
            description JSONB, -- Kurs tavsifi (ko'p tilli bo'lishi uchun JSONB)
            duration INTEGER NOT NULL, -- Kurs davomiyligi (soatlarda yoki kunlarda)
            status INTEGER DEFAULT 1, -- Kurs holati (1 - faol, 0 - faol emas)
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL
        );

        -- 2. Talabalar jadvali
        CREATE TABLE IF NOT EXISTS public.students (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE, -- Talaba emaili (noyob)
            phone VARCHAR(20), -- Talaba telefon raqami
            status INTEGER DEFAULT 1, -- Talaba holati (1 - faol, 0 - faol emas)
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL
        );

        -- 3. Kurslarga yozilish jadvali
        CREATE TABLE IF NOT EXISTS public.enrollments (
            id SERIAL PRIMARY KEY,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status INTEGER DEFAULT 1, -- Yozilish holati (1 - faol, 0 - bekor qilingan)
            CONSTRAINT fk_enrollments_student_id FOREIGN KEY (student_id) 
                REFERENCES public.students (id) ON DELETE CASCADE,
            CONSTRAINT fk_enrollments_course_id FOREIGN KEY (course_id) 
                REFERENCES public.courses (id) ON DELETE CASCADE,
            CONSTRAINT unique_student_course UNIQUE (student_id, course_id) -- Bir talaba bir kursga faqat bir marta yozilishi mumkin
        );

        -- 4. Talaba muvaffaqiyati (progress) jadvali
        CREATE TABLE IF NOT EXISTS public.progress (
            id SERIAL PRIMARY KEY,
            enrollment_id INTEGER NOT NULL,
            completed_lessons INTEGER DEFAULT 0, -- Yakunlangan darslar soni
            total_lessons INTEGER NOT NULL, -- Kursdagi umumiy darslar soni
            completion_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
                CASE 
                    WHEN total_lessons > 0 THEN (completed_lessons::FLOAT / total_lessons) * 100 
                    ELSE 0 
                END
            ) STORED, -- O'zlashtirish foizi (avtomatik hisoblanadi)
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_progress_enrollment_id FOREIGN KEY (enrollment_id) 
                REFERENCES public.enrollments (id) ON DELETE CASCADE
        );

        -- Indekslar qo'shish (tezlikni oshirish uchun)
        CREATE INDEX idx_courses_status ON public.courses (status);
        CREATE INDEX idx_students_email ON public.students (email);
        CREATE INDEX idx_enrollments_student_id ON public.enrollments (student_id);
        CREATE INDEX idx_enrollments_course_id ON public.enrollments (course_id);
        CREATE INDEX idx_progress_enrollment_id ON public.progress (enrollment_id);
    `, function (err) {
        if (err) return callback(err);
        callback();
    });
};

exports.down = function (db, callback) {
    db.runSql(`
        -- Jadvallarni teskari tartibda o'chirish (bog'lanishlar tufayli)
        DROP TABLE IF EXISTS public.progress;
        DROP TABLE IF EXISTS public.enrollments;
        DROP TABLE IF EXISTS public.students;
        DROP TABLE IF EXISTS public.courses;
    `, function (err) {
        if (err) return callback(err);
        callback();
    });
};

exports._meta = {
    "version": 1
};