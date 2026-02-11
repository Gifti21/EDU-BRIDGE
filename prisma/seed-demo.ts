import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding demo data...');

    // Create some demo pending users for testing the admin dashboard
    const demoUsers = [
        {
            email: 'john.student@example.com',
            password: await hash('password123', 12),
            role: 'STUDENT',
            profile: {
                firstName: 'John',
                lastName: 'Smith',
                phone: '+1234567890',
                address: '123 Main St, City, State 12345'
            }
        },
        {
            email: 'jane.teacher@example.com',
            password: await hash('password123', 12),
            role: 'TEACHER',
            profile: {
                firstName: 'Jane',
                lastName: 'Johnson',
                phone: '+1234567891',
                address: '456 Oak Ave, City, State 12345'
            }
        },
        {
            email: 'bob.parent@example.com',
            password: await hash('password123', 12),
            role: 'PARENT',
            profile: {
                firstName: 'Bob',
                lastName: 'Wilson',
                phone: '+1234567892',
                address: '789 Pine St, City, State 12345'
            }
        },
        {
            email: 'alice.admin@example.com',
            password: await hash('password123', 12),
            role: 'ADMINISTRATOR',
            profile: {
                firstName: 'Alice',
                lastName: 'Brown',
                phone: '+1234567893',
                address: '321 Elm St, City, State 12345'
            }
        }
    ];

    for (const userData of demoUsers) {
        // Create user
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                role: userData.role,
                isApproved: false, // All users start as pending
                profile: {
                    create: userData.profile
                }
            }
        });

        // Create registration request
        await prisma.userRegistration.create({
            data: {
                userId: user.id,
                status: 'PENDING',
                submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
            }
        });

        console.log(`✅ Created pending user: ${userData.profile.firstName} ${userData.profile.lastName} (${userData.role})`);
    }

    // Create an approved admin user for testing
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@edubridge.com',
            password: await hash('admin123', 12),
            role: 'ADMINISTRATOR',
            isApproved: true,
            profile: {
                create: {
                    firstName: 'System',
                    lastName: 'Administrator',
                    phone: '+1234567894',
                    address: 'EduBridge HQ'
                }
            }
        }
    });

    await prisma.userRegistration.create({
        data: {
            userId: adminUser.id,
            status: 'APPROVED',
            submittedAt: new Date(),
            reviewedAt: new Date(),
            reviewedBy: 'system'
        }
    });

    console.log('✅ Created approved admin user: admin@edubridge.com');

    console.log('🎉 Demo data seeding completed!');
    console.log('\n📋 Demo Users Created:');
    console.log('- john.student@example.com (Student) - PENDING');
    console.log('- jane.teacher@example.com (Teacher) - PENDING');
    console.log('- bob.parent@example.com (Parent) - PENDING');
    console.log('- alice.admin@example.com (Administrator) - PENDING');
    console.log('- admin@edubridge.com (Administrator) - APPROVED');
    console.log('\n🔑 Admin Access:');
    console.log('- URL: http://localhost:3001/admin/login');
    console.log('- Username: admin');
    console.log('- Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });