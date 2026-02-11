# Testing Guide - Admin User Creation API

## Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Ensure database is set up:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Have an admin account to test with** (created by seed script)

## Method 1: Using cURL (Command Line)

### Step 1: Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@school.com\",\"password\":\"Admin123!\"}" \
  -c cookies.txt
```

This saves the authentication cookie to `cookies.txt`.

### Step 2: Create a Student
```bash
curl -X POST http://localhost:3000/api/admin/users/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"email\": \"student1@school.com\",
    \"firstName\": \"John\",
    \"lastName\": \"Doe\",
    \"phone\": \"1234567890\",
    \"address\": \"123 Main Street, City\",
    \"role\": \"STUDENT\",
    \"gradeLevel\": \"Grade 10\",
    \"section\": \"A\"
  }"
```

### Step 3: Create a Teacher
```bash
curl -X POST http://localhost:3000/api/admin/users/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"email\": \"teacher1@school.com\",
    \"firstName\": \"Jane\",
    \"lastName\": \"Smith\",
    \"phone\": \"0987654321\",
    \"address\": \"456 Oak Avenue, City\",
    \"role\": \"TEACHER\",
    \"department\": \"Mathematics\",
    \"specialization\": \"Algebra\"
  }"
```

### Step 4: Create a Parent
```bash
curl -X POST http://localhost:3000/api/admin/users/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"email\": \"parent1@school.com\",
    \"firstName\": \"Robert\",
    \"lastName\": \"Johnson\",
    \"phone\": \"5551234567\",
    \"address\": \"789 Pine Road, City\",
    \"role\": \"PARENT\",
    \"relationship\": \"Father\"
  }"
```

## Method 2: Using Postman or Thunder Client (VS Code Extension)

### Step 1: Login
- **Method:** POST
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "admin@school.com",
    "password": "Admin123!"
  }
  ```
- **Important:** Save the `token` cookie from the response

### Step 2: Create User
- **Method:** POST
- **URL:** `http://localhost:3000/api/admin/users/create`
- **Headers:** `Content-Type: application/json`
- **Cookies:** Include the token from login
- **Body (JSON):**
  ```json
  {
    "email": "newuser@school.com",
    "firstName": "Test",
    "lastName": "User",
    "phone": "1234567890",
    "address": "123 Test Street, Test City",
    "role": "STUDENT",
    "gradeLevel": "Grade 9",
    "section": "B"
  }
  ```

## Method 3: Using Browser Console (Quick Test)

1. **Login to the admin dashboard** at `http://localhost:3000/auth/login`
2. **Open browser console** (F12)
3. **Run this JavaScript:**

```javascript
// Create a student
fetch('/api/admin/users/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'teststudent@school.com',
    firstName: 'Test',
    lastName: 'Student',
    phone: '1234567890',
    address: '123 Test Street, Test City',
    role: 'STUDENT',
    gradeLevel: 'Grade 10',
    section: 'A'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

## Expected Responses

### Success Response (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "clx...",
    "email": "student1@school.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "studentId": "STU-2024-0001",
    "temporaryPassword": "TempPass123!" // Only in development
  }
}
```

### Error Response - Unauthorized (401):
```json
{
  "error": "Unauthorized"
}
```

### Error Response - Duplicate Email (409):
```json
{
  "error": "User with this email already exists"
}
```

### Error Response - Validation Error (400):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Please enter a valid email address"
    }
  ]
}
```

## What to Check After Creating a User

1. **Check the console output** - You should see:
   - Welcome email details (if email service is not configured)
   - Generated student/employee ID
   - Temporary password

2. **Check the database:**
   ```bash
   npm run db:studio
   ```
   - Verify user was created in `User` table
   - Verify profile was created in `UserProfile` table
   - Verify role-specific profile (StudentProfile, TeacherProfile, etc.)

3. **Test login with new user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"student1@school.com\",\"password\":\"<temporary-password>\"}"
   ```

## Testing Different Roles

### Student
```json
{
  "email": "student@school.com",
  "firstName": "Student",
  "lastName": "Test",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "STUDENT",
  "gradeLevel": "Grade 10",
  "section": "A"
}
```

### Teacher
```json
{
  "email": "teacher@school.com",
  "firstName": "Teacher",
  "lastName": "Test",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "TEACHER",
  "department": "Science",
  "specialization": "Physics"
}
```

### Parent
```json
{
  "email": "parent@school.com",
  "firstName": "Parent",
  "lastName": "Test",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "PARENT",
  "relationship": "Mother"
}
```

### Administrator
```json
{
  "email": "admin2@school.com",
  "firstName": "Admin",
  "lastName": "Test",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "ADMINISTRATOR",
  "department": "Administration"
}
```

### Financer
```json
{
  "email": "financer@school.com",
  "firstName": "Financer",
  "lastName": "Test",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "FINANCER",
  "department": "Finance",
  "accessLevel": "FULL_ACCESS"
}
```

## Troubleshooting

### Issue: "Unauthorized" error
- **Solution:** Make sure you're logged in as an admin and the cookie is being sent

### Issue: "User with this email already exists"
- **Solution:** Use a different email address or delete the existing user from the database

### Issue: Email not being sent
- **Solution:** This is expected if SMTP is not configured. Check the console for the email content

### Issue: Database error
- **Solution:** Run `npm run db:push` to ensure the database schema is up to date

## Next Steps

After successfully creating users, you can:
1. Test logging in with the created users
2. Verify role-based access control
3. Test password reset functionality
4. Create parent-student relationships (Task 3.3)
