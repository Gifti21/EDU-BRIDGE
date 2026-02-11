/**
 * TypeScript type definitions for E-STUDENT PORTAL database models
 * Provides type safety and IntelliSense for database operations
 */

import { 
  User, 
  Student, 
  Teacher, 
  Parent, 
  Administrator, 
  Financer,
  Course,
  AcademicRecord,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Message,
  FinancialRecord,
  BehavioralRecord,
  CalendarEvent,
  Room,
  UserRole,
  UserStatus,
  AttendanceStatus,
  PaymentStatus,
  FeeType,
  IncidentSeverity,
  EventType,
  GradingPeriod,
  SubmissionStatus,
  MessageType
} from '@prisma/client';

// ============================================================================
// EXTENDED USER TYPES WITH RELATIONSHIPS
// ============================================================================

/**
 * User with all possible role relationships
 */
export type UserWithRole = User & {
  student?: Student | null;
  teacher?: Teacher | null;
  parent?: Parent | null;
  administrator?: Administrator | null;
  financer?: Financer | null;
};

/**
 * Student with related data
 */
export type StudentWithDetails = Student & {
  user: User;
  parents: Array<{
    parent: Parent & { user: User };
    relationship: string;
    isPrimary: boolean;
  }>;
  academicRecords: AcademicRecord[];
  attendanceRecords: AttendanceRecord[];
  assignments: AssignmentSubmission[];
  financialRecords: FinancialRecord[];
};

/**
 * Teacher with related data
 */
export type TeacherWithDetails = Teacher & {
  user: User;
  courses: Course[];
  academicRecords: AcademicRecord[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
};

/**
 * Parent with children information
 */
export type ParentWithChildren = Parent & {
  user: User;
  children: Array<{
    student: Student & { user: User };
    relationship: string;
    isPrimary: boolean;
  }>;
};

/**
 * Course with enrollment and teacher information
 */
export type CourseWithDetails = Course & {
  teacher?: Teacher & { user: User };
  enrollments: Array<{
    student: Student & { user: User };
  }>;
  assignments: Assignment[];
  _count: {
    enrollments: number;
    assignments: number;
  };
};

// ============================================================================
// ACADEMIC MANAGEMENT TYPES
// ============================================================================

/**
 * Academic record with related information
 */
export type AcademicRecordWithDetails = AcademicRecord & {
  student: Student & { user: User };
  course: Course;
  teacher: Teacher & { user: User };
};

/**
 * Assignment with submissions and course information
 */
export type AssignmentWithDetails = Assignment & {
  teacher: Teacher & { user: User };
  course: Course;
  submissions: Array<AssignmentSubmission & {
    student: Student & { user: User };
  }>;
  _count: {
    submissions: number;
  };
};

/**
 * Assignment submission with related data
 */
export type SubmissionWithDetails = AssignmentSubmission & {
  assignment: Assignment & {
    course: Course;
    teacher: Teacher & { user: User };
  };
  student: Student & { user: User };
};

// ============================================================================
// ATTENDANCE TYPES
// ============================================================================

/**
 * Attendance record with student and course information
 */
export type AttendanceWithDetails = AttendanceRecord & {
  student: Student & { user: User };
  teacher: Teacher & { user: User };
  course?: Course;
};

/**
 * Attendance summary for reporting
 */
export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}

// ============================================================================
// FINANCIAL TYPES
// ============================================================================

/**
 * Financial record with student information
 */
export type FinancialRecordWithDetails = FinancialRecord & {
  student: Student & { user: User };
  financer?: Financer & { user: User };
};

/**
 * Financial summary for dashboard
 */
export interface FinancialSummary {
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paymentsByType: Record<FeeType, number>;
}

// ============================================================================
// COMMUNICATION TYPES
// ============================================================================

/**
 * Message with sender and receiver information
 */
export type MessageWithDetails = Message & {
  sender: User;
  receiver?: User;
};

/**
 * Conversation thread
 */
export interface ConversationThread {
  participantId: string;
  participantName: string;
  participantRole: UserRole;
  lastMessage: Message;
  unreadCount: number;
}

// ============================================================================
// BEHAVIORAL TRACKING TYPES
// ============================================================================

/**
 * Behavioral record with related information
 */
export type BehavioralRecordWithDetails = BehavioralRecord & {
  student: Student & { user: User };
  teacher: Teacher & { user: User };
};

// ============================================================================
// CALENDAR AND EVENTS TYPES
// ============================================================================

/**
 * Calendar event with room and attendee information
 */
export type CalendarEventWithDetails = CalendarEvent & {
  room?: Room;
  attendees: Array<{
    userId: string;
    status: string;
    respondedAt?: Date;
  }>;
  _count: {
    attendees: number;
  };
};

// ============================================================================
// DASHBOARD AND ANALYTICS TYPES
// ============================================================================

/**
 * Dashboard statistics for different user roles
 */
export interface DashboardStats {
  // Common stats
  totalUsers: number;
  activeUsers: number;
  
  // Student-specific stats
  totalStudents?: number;
  presentToday?: number;
  absentToday?: number;
  
  // Teacher-specific stats
  totalTeachers?: number;
  totalCourses?: number;
  pendingAssignments?: number;
  
  // Admin-specific stats
  pendingApprovals?: number;
  systemHealth?: 'good' | 'warning' | 'critical';
  
  // Financial stats
  totalRevenue?: number;
  pendingPayments?: number;
  overduePayments?: number;
}

/**
 * Grade distribution for analytics
 */
export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
}

/**
 * Attendance trends for analytics
 */
export interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// ============================================================================
// FORM AND INPUT TYPES
// ============================================================================

/**
 * User creation input
 */
export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  emergencyContact?: string;
}

/**
 * Student creation input
 */
export interface CreateStudentInput extends CreateUserInput {
  studentId: string;
  grade: string;
  section: string;
  rollNumber?: string;
  parentIds: string[];
}

/**
 * Teacher creation input
 */
export interface CreateTeacherInput extends CreateUserInput {
  teacherId: string;
  department: string;
  qualification: string;
  specialization?: string;
  experience?: number;
}

/**
 * Course creation input
 */
export interface CreateCourseInput {
  courseCode: string;
  name: string;
  description?: string;
  credits: number;
  grade: string;
  teacherId: string;
}

/**
 * Assignment creation input
 */
export interface CreateAssignmentInput {
  title: string;
  description: string;
  instructions?: string;
  dueDate: Date;
  maxScore: number;
  courseId: string;
  allowLateSubmission: boolean;
  attachments?: string[];
}

/**
 * Grade input for academic records
 */
export interface GradeInput {
  studentId: string;
  courseId: string;
  assessmentType: string;
  title: string;
  score: number;
  maxScore: number;
  gradingPeriod: GradingPeriod;
  academicYear: string;
  comments?: string;
}

// ============================================================================
// SEARCH AND FILTER TYPES
// ============================================================================

/**
 * Search filters for users
 */
export interface UserSearchFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string; // Search in name, email
  department?: string;
  grade?: string;
  section?: string;
}

/**
 * Search filters for academic records
 */
export interface AcademicSearchFilters {
  studentId?: string;
  courseId?: string;
  teacherId?: string;
  gradingPeriod?: GradingPeriod;
  academicYear?: string;
  minScore?: number;
  maxScore?: number;
}

/**
 * Search filters for attendance
 */
export interface AttendanceSearchFilters {
  studentId?: string;
  teacherId?: string;
  courseId?: string;
  status?: AttendanceStatus;
  startDate?: Date;
  endDate?: Date;
  grade?: string;
  section?: string;
}

/**
 * Search filters for financial records
 */
export interface FinancialSearchFilters {
  studentId?: string;
  feeType?: FeeType;
  status?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// EXPORT ALL PRISMA TYPES
// ============================================================================

export {
  // Prisma generated types
  User,
  Student,
  Teacher,
  Parent,
  Administrator,
  Financer,
  Course,
  AcademicRecord,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Message,
  FinancialRecord,
  BehavioralRecord,
  CalendarEvent,
  Room,
  
  // Enums
  UserRole,
  UserStatus,
  AttendanceStatus,
  PaymentStatus,
  FeeType,
  IncidentSeverity,
  EventType,
  GradingPeriod,
  SubmissionStatus,
  MessageType,
};