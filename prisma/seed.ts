/**
 * Database Seed Script for E-STUDENT PORTAL
 * Creates comprehensive sample data for development and testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Hash password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

/**
 * Main seeding function
 */
async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (in development only)
    if (process.env.NODE_ENV !== 'production') {
        console.log('🧹 Clearing existing data...');

        // Delete in reverse order of dependencies
        await prisma.auditLog.deleteMany();
        await prisma.billingStatement.deleteMany();
        await prisma.payment.deleteMany();
        await prisma.feeStructure.deleteMany();
        await prisma.courseMaterial.deleteMany();
        await prisma.announcementAttachment.deleteMany();
        await prisma.announcement.deleteMany();
        await prisma.notificationPreference.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.feedback.deleteMany();
        await prisma.messageAttachment.deleteMany();
        await prisma.message.deleteMany();
        await prisma.classSchedule.deleteMany();
        await prisma.timeSlot.deleteMany();
        await prisma.room.deleteMany();
        await prisma.semester.deleteMany();
        await prisma.academicYear.deleteMany();
        await prisma.teacherAttendance.deleteMany();
        await prisma.attendanceRecord.deleteMany();
        await prisma.grade.deleteMany();
        await prisma.assignmentSubmission.deleteMany();
        await prisma.assignment.deleteMany();
        await prisma.courseAssignment.deleteMany();
        await prisma.courseEnrollment.deleteMany();
        await prisma.coursePrerequisite.deleteMany();
        await prisma.course.deleteMany();
        await prisma.parentStudent.deleteMany();
        await prisma.studentProfile.deleteMany();
        await prisma.parentProfile.deleteMany();
        await prisma.teacherProfile.deleteMany();
        await prisma.adminProfile.deleteMany();
        await prisma.financerProfile.deleteMany();
        await prisma.userRegistration.deleteMany();
        await prisma.userProfile.deleteMany();
        await prisma.user.deleteMany();
        await prisma.systemSetting.deleteMany();
    }

    // ============================================================================
    // SYSTEM SETTINGS
    // ============================================================================

    console.log('⚙️ Creating system settings...');

    const systemSettings = [
        {
            key: 'school_name',
            value: 'Greenwood High School',
            type: 'string',
            category: 'general',
            description: 'Name of the school',
            isPublic: true,
        },
        {
            key: 'academic_year',
            value: '2024-2025',
            type: 'string',
            category: 'academic',
            description: 'Current academic year',
            isPublic: true,
        },
        {
            key: 'grading_scale',
            value: JSON.stringify({
                A: { min: 90, max: 100 },
                'B+': { min: 85, max: 89 },
                B: { min: 80, max: 84 },
                'C+': { min: 75, max: 79 },
                C: { min: 70, max: 74 },
                D: { min: 60, max: 69 },
                F: { min: 0, max: 59 }
            }),
            type: 'json',
            category: 'academic',
            description: 'Grading scale configuration',
            isPublic: true,
        }
    ];

    for (const setting of systemSettings) {
        await prisma.systemSetting.create({ data: setting });
    }

    // ============================================================================
    // ACADEMIC YEAR AND SEMESTERS
    // ============================================================================

    console.log('📅 Creating academic year and semesters...');

    const academicYear = await prisma.academicYear.create({
        data: {
            year: '2024-2025',
            startDate: new Date('2024-09-01'),
            endDate: new Date('2025-06-30'),
            isActive: true,
        }
    });

    const semester1 = await prisma.semester.create({
        data: {
            academicYearId: academicYear.id,
            name: '1st Semester',
            startDate: new Date('2024-09-01'),
            endDate: new Date('2025-01-31'),
            isActive: true,
        }
    });

    const semester2 = await prisma.semester.create({
        data: {
            academicYearId: academicYear.id,
            name: '2nd Semester',
            startDate: new Date('2025-02-01'),
            endDate: new Date('2025-06-30'),
            isActive: false,
        }
    });

    // ============================================================================
    // ROOMS
    // ============================================================================

    console.log('🏫 Creating rooms...');

    const rooms = [
        {
            roomNumber: 'R-101',
            building: 'Main Building',
            capacity: 30,
            type: 'CLASSROOM',
            equipment: JSON.stringify(['projector', 'whiteboard', 'speakers']),
            isActive: true,
        },
        {
            roomNumber: 'LAB-A',
            building: 'Science Building',
            capacity: 20,
            type: 'LAB',
            equipment: JSON.stringify(['microscopes', 'lab_equipment', 'safety_gear']),
            isActive: true,
        },
        {
            roomNumber: 'COMP-1',
            building: 'Technology Building',
            capacity: 25,
            type: 'LAB',
            equipment: JSON.stringify(['computers', 'projector', 'network_equipment']),
            isActive: true,
        }
    ];

    const createdRooms = [];
    for (const room of rooms) {
        const createdRoom = await prisma.room.create({ data: room });
        createdRooms.push(createdRoom);
    }

    // ============================================================================
    // USERS - ADMINISTRATOR
    // ============================================================================

    console.log('👨‍💼 Creating administrator...');

    const adminUser = await prisma.user.create({
        data: {
            email: 'medhanitmedi344@gmail.com',
            password: await hashPassword('Medhanit_21'),
            role: 'ADMINISTRATOR',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'Medhanit',
                    lastName: 'Gelalcha',
                    phone: '+251938675525',
                    address: '123 School Admin St, Education City',
                }
            },
            adminProfile: {
                create: {
                    department: 'Administration',
                    permissions: JSON.stringify(['all']),
                }
            }
        }
    });

    // ============================================================================
    // USERS - FINANCER
    // ============================================================================

    console.log('💰 Creating financer...');

    const financerUser = await prisma.user.create({
        data: {
            email: 'finance@greenwood.edu',
            password: await hashPassword('finance123'),
            role: 'FINANCER',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'Michael',
                    lastName: 'Thompson',
                    phone: '+1-555-0003',
                    address: '789 Finance St, Education City',
                }
            },
            financerProfile: {
                create: {
                    department: 'Finance',
                    accessLevel: 'FULL_ACCESS',
                }
            }
        }
    });

    // ============================================================================
    // USERS - TEACHERS
    // ============================================================================

    console.log('👨‍🏫 Creating teachers...');

    const teachersData = [
        {
            email: 'math.teacher@greenwood.edu',
            firstName: 'Emily',
            lastName: 'Davis',
            department: 'Mathematics',
            specialization: 'Algebra and Calculus'
        },
        {
            email: 'science.teacher@greenwood.edu',
            firstName: 'Robert',
            lastName: 'Wilson',
            department: 'Science',
            specialization: 'Physics and Chemistry'
        },
        {
            email: 'english.teacher@greenwood.edu',
            firstName: 'Lisa',
            lastName: 'Brown',
            department: 'English',
            specialization: 'Literature and Writing'
        }
    ];

    const createdTeachers = [];
    for (let i = 0; i < teachersData.length; i++) {
        const teacherData = teachersData[i];
        const teacher = await prisma.user.create({
            data: {
                email: teacherData.email,
                password: await hashPassword('teacher123'),
                role: 'TEACHER',
                isApproved: true,
                isActive: true,
                profile: {
                    create: {
                        firstName: teacherData.firstName,
                        lastName: teacherData.lastName,
                        phone: `+1-555-010${i + 1}`,
                        address: `${100 + i} Teacher Lane, Education City`,
                    }
                },
                teacherProfile: {
                    create: {
                        employeeId: `EMP-2024-${String(i + 1).padStart(4, '0')}`,
                        department: teacherData.department,
                        specialization: teacherData.specialization,
                        hireDate: new Date('2020-01-01'),
                    }
                }
            },
            include: {
                teacherProfile: true
            }
        });
        createdTeachers.push(teacher);
    }

    // ============================================================================
    // COURSES
    // ============================================================================

    console.log('📚 Creating courses...');

    const coursesData = [
        {
            courseCode: 'MATH101',
            courseName: 'Algebra I',
            description: 'Introduction to algebraic concepts and problem solving',
            credits: 4,
            gradeLevel: '9',
            department: 'Mathematics',
        },
        {
            courseCode: 'SCI101',
            courseName: 'Biology',
            description: 'Introduction to biological sciences and life processes',
            credits: 4,
            gradeLevel: '9',
            department: 'Science',
        },
        {
            courseCode: 'ENG101',
            courseName: 'English Literature',
            description: 'Reading and analysis of classic and contemporary literature',
            credits: 3,
            gradeLevel: '9',
            department: 'English',
        }
    ];

    const createdCourses = [];
    for (const courseData of coursesData) {
        const course = await prisma.course.create({ data: courseData });
        createdCourses.push(course);
    }

    // Assign teachers to courses
    for (let i = 0; i < createdCourses.length; i++) {
        await prisma.courseAssignment.create({
            data: {
                courseId: createdCourses[i].id,
                teacherId: createdTeachers[i].teacherProfile!.id,
                academicYear: '2024-2025',
                semester: '1st Semester',
                isPrimary: true,
            }
        });
    }

    // ============================================================================
    // USERS - PARENTS AND STUDENTS
    // ============================================================================

    console.log('👨‍👩‍👧‍👦 Creating parents and students...');

    const familiesData = [
        {
            parent: {
                email: 'john.smith@email.com',
                firstName: 'John',
                lastName: 'Smith',
                relationship: 'Father',
                occupation: 'Engineer',
            },
            students: [
                {
                    email: 'alice.smith@student.greenwood.edu',
                    firstName: 'Alice',
                    lastName: 'Smith',
                    gradeLevel: '9',
                    section: 'A'
                }
            ]
        },
        {
            parent: {
                email: 'mary.johnson@email.com',
                firstName: 'Mary',
                lastName: 'Johnson',
                relationship: 'Mother',
                occupation: 'Doctor',
            },
            students: [
                {
                    email: 'bob.johnson@student.greenwood.edu',
                    firstName: 'Bob',
                    lastName: 'Johnson',
                    gradeLevel: '9',
                    section: 'A'
                }
            ]
        }
    ];

    const createdStudents = [];
    let studentCounter = 1;

    for (const familyData of familiesData) {
        // Create parent
        const parent = await prisma.user.create({
            data: {
                email: familyData.parent.email,
                password: await hashPassword('parent123'),
                role: 'PARENT',
                isApproved: true,
                isActive: true,
                profile: {
                    create: {
                        firstName: familyData.parent.firstName,
                        lastName: familyData.parent.lastName,
                        phone: `+1-555-020${studentCounter}`,
                        address: `${200 + studentCounter} Family St, Education City`,
                    }
                },
                parentProfile: {
                    create: {
                        relationship: familyData.parent.relationship,
                        occupation: familyData.parent.occupation,
                    }
                }
            },
            include: {
                parentProfile: true
            }
        });

        // Create students for this parent
        for (const studentData of familyData.students) {
            const student = await prisma.user.create({
                data: {
                    email: studentData.email,
                    password: await hashPassword('student123'),
                    role: 'STUDENT',
                    isApproved: true,
                    isActive: true,
                    profile: {
                        create: {
                            firstName: studentData.firstName,
                            lastName: studentData.lastName,
                            phone: `+1-555-030${studentCounter}`,
                            address: `${200 + studentCounter} Family St, Education City`,
                            dateOfBirth: new Date('2008-01-01'),
                        }
                    },
                    studentProfile: {
                        create: {
                            studentId: `STU-2024-${String(studentCounter).padStart(4, '0')}`,
                            gradeLevel: studentData.gradeLevel,
                            section: studentData.section,
                            enrollmentDate: new Date('2023-09-01'),
                        }
                    }
                },
                include: {
                    studentProfile: true
                }
            });

            createdStudents.push(student);

            // Create parent-student relationship
            await prisma.parentStudent.create({
                data: {
                    studentId: student.studentProfile!.id,
                    parentId: parent.parentProfile!.id,
                    isPrimary: true,
                }
            });

            studentCounter++;
        }
    }

    // ============================================================================
    // COURSE ENROLLMENTS
    // ============================================================================

    console.log('📝 Creating course enrollments...');

    for (const student of createdStudents) {
        // Enroll students in all courses for their grade
        const studentGrade = student.studentProfile!.gradeLevel;
        const gradeCourses = createdCourses.filter(course => course.gradeLevel === studentGrade);

        for (const course of gradeCourses) {
            await prisma.courseEnrollment.create({
                data: {
                    studentId: student.studentProfile!.id,
                    courseId: course.id,
                    academicYear: '2024-2025',
                    semester: '1st Semester',
                    status: 'ACTIVE',
                }
            });
        }
    }

    // ============================================================================
    // FEE STRUCTURES
    // ============================================================================

    console.log('💵 Creating fee structures...');

    const feeStructures = [
        {
            name: 'Tuition Fee - Grade 9',
            description: 'Annual tuition fee for grade 9 students',
            amount: 5000.00,
            gradeLevel: '9',
            feeType: 'TUITION',
            frequency: 'ANNUAL',
            academicYear: '2024-2025',
            isActive: true,
        },
        {
            name: 'Registration Fee',
            description: 'One-time registration fee for new students',
            amount: 500.00,
            feeType: 'REGISTRATION',
            frequency: 'ONE_TIME',
            academicYear: '2024-2025',
            isActive: true,
        },
        {
            name: 'Platform Usage Fee',
            description: 'Annual fee for using the e-student portal',
            amount: 100.00,
            feeType: 'PLATFORM',
            frequency: 'ANNUAL',
            academicYear: '2024-2025',
            isActive: true,
        }
    ];

    for (const fee of feeStructures) {
        await prisma.feeStructure.create({ data: fee });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${createdRooms.length} rooms`);
    console.log(`- Created ${createdTeachers.length} teachers`);
    console.log(`- Created ${createdCourses.length} courses`);
    console.log(`- Created ${createdStudents.length} students`);
    console.log(`- Created ${familiesData.length} parents`);
    console.log(`- Created ${systemSettings.length} system settings`);
    console.log(`- Created ${feeStructures.length} fee structures`);
    console.log(`- Created 1 academic year with 2 semesters`);

    console.log('\n🔑 Default Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Administrator: medhanitmedi344@gmail.com / Medhanit_21');
    console.log('Teacher:       math.teacher@greenwood.edu / teacher123');
    console.log('Parent:        john.smith@email.com / parent123');
    console.log('Student:       alice.smith@student.greenwood.edu / student123');
    console.log('Financer:      finance@greenwood.edu / finance123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Execute seeding and handle errors
 */
main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
