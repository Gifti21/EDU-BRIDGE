# Design Document: E-Student Portal K-12

## Overview

The E-Student Portal K-12 is a comprehensive web-based platform built on Next.js 16, React 19, Prisma ORM with SQLite (development) / PostgreSQL (production), and NextAuth for authentication. The system implements a role-based access control (RBAC) architecture serving five distinct user roles: Students, Parents, Teachers, Administrators, and Financers.

### Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication**: NextAuth v4 with JWT sessions
- **Validation**: Zod schemas with React Hook Form
- **UI Components**: Radix UI primitives with custom styling
- **Charts/Analytics**: Recharts
- **State Management**: React Query (TanStack Query)

### Design Principles

1. **Security First**: All routes protected with RBAC middleware
2. **Mobile Responsive**: Optimized for smartphone and desktop access
3. **Performance**: Server-side rendering with optimistic UI updates
4. **Scalability**: Modular architecture supporting future AI integration
5. **Accessibility**: WCAG 2.1 AA compliant interfaces

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Student  │  │  Parent  │  │ Teacher  │  │  Admin   │   │
│  │   UI     │  │    UI    │  │    UI    │  │    UI    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Application Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  App Router (src/app)                               │   │
│  │  - Role-based route groups                          │   │
│  │  - Server Components (default)                      │   │
│  │  - Client Components (interactive)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes & Server Actions                        │   │
│  │  - Authentication endpoints                         │   │
│  │  - CRUD operations                                  │   │
│  │  - File upload/download                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Business Logic Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Service Layer (src/lib/services)                   │   │
│  │  - Authentication Service                           │   │
│  │  - User Management Service                          │   │
│  │  - Academic Service                                 │   │
│  │  - Communication Service                            │   │
│  │  - Financial Service                                │   │
│  │  - Notification Service                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                   │   │
│  │  - RBAC Authorization                               │   │
│  │  - Session Validation                               │   │
│  │  - Rate Limiting                                    │   │
│  │  - Audit Logging                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Access Layer                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Prisma ORM                                         │   │
│  │  - Type-safe database queries                       │   │
│  │  - Migration management                             │   │
│  │  - Connection pooling                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Database Layer                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SQLite (Development) / PostgreSQL (Production)     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── student/                  # Student portal
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── assignments/
│   │   ├── grades/
│   │   ├── attendance/
│   │   ├── materials/
│   │   └── messages/
│   ├── parent/                   # Parent portal
│   │   ├── dashboard/
│   │   ├── children/
│   │   ├── payments/
│   │   ├── attendance/
│   │   └── messages/
│   ├── teacher/                  # Teacher portal
│   │   ├── dashboard/
│   │   ├── classes/
│   │   ├── attendance/
│   │   ├── grades/
│   │   ├── materials/
│   │   └── messages/
│   ├── admin/                    # Admin portal
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── schedules/
│   │   ├── rooms/
│   │   ├── staff/
│   │   └── settings/
│   ├── financer/                 # Financer portal
│   │   ├── dashboard/
│   │   ├── payments/
│   │   ├── billing/
│   │   └── reports/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── attendance/
│   │   ├── grades/
│   │   ├── payments/
│   │   ├── messages/
│   │   └── notifications/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components
│   ├── ui/                       # Base UI components (Radix)
│   ├── layouts/                  # Layout components
│   ├── forms/                    # Form components
│   ├── dashboards/               # Dashboard widgets
│   └── shared/                   # Shared components
├── lib/                          # Utility libraries
│   ├── services/                 # Business logic services
│   ├── auth/                     # Authentication utilities
│   ├── db.ts                     # Prisma client
│   ├── utils.ts                  # Helper functions
│   └── validations/              # Zod schemas
├── types/                        # TypeScript types
│   ├── database.ts
│   ├── api.ts
│   └── models.ts
└── middleware.ts                 # Next.js middleware (RBAC)
```

## Components and Interfaces

### 1. Authentication System

#### NextAuth Configuration

**File**: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
// NextAuth configuration with JWT strategy
- Providers: Credentials (email/password)
- Session strategy: JWT with 30-minute expiration
- Callbacks: jwt, session (inject user role and permissions)
- Pages: Custom login, register, error pages
```

#### Password Security

- **Hashing**: bcryptjs with salt rounds = 12
- **Complexity Requirements**: 
  - Minimum 8 characters
  - At least 1 uppercase, 1 lowercase, 1 number, 1 special character
- **Password Reset**: 
  - Token-based with 24-hour expiration
  - Stored in database with hashed token
  - Email delivery via SMTP or service (e.g., SendGrid)

#### Session Management

- **JWT Tokens**: Signed with HS256 algorithm
- **Session Duration**: 30 minutes of inactivity
- **Token Refresh**: Automatic on activity
- **Session Invalidation**: On password change, logout, or security events

### 2. Role-Based Access Control (RBAC)

#### Middleware Implementation

**File**: `src/middleware.ts`

```typescript
// Route protection based on user roles
- Public routes: /login, /register, /forgot-password
- Protected routes: All others
- Role-specific redirects after login
- Audit logging for unauthorized access attempts
```

#### Permission Matrix

| Feature | Student | Parent | Teacher | Admin | Financer |
|---------|---------|--------|---------|-------|----------|
| View own grades | ✓ | ✓ (children) | ✓ (students) | ✓ | ✗ |
| Manage courses | ✗ | ✗ | ✗ | ✓ | ✗ |
| View payments | ✗ | ✓ | ✗ | ✓ | ✓ |
| Create users | ✗ | ✗ | ✗ | ✓ | ✗ |
| Send messages | ✓ | ✓ | ✓ | ✓ | ✗ |
| Manage schedules | ✗ | ✗ | ✗ | ✓ | ✗ |

### 3. User Management System

#### User Model Extensions

**File**: `prisma/schema.prisma` (additions)

```prisma
model User {
  // Existing fields...
  
  // Role-specific relations
  studentProfile   StudentProfile?
  parentProfile    ParentProfile?
  teacherProfile   TeacherProfile?
  adminProfile     AdminProfile?
  financerProfile  FinancerProfile?
  
  // Security
  passwordResetToken     String?
  passwordResetExpires   DateTime?
  failedLoginAttempts    Int       @default(0)
  accountLockedUntil     DateTime?
  
  // Audit
  createdBy              String?
  approvedBy             String?
  approvedAt             DateTime?
}

model StudentProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  studentId       String   @unique
  gradeLevel      String
  section         String?
  enrollmentDate  DateTime
  
  // Relations
  parents         ParentStudent[]
  enrollments     CourseEnrollment[]
  grades          Grade[]
  attendance      AttendanceRecord[]
  assignments     AssignmentSubmission[]
  
  @@map("student_profiles")
}

model ParentProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  relationship    String   // Father, Mother, Guardian
  occupation      String?
  
  // Relations
  children        ParentStudent[]
  payments        Payment[]
  
  @@map("parent_profiles")
}

model ParentStudent {
  id              String   @id @default(cuid())
  parentId        String
  studentId       String
  
  parent          ParentProfile  @relation(fields: [parentId], references: [id])
  student         StudentProfile @relation(fields: [studentId], references: [id])
  
  isPrimary       Boolean  @default(false)
  
  @@unique([parentId, studentId])
  @@map("parent_student")
}

model TeacherProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  employeeId      String   @unique
  department      String
  specialization  String?
  hireDate        DateTime
  
  // Relations
  courses         CourseAssignment[]
  attendance      TeacherAttendance[]
  
  @@map("teacher_profiles")
}

model AdminProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  department      String
  permissions     String   // JSON array of specific permissions
  
  @@map("admin_profiles")
}

model FinancerProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  department      String
  accessLevel     String   // READ_ONLY, FULL_ACCESS
  
  @@map("financer_profiles")
}
```


### 4. Academic Management System

#### Course and Enrollment Models

```prisma
model Course {
  id              String   @id @default(cuid())
  
  courseCode      String   @unique
  courseName      String
  description     String?
  credits         Int
  gradeLevel      String
  department      String
  
  // Prerequisites
  prerequisites   CoursePrerequisite[] @relation("CoursePrerequisites")
  prerequisiteFor CoursePrerequisite[] @relation("PrerequisiteFor")
  
  // Relations
  enrollments     CourseEnrollment[]
  assignments     CourseAssignment[]
  schedules       ClassSchedule[]
  materials       CourseMaterial[]
  
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("courses")
}

model CoursePrerequisite {
  id              String   @id @default(cuid())
  
  courseId        String
  prerequisiteId  String
  
  course          Course   @relation("CoursePrerequisites", fields: [courseId], references: [id])
  prerequisite    Course   @relation("PrerequisiteFor", fields: [prerequisiteId], references: [id])
  
  @@unique([courseId, prerequisiteId])
  @@map("course_prerequisites")
}

model CourseEnrollment {
  id              String   @id @default(cuid())
  
  studentId       String
  courseId        String
  academicYear    String
  semester        String
  
  student         StudentProfile @relation(fields: [studentId], references: [id])
  course          Course         @relation(fields: [courseId], references: [id])
  
  enrollmentDate  DateTime @default(now())
  status          String   @default("ACTIVE") // ACTIVE, DROPPED, COMPLETED
  finalGrade      String?
  
  @@unique([studentId, courseId, academicYear, semester])
  @@map("course_enrollments")
}

model CourseAssignment {
  id              String   @id @default(cuid())
  
  courseId        String
  teacherId       String
  academicYear    String
  semester        String
  
  course          Course         @relation(fields: [courseId], references: [id])
  teacher         TeacherProfile @relation(fields: [teacherId], references: [id])
  
  isPrimary       Boolean  @default(true)
  
  @@unique([courseId, teacherId, academicYear, semester])
  @@map("course_assignments")
}
```

#### Assignment and Grading Models

```prisma
model Assignment {
  id              String   @id @default(cuid())
  
  courseId        String
  title           String
  description     String?
  type            String   // HOMEWORK, QUIZ, TEST, EXAM, PROJECT
  
  dueDate         DateTime
  maxPoints       Int
  weight          Float    @default(1.0)
  
  // Relations
  submissions     AssignmentSubmission[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("assignments")
}

model AssignmentSubmission {
  id              String   @id @default(cuid())
  
  assignmentId    String
  studentId       String
  
  assignment      Assignment     @relation(fields: [assignmentId], references: [id])
  student         StudentProfile @relation(fields: [studentId], references: [id])
  
  submittedAt     DateTime?
  status          String   @default("PENDING") // PENDING, SUBMITTED, GRADED, LATE
  
  fileUrl         String?
  comments        String?
  
  pointsEarned    Float?
  feedback        String?
  gradedAt        DateTime?
  gradedBy        String?
  
  @@unique([assignmentId, studentId])
  @@map("assignment_submissions")
}

model Grade {
  id              String   @id @default(cuid())
  
  studentId       String
  courseId        String
  academicYear    String
  semester        String
  
  student         StudentProfile @relation(fields: [studentId], references: [id])
  
  // Grade components
  assignmentGrade Float?
  quizGrade       Float?
  midtermGrade    Float?
  finalExamGrade  Float?
  finalGrade      String?  // A, B+, B, etc.
  gpa             Float?
  
  remarks         String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([studentId, courseId, academicYear, semester])
  @@map("grades")
}
```

### 5. Attendance System

#### Attendance Models

```prisma
model AttendanceRecord {
  id              String   @id @default(cuid())
  
  studentId       String
  courseId        String?
  date            DateTime
  
  student         StudentProfile @relation(fields: [studentId], references: [id])
  
  status          String   // PRESENT, ABSENT, LATE, EXCUSED
  checkInTime     DateTime?
  remarks         String?
  
  recordedBy      String
  recordedAt      DateTime @default(now())
  
  @@index([studentId, date])
  @@map("attendance_records")
}

model TeacherAttendance {
  id              String   @id @default(cuid())
  
  teacherId       String
  date            DateTime
  
  teacher         TeacherProfile @relation(fields: [teacherId], references: [id])
  
  status          String   // PRESENT, ABSENT, LEAVE, SICK
  checkInTime     DateTime?
  checkOutTime    DateTime?
  
  remarks         String?
  approvedBy      String?
  
  recordedAt      DateTime @default(now())
  
  @@index([teacherId, date])
  @@map("teacher_attendance")
}
```

### 6. Scheduling System

#### Schedule Models

```prisma
model AcademicYear {
  id              String   @id @default(cuid())
  
  year            String   @unique // "2024-2025"
  startDate       DateTime
  endDate         DateTime
  
  semesters       Semester[]
  
  isActive        Boolean  @default(false)
  
  @@map("academic_years")
}

model Semester {
  id              String   @id @default(cuid())
  
  academicYearId  String
  academicYear    AcademicYear @relation(fields: [academicYearId], references: [id])
  
  name            String   // "Fall", "Spring", "1st Semester"
  startDate       DateTime
  endDate         DateTime
  
  isActive        Boolean  @default(false)
  
  @@map("semesters")
}

model Room {
  id              String   @id @default(cuid())
  
  roomNumber      String   @unique
  building        String?
  capacity        Int
  type            String   // CLASSROOM, LAB, AUDITORIUM
  
  equipment       String?  // JSON array
  
  schedules       ClassSchedule[]
  
  isActive        Boolean  @default(true)
  maintenanceNote String?
  
  @@map("rooms")
}

model TimeSlot {
  id              String   @id @default(cuid())
  
  name            String   // "Period 1", "Morning Session"
  dayOfWeek       Int      // 1-7 (Monday-Sunday)
  startTime       String   // "08:00"
  endTime         String   // "09:00"
  
  schedules       ClassSchedule[]
  
  @@map("time_slots")
}

model ClassSchedule {
  id              String   @id @default(cuid())
  
  courseId        String
  teacherId       String
  roomId          String
  timeSlotId      String
  
  course          Course     @relation(fields: [courseId], references: [id])
  room            Room       @relation(fields: [roomId], references: [id])
  timeSlot        TimeSlot   @relation(fields: [timeSlotId], references: [id])
  
  academicYear    String
  semester        String
  
  effectiveFrom   DateTime
  effectiveTo     DateTime?
  
  @@unique([roomId, timeSlotId, academicYear, semester])
  @@map("class_schedules")
}
```

### 7. Communication System

#### Messaging Models

```prisma
model Message {
  id              String   @id @default(cuid())
  
  senderId        String
  recipientId     String
  
  subject         String
  body            String
  
  isRead          Boolean  @default(false)
  readAt          DateTime?
  
  parentMessageId String?  // For threading
  
  attachments     MessageAttachment[]
  
  createdAt       DateTime @default(now())
  
  @@index([recipientId, isRead])
  @@map("messages")
}

model MessageAttachment {
  id              String   @id @default(cuid())
  
  messageId       String
  message         Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  
  fileName        String
  fileUrl         String
  fileSize        Int
  mimeType        String
  
  @@map("message_attachments")
}

model Feedback {
  id              String   @id @default(cuid())
  
  submitterId     String
  submitterRole   String   // STUDENT, PARENT
  
  recipientId     String?  // Teacher or Admin
  recipientRole   String?  // TEACHER, ADMINISTRATOR
  
  category        String   // TEACHING, COURSE, FACILITY, OTHER
  subject         String
  content         String
  
  isAnonymous     Boolean  @default(false)
  status          String   @default("SUBMITTED") // SUBMITTED, REVIEWED, RESPONDED
  
  response        String?
  respondedBy     String?
  respondedAt     DateTime?
  
  createdAt       DateTime @default(now())
  
  @@map("feedback")
}
```

### 8. Course Materials System

#### Materials Models

```prisma
model CourseMaterial {
  id              String   @id @default(cuid())
  
  courseId        String
  course          Course   @relation(fields: [courseId], references: [id])
  
  title           String
  description     String?
  type            String   // DOCUMENT, VIDEO, LINK, PRESENTATION
  
  fileUrl         String?
  externalUrl     String?
  fileSize        Int?
  mimeType        String?
  
  isPrintable     Boolean  @default(true)
  isDownloadable  Boolean  @default(true)
  
  uploadedBy      String
  uploadedAt      DateTime @default(now())
  
  academicYear    String?
  semester        String?
  
  viewCount       Int      @default(0)
  downloadCount   Int      @default(0)
  
  @@index([courseId])
  @@map("course_materials")
}
```

### 9. Financial Management System

#### Payment Models

```prisma
model FeeStructure {
  id              String   @id @default(cuid())
  
  name            String
  description     String?
  amount          Float
  
  gradeLevel      String?  // If grade-specific
  feeType         String   // TUITION, REGISTRATION, LIBRARY, LAB, PLATFORM
  
  frequency       String   // ONE_TIME, MONTHLY, SEMESTER, ANNUAL
  
  isActive        Boolean  @default(true)
  
  academicYear    String
  
  @@map("fee_structures")
}

model Payment {
  id              String   @id @default(cuid())
  
  studentId       String
  parentId        String?
  
  parent          ParentProfile? @relation(fields: [parentId], references: [id])
  
  amount          Float
  feeType         String
  
  paymentMethod   String   // BANK_TRANSFER, TELEBIRR, CASH, CARD
  transactionId   String?  @unique
  
  status          String   @default("PENDING") // PENDING, COMPLETED, FAILED, REFUNDED
  
  paidAt          DateTime?
  verifiedAt      DateTime?
  verifiedBy      String?
  
  receiptNumber   String?  @unique
  
  remarks         String?
  
  createdAt       DateTime @default(now())
  
  @@index([studentId])
  @@map("payments")
}

model BillingStatement {
  id              String   @id @default(cuid())
  
  studentId       String
  academicYear    String
  semester        String?
  
  totalAmount     Float
  paidAmount      Float    @default(0)
  balance         Float
  
  dueDate         DateTime
  status          String   @default("UNPAID") // UNPAID, PARTIAL, PAID, OVERDUE
  
  generatedAt     DateTime @default(now())
  
  @@index([studentId, academicYear])
  @@map("billing_statements")
}
```


### 10. Notification System

#### Notification Models

```prisma
model Notification {
  id              String   @id @default(cuid())
  
  userId          String
  
  type            String   // ATTENDANCE, GRADE, PAYMENT, MESSAGE, ANNOUNCEMENT
  title           String
  message         String
  
  priority        String   @default("NORMAL") // LOW, NORMAL, HIGH, URGENT
  
  isRead          Boolean  @default(false)
  readAt          DateTime?
  
  actionUrl       String?  // Link to relevant page
  
  metadata        String?  // JSON for additional data
  
  createdAt       DateTime @default(now())
  expiresAt       DateTime?
  
  @@index([userId, isRead])
  @@map("notifications")
}

model NotificationPreference {
  id              String   @id @default(cuid())
  
  userId          String   @unique
  
  emailEnabled    Boolean  @default(true)
  smsEnabled      Boolean  @default(false)
  pushEnabled     Boolean  @default(true)
  
  attendanceAlerts    Boolean  @default(true)
  gradeAlerts         Boolean  @default(true)
  paymentAlerts       Boolean  @default(true)
  messageAlerts       Boolean  @default(true)
  announcementAlerts  Boolean  @default(true)
  
  @@map("notification_preferences")
}
```

### 11. Announcement System

```prisma
model Announcement {
  id              String   @id @default(cuid())
  
  title           String
  content         String
  
  authorId        String
  authorRole      String   // ADMINISTRATOR, TEACHER
  
  targetAudience  String   // ALL, STUDENTS, PARENTS, TEACHERS, SPECIFIC_GRADE
  targetGrade     String?
  
  priority        String   @default("NORMAL")
  
  publishedAt     DateTime @default(now())
  expiresAt       DateTime?
  
  isPinned        Boolean  @default(false)
  
  attachments     AnnouncementAttachment[]
  
  @@index([targetAudience, publishedAt])
  @@map("announcements")
}

model AnnouncementAttachment {
  id              String   @id @default(cuid())
  
  announcementId  String
  announcement    Announcement @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  
  fileName        String
  fileUrl         String
  fileSize        Int
  
  @@map("announcement_attachments")
}
```

## Data Models

### Entity Relationship Overview

```
User (1) ──── (1) UserProfile
  │
  ├── (1) ──── (0..1) StudentProfile
  │                      │
  │                      ├── (n) ──── CourseEnrollment ──── (1) Course
  │                      ├── (n) ──── Grade
  │                      ├── (n) ──── AttendanceRecord
  │                      └── (n) ──── AssignmentSubmission
  │
  ├── (1) ──── (0..1) ParentProfile
  │                      │
  │                      ├── (n) ──── ParentStudent ──── (1) StudentProfile
  │                      └── (n) ──── Payment
  │
  ├── (1) ──── (0..1) TeacherProfile
  │                      │
  │                      ├── (n) ──── CourseAssignment ──── (1) Course
  │                      └── (n) ──── TeacherAttendance
  │
  ├── (1) ──── (0..1) AdminProfile
  │
  └── (1) ──── (0..1) FinancerProfile

Course (1) ──── (n) CourseMaterial
       (1) ──── (n) ClassSchedule ──── (1) Room
                                   └── (1) TimeSlot
```

### Key Data Validation Rules

1. **User Email**: Must be unique, valid email format
2. **Password**: Minimum 8 characters, complexity requirements enforced
3. **Student ID**: Auto-generated, unique, format: STU-YYYY-NNNN
4. **Employee ID**: Auto-generated, unique, format: EMP-YYYY-NNNN
5. **Course Code**: Unique, alphanumeric, uppercase
6. **Room Number**: Unique within building
7. **Payment Amount**: Positive decimal, max 2 decimal places
8. **Grade Values**: Predefined set (A, A-, B+, B, B-, C+, C, D, F)
9. **Attendance Status**: Enum (PRESENT, ABSENT, LATE, EXCUSED)
10. **Date Ranges**: Start date must be before end date

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials
   - Session expired
   - Account locked
   - Unauthorized access

2. **Validation Errors**
   - Missing required fields
   - Invalid data format
   - Constraint violations
   - Business rule violations

3. **Database Errors**
   - Connection failures
   - Unique constraint violations
   - Foreign key violations
   - Transaction failures

4. **File Upload Errors**
   - File size exceeded
   - Invalid file type
   - Upload failed
   - Storage quota exceeded

5. **Payment Errors**
   - Payment gateway timeout
   - Insufficient funds
   - Invalid transaction
   - Verification failed

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // ERROR_CODE
    message: string;        // User-friendly message
    details?: any;          // Additional error details
    timestamp: string;      // ISO 8601 timestamp
    path?: string;          // API endpoint path
  };
}
```

### Error Handling Strategy

1. **Client-Side**
   - Form validation with Zod schemas
   - Real-time field validation
   - User-friendly error messages
   - Toast notifications for errors

2. **Server-Side**
   - Try-catch blocks in API routes
   - Centralized error handler
   - Detailed logging with context
   - Sanitized error messages to client

3. **Database**
   - Transaction rollback on errors
   - Retry logic for transient failures
   - Connection pool management
   - Query timeout handling

4. **Audit Trail**
   - Log all errors to AuditLog table
   - Include user context and action
   - Track error frequency
   - Alert on critical errors

## Testing Strategy

### 1. Unit Testing

**Tools**: Jest, React Testing Library

**Coverage Areas**:
- Utility functions (lib/utils.ts)
- Validation schemas (Zod)
- Service layer functions
- Component logic

**Example Test Cases**:
- Password hashing and verification
- RBAC permission checks
- Date/time calculations
- Data transformations

### 2. Integration Testing

**Tools**: Jest, Supertest

**Coverage Areas**:
- API route handlers
- Database operations
- Authentication flow
- File upload/download

**Example Test Cases**:
- User registration and login
- Course enrollment process
- Grade submission workflow
- Payment processing

### 3. End-to-End Testing

**Tools**: Playwright or Cypress

**Coverage Areas**:
- Complete user workflows
- Multi-role interactions
- Cross-page navigation
- Form submissions

**Example Test Cases**:
- Student views grades and materials
- Parent makes payment
- Teacher records attendance
- Admin creates new course

### 4. Security Testing

**Focus Areas**:
- SQL injection prevention (Prisma handles this)
- XSS protection (React escaping)
- CSRF protection (NextAuth)
- Session hijacking prevention
- Rate limiting effectiveness
- File upload security

### 5. Performance Testing

**Metrics**:
- Page load time < 2 seconds
- API response time < 500ms
- Database query time < 100ms
- File download speed

**Tools**: Lighthouse, WebPageTest

### 6. Accessibility Testing

**Standards**: WCAG 2.1 AA

**Tools**: axe DevTools, WAVE

**Focus Areas**:
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Form labels and ARIA attributes

## Security Considerations

### 1. Authentication Security

- **Password Storage**: bcryptjs with 12 salt rounds
- **Session Tokens**: JWT with HS256, 30-minute expiration
- **Account Lockout**: 5 failed attempts, 15-minute lockout
- **Password Reset**: Secure token, 24-hour expiration
- **Multi-Factor Authentication**: Future enhancement

### 2. Authorization Security

- **RBAC Enforcement**: Middleware on all protected routes
- **Permission Validation**: Server-side checks on every operation
- **Audit Logging**: All access attempts logged
- **Principle of Least Privilege**: Users get minimum required permissions

### 3. Data Security

- **Encryption at Rest**: Database encryption (production)
- **Encryption in Transit**: HTTPS/TLS 1.3
- **Sensitive Data**: PII encrypted in database
- **Data Sanitization**: Input validation and output encoding

### 4. API Security

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Restricted to allowed origins
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection**: Prevented by Prisma ORM
- **XSS Prevention**: React automatic escaping

### 5. File Upload Security

- **File Type Validation**: Whitelist allowed MIME types
- **File Size Limits**: 10MB for documents, 100MB for videos
- **Virus Scanning**: Integration with antivirus service
- **Storage Isolation**: User files in separate directories
- **Access Control**: Signed URLs for downloads

### 6. Payment Security

- **PCI Compliance**: No card data stored locally
- **Payment Gateway**: Integration with secure providers
- **Transaction Verification**: Two-step verification process
- **Audit Trail**: All transactions logged
- **Encryption**: Payment data encrypted in transit

## Performance Optimization

### 1. Frontend Optimization

- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with WebP
- **Lazy Loading**: Components and images below fold
- **Caching**: React Query for data caching
- **Bundle Size**: Tree shaking and minification

### 2. Backend Optimization

- **Database Indexing**: Indexes on frequently queried fields
- **Query Optimization**: Select only needed fields
- **Connection Pooling**: Prisma connection pool
- **Caching Strategy**: Redis for session and frequently accessed data
- **API Response Compression**: Gzip compression

### 3. Database Optimization

- **Indexes**: On foreign keys, search fields, date fields
- **Query Optimization**: Avoid N+1 queries, use includes wisely
- **Pagination**: Cursor-based pagination for large datasets
- **Archiving**: Move old data to archive tables
- **Read Replicas**: For production scaling

### 4. Asset Optimization

- **CDN**: Static assets served from CDN
- **Image Formats**: WebP with fallbacks
- **Video Streaming**: Adaptive bitrate streaming
- **File Compression**: Gzip for text files

## Deployment Architecture

### Development Environment

```
Local Machine
├── Next.js Dev Server (localhost:3000)
├── SQLite Database (prisma/dev.db)
└── File Storage (local filesystem)
```

### Production Environment

```
Cloud Infrastructure (e.g., Vercel, AWS, Azure)
├── Next.js Application (Serverless/Container)
├── PostgreSQL Database (Managed Service)
├── File Storage (S3/Azure Blob/Cloud Storage)
├── CDN (CloudFront/Azure CDN)
├── Email Service (SendGrid/AWS SES)
└── Payment Gateway (Stripe/PayPal/Telebirr API)
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="random-secret-key"

# Email
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="password"

# File Storage
STORAGE_PROVIDER="s3" # or "azure" or "local"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="..."

# Payment
PAYMENT_GATEWAY_API_KEY="..."
TELEBIRR_API_KEY="..."

# Feature Flags
ENABLE_VIDEO_UPLOAD="true"
ENABLE_AI_FEATURES="false"
```

## Migration Strategy

### Phase 1: Core Infrastructure (Weeks 1-2)
- Authentication system
- User management
- RBAC implementation
- Basic dashboards

### Phase 2: Academic Features (Weeks 3-4)
- Course management
- Enrollment system
- Grade management
- Attendance tracking

### Phase 3: Communication (Week 5)
- Messaging system
- Notifications
- Feedback system
- Announcements

### Phase 4: Financial (Week 6)
- Payment processing
- Billing system
- Financial reports

### Phase 5: Advanced Features (Week 7-8)
- Course materials
- Scheduling system
- Reports and analytics
- Mobile optimization

### Phase 6: Testing & Launch (Week 9-10)
- Comprehensive testing
- Performance optimization
- Security audit
- Production deployment

## Future Enhancements

### AI Integration (Gemini AI)

1. **Intelligent Tutoring**
   - Personalized learning recommendations
   - Automated homework help
   - Study plan generation

2. **Predictive Analytics**
   - Student performance prediction
   - At-risk student identification
   - Attendance pattern analysis

3. **Automated Grading**
   - Essay grading assistance
   - Multiple choice auto-grading
   - Plagiarism detection

4. **Chatbot Assistant**
   - 24/7 student support
   - FAQ automation
   - Course information queries

### Mobile Applications

- Native iOS and Android apps
- Offline mode support
- Push notifications
- Biometric authentication

### Advanced Features

- Video conferencing integration
- Virtual classroom
- Interactive whiteboard
- Gamification elements
- Social learning features
- Parent-teacher conference scheduling
- Report card generation
- Transcript management

## Design Decisions and Rationale

### 1. Next.js App Router vs Pages Router
**Decision**: Use App Router
**Rationale**: 
- Server Components for better performance
- Built-in layouts and loading states
- Improved data fetching patterns
- Future-proof architecture

### 2. SQLite vs PostgreSQL
**Decision**: SQLite for development, PostgreSQL for production
**Rationale**:
- SQLite: Easy setup, no external dependencies
- PostgreSQL: Production-grade, better concurrency, advanced features

### 3. JWT vs Session-based Auth
**Decision**: JWT with NextAuth
**Rationale**:
- Stateless authentication
- Scalable across multiple servers
- Built-in security features
- Easy integration with Next.js

### 4. Monolithic vs Microservices
**Decision**: Monolithic Next.js application
**Rationale**:
- Simpler deployment and maintenance
- Faster development for MVP
- Sufficient for K-12 school scale
- Can be split later if needed

### 5. File Storage Strategy
**Decision**: Cloud storage (S3/Azure) for production
**Rationale**:
- Scalable and reliable
- CDN integration
- Cost-effective
- Backup and redundancy

### 6. Real-time vs Polling for Notifications
**Decision**: Polling with React Query
**Rationale**:
- Simpler implementation
- Sufficient for notification use case
- Can upgrade to WebSockets later
- Lower server resource usage

## Conclusion

This design document provides a comprehensive blueprint for implementing the E-Student Portal K-12 system. The architecture leverages modern web technologies (Next.js, React, Prisma) while maintaining security, scalability, and user experience as top priorities. The modular design allows for incremental development and future enhancements, including AI integration.

The system addresses all 22 requirements specified in the requirements document, with clear data models, security measures, and testing strategies to ensure a robust and reliable platform for K-12 educational institutions.
