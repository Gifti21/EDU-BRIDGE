# Quick Test - Admin User Creation

## 🚀 Fastest Way to Test (3 steps)

### 1. Start the server
```bash
npm run dev
```

### 2. Run the test script
```bash
node test-admin-api.js
```

### 3. Check the results
- ✅ Look for success messages in the console
- 📧 Check console for temporary passwords
- 🗄️ Open Prisma Studio to see created users:
  ```bash
  npm run db:studio
  ```

---

## 🔧 Manual Test (Browser Console)

1. **Login as admin** at http://localhost:3000/auth/login
   - Email: `admin@school.com`
   - Password: `Admin123!`

2. **Open browser console** (Press F12)

3. **Paste and run:**
```javascript
fetch('/api/admin/users/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newstudent@school.com',
    firstName: 'New',
    lastName: 'Student',
    phone: '1234567890',
    address: '123 Main St, City',
    role: 'STUDENT',
    gradeLevel: 'Grade 10',
    section: 'A'
  })
})
.then(r => r.json())
.then(d => console.log('✅ Result:', d))
.catch(e => console.error('❌ Error:', e));
```

4. **Check the response** - Should see:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "studentId": "STU-2024-0001",
    "temporaryPassword": "..."
  }
}
```

---

## 📋 What Gets Created

When you create a user, the system automatically:

✅ Creates User account  
✅ Creates UserProfile  
✅ Creates role-specific profile (StudentProfile, TeacherProfile, etc.)  
✅ Generates unique ID (STU-YYYY-NNNN or EMP-YYYY-NNNN)  
✅ Generates secure temporary password  
✅ Sends welcome email (or logs to console)  
✅ Auto-approves the account  

---

## 🔍 Verify in Database

```bash
npm run db:studio
```

Check these tables:
- `User` - Main user account
- `UserProfile` - Basic profile info
- `StudentProfile` / `TeacherProfile` / etc. - Role-specific data

---

## 🐛 Troubleshooting

**"Unauthorized" error?**
→ Make sure you're logged in as admin

**"User already exists"?**
→ Change the email address or delete from database

**No email sent?**
→ Normal! Check console for email content (SMTP not configured)

**Database error?**
→ Run: `npm run db:push`

---

## 📝 Test Different Roles

### Student
```json
{
  "email": "student@test.com",
  "firstName": "John",
  "lastName": "Doe",
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
  "email": "teacher@test.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "TEACHER",
  "department": "Math",
  "specialization": "Algebra"
}
```

### Parent
```json
{
  "email": "parent@test.com",
  "firstName": "Bob",
  "lastName": "Johnson",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "PARENT",
  "relationship": "Father"
}
```
