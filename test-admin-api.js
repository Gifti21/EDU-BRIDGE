/**
 * Simple test script for Admin User Creation API
 * Run with: node test-admin-api.js
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const ADMIN_CREDENTIALS = {
    email: 'admin@school.com',
    password: 'Admin123!'
};

const TEST_USERS = [
    {
        email: 'test.student@school.com',
        firstName: 'Test',
        lastName: 'Student',
        phone: '1234567890',
        address: '123 Test Street, Test City',
        role: 'STUDENT',
        gradeLevel: 'Grade 10',
        section: 'A'
    },
    {
        email: 'test.teacher@school.com',
        firstName: 'Test',
        lastName: 'Teacher',
        phone: '0987654321',
        address: '456 Test Avenue, Test City',
        role: 'TEACHER',
        department: 'Mathematics',
        specialization: 'Algebra'
    },
    {
        email: 'test.parent@school.com',
        firstName: 'Test',
        lastName: 'Parent',
        phone: '5551234567',
        address: '789 Test Road, Test City',
        role: 'PARENT',
        relationship: 'Father'
    }
];

// Helper function to make requests
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error('Request failed:', error.message);
        return { status: 0, error: error.message };
    }
}

// Test login
async function testLogin() {
    console.log('\n🔐 Testing Admin Login...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const result = await makeRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ADMIN_CREDENTIALS),
    });
    
    if (result.status === 200 && result.data.success) {
        console.log('✅ Login successful');
        console.log(`   User: ${result.data.user.email}`);
        console.log(`   Role: ${result.data.user.role}`);
        return result.data.token;
    } else {
        console.log('❌ Login failed');
        console.log(`   Status: ${result.status}`);
        console.log(`   Error: ${result.data.error || 'Unknown error'}`);
        return null;
    }
}

// Test user creation
async function testCreateUser(token, userData) {
    console.log(`\n👤 Creating ${userData.role}: ${userData.email}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const result = await makeRequest(`${BASE_URL}/api/admin/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}`,
        },
        body: JSON.stringify(userData),
    });
    
    if (result.status === 201 && result.data.success) {
        console.log('✅ User created successfully');
        console.log(`   ID: ${result.data.data.id}`);
        console.log(`   Email: ${result.data.data.email}`);
        console.log(`   Name: ${result.data.data.firstName} ${result.data.data.lastName}`);
        if (result.data.data.studentId) {
            console.log(`   Student ID: ${result.data.data.studentId}`);
        }
        if (result.data.data.employeeId) {
            console.log(`   Employee ID: ${result.data.data.employeeId}`);
        }
        if (result.data.data.temporaryPassword) {
            console.log(`   Temp Password: ${result.data.data.temporaryPassword}`);
        }
        return true;
    } else {
        console.log('❌ User creation failed');
        console.log(`   Status: ${result.status}`);
        console.log(`   Error: ${result.data.error || 'Unknown error'}`);
        if (result.data.details) {
            console.log('   Details:', JSON.stringify(result.data.details, null, 2));
        }
        return false;
    }
}

// Test unauthorized access
async function testUnauthorizedAccess() {
    console.log('\n🔒 Testing Unauthorized Access...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const result = await makeRequest(`${BASE_URL}/api/admin/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(TEST_USERS[0]),
    });
    
    if (result.status === 401 || result.status === 403) {
        console.log('✅ Correctly blocked unauthorized access');
        console.log(`   Status: ${result.status}`);
    } else {
        console.log('❌ Security issue: Unauthorized access was allowed!');
        console.log(`   Status: ${result.status}`);
    }
}

// Main test function
async function runTests() {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   Admin User Creation API - Test Suite        ║');
    console.log('╚════════════════════════════════════════════════╝');
    
    // Test 1: Unauthorized access
    await testUnauthorizedAccess();
    
    // Test 2: Login as admin
    const token = await testLogin();
    
    if (!token) {
        console.log('\n❌ Cannot proceed without admin token');
        console.log('   Make sure:');
        console.log('   1. Development server is running (npm run dev)');
        console.log('   2. Database is seeded (npm run db:seed)');
        console.log('   3. Admin credentials are correct');
        return;
    }
    
    // Test 3: Create users
    let successCount = 0;
    for (const userData of TEST_USERS) {
        const success = await testCreateUser(token, userData);
        if (success) successCount++;
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   Test Summary                                 ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`\n✅ Successfully created: ${successCount}/${TEST_USERS.length} users`);
    
    if (successCount === TEST_USERS.length) {
        console.log('\n🎉 All tests passed!');
        console.log('\nNext steps:');
        console.log('1. Check console output for temporary passwords');
        console.log('2. Open Prisma Studio: npm run db:studio');
        console.log('3. Try logging in with created users');
    } else {
        console.log('\n⚠️  Some tests failed. Check the errors above.');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the tests
runTests().catch(error => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
});
