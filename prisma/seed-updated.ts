/**
 * Updated Database Seed Script for E-STUDENT PORTAL
 * Creates test users for all roles with the new schema
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // ============================================================================
    // ADMINISTRATOR
    // ============================================================================
    console.log('👨‍💼 Creating administrator...');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            password: await hash('admin123', 12),
            role: 'ADMINISTRATOR',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'Admin',
                    lastName: 'User',
                    phone: '+1234567890',
                    address: '123 Admin Street'
                }
            },
            adminProfile: {
                create: {
                    department: 'Administration',
                    permissions: JSON.stringify(['all'])
                }
            }
        }
    });

    console.log('✅ Administrator created:', admin.email);

    // ============================================================================
    // TEACHER
    // ============================================================================
    console.log('👨‍🏫 Creating teacher...');

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: {},
        create: {
            email: 'teacher@school.com',
            password: await hash('teacher123', 12),
            role: 'TEACHER',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'John',
                    lastName: 'Teacher',
                    phone: '+1234567891',
                    address: '456 Teacher Avenue'
                }
            },
            teacherProfile: {
                create: {
                    employeeId: 'EMP-2024-0001',
                    department: 'Mathematics',
                    specialization: 'Algebra',
                    hireDate: new Date('2020-01-01')
                }
            }
        }
    });

    console.log('✅ Teacher created:', teacher.email);

    // ============================================================================
    // STUDENT
    // ============================================================================
    console.log('🧑‍🎓 Creating student...');

    const student = await prisma.user.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: {
            email: 'student@school.com',
            password: await hash('student123', 12),
            role: 'STUDENT',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'Alice',
                    lastName: 'Student',
                    phone: '+1234567892',
                    address: '789 Student Road',
                    dateOfBirth: new Date('2008-05-15')
                }
            },
            studentProfile: {
                create: {
                    studentId: 'STU-2024-0001',
                    gradeLevel: '10th Grade',
                    section: 'A',
                    enrollmentDate: new Date('2023-09-01')
                }
            }
        }
    });

    console.log('✅ Student created:', student.email);

    // ============================================================================
    // PARENT
    // ============================================================================
    console.log('👨‍👩‍👧 Creating parent...');

    const parent = await prisma.user.upsert({
        where: { email: 'parent@school.com' },
        update: {},
        create: {
            email: 'parent@school.com',
            password: await hash('parent123', 12),
            role: 'PARENT',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'Mary',
                    lastName: 'Parent',
                    phone: '+1234567893',
                    address: '789 Student Road'
                }
            },
            parentProfile: {
                create: {
                    relationship: 'Mother',
                    occupation: 'Engineer'
                }
            }
        }
    });

    console.log('✅ Parent created:', parent.email);

    // Link parent to student
    const studentProfile = await prisma.studentProfile.findFirst({
        where: { userId: student.id }
    });

    const parentProfile = await prisma.parentProfile.findFirst({
        where: { userId: parent.id }
    });

    if (studentProfile && parentProfile) {
        await prisma.parentStudent.upsert({
            where: {
                parentId_studentId: {
                    parentId: parentProfile.id,
                    studentId: studentProfile.id
                }
            },
            update: {},
            create: {
                parentId: parentProfile.id,
                studentId: studentProfile.id,
                isPrimary: true
            }
        });
        console.log('✅ Parent-Student relationship created');
    }

    // ============================================================================
    // FINANCER
    // ============================================================================
    console.log('💰 Creating financer...');

    const financer = await prisma.user.upsert({
        where: { email: 'financer@school.com' },
        update: {},
        create: {
            email: 'financer@school.com',
            password: await hash('financer123', 12),
            role: 'FINANCER',
            isApproved: true,
            isActive: true,
            profile: {
                create: {
                    firstName: 'Robert',
                    lastName: 'Financer',
                    phone: '+1234567894',
                    address: '321 Finance Street'
                }
            },
            financerProfile: {
                create: {
                    department: 'Finance',
                    accessLevel: 'FULL_ACCESS'
                }
            }
        }
    });

    console.log('✅ Financer created:', financer.email);

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Administrator:');
    console.log('  Email: admin@school.com');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Teacher:');
    console.log('  Email: teacher@school.com');
    console.log('  Password: teacher123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Student:');
    console.log('  Email: student@school.com');
    console.log('  Password: student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Parent:');
    console.log('  Email: parent@school.com');
    console.log('  Password: parent123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Financer:');
    console.log('  Email: financer@school.com');
    console.log('  Password: financer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
