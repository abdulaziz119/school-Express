export enum ErrorEnum {
    invalidData = 'Incorrect data!',
    Unauthorized = 'Unauthorized',
    equalPasswords = 'password is incorrect',
    // Common Errors
    NotFound = 'Resource not found',
    ValidationError = 'Validation error occurred',
    UnauthorizedAccess = 'Unauthorized access',
    ServerError = 'Internal server error',
    BadRequest = 'Bad request',

    // Course Related
    CourseNotFound = 'Course not found',
    CourseCreateFailed = 'Failed to create course',
    CourseUpdateFailed = 'Failed to update course',
    CourseDeleteFailed = 'Failed to delete course',
    CourseInactive = 'Course is inactive',

    // Student Related
    StudentNotFound = 'Student not found',
    StudentCreateFailed = 'Failed to create student',
    StudentUpdateFailed = 'Failed to update student',
    StudentDeleteFailed = 'Failed to delete student',
    StudentInactive = 'Student is inactive',

    // Enrollment Related
    EnrollmentNotFound = 'Enrollment not found',
    EnrollmentCreateFailed = 'Failed to create enrollment',
    EnrollmentUpdateFailed = 'Failed to update enrollment',
    EnrollmentDeleteFailed = 'Failed to delete enrollment',
    EnrollmentExists = 'Student is already enrolled in this course',
    EnrollmentInactive = 'Enrollment is inactive',

    // Progress Related
    ProgressNotFound = 'Progress not found',
    ProgressUpdateFailed = 'Failed to update progress',
    InvalidProgress = 'Invalid progress data',

    // Database Related
    DatabaseConnectionError = 'Database connection error',
    DatabaseQueryError = 'Database query failed',
    DatabaseTransactionError = 'Database transaction failed',

    // File Related
    FileUploadFailed = 'File upload failed',
    FileNotFound = 'File not found',
    InvalidFileType = 'Invalid file type',
    FileSizeTooLarge = 'File size exceeds limit',

    // Authentication Related
    InvalidCredentials = 'Invalid credentials',
    TokenExpired = 'Token has expired',
    InvalidToken = 'Invalid token',
    TokenRequired = 'Authentication token required',

    // Authorization Related
    PermissionDenied = 'Permission denied',
    InsufficientRights = 'Insufficient rights',
    RoleNotFound = 'Role not found',

    // Input Validation
    InvalidInput = 'Invalid input data',
    RequiredFieldMissing = 'Required field is missing',
    InvalidFormat = 'Invalid data format',
    DuplicateEntry = 'Duplicate entry found'
}