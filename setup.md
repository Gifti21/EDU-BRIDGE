# E-STUDENT PORTAL Setup Guide

## 🚀 Quick Start

Follow these steps to set up your E-STUDENT PORTAL development environment:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and update it with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/e_student_portal?schema=public"
```

### 3. Set Up Database

Generate Prisma client:
```bash
npm run db:generate
```

Push the schema to your database:
```bash
npm run db:push
```

Seed the database with sample data:
```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your E-STUDENT PORTAL!

## 🔑 Default Login Credentials

After seeding, you can log in with these accounts:

- **Administrator**: admin@greenwood.edu / admin123
- **Teacher**: math.teacher@greenwood.edu / teacher123  
- **Parent**: john.smith@email.com / parent123
- **Student**: alice.smith@student.greenwood.edu / student123
- **Financer**: finance@greenwood.edu / finance123

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database (⚠️ Deletes all data)

## 📊 Database Management

### View Data
Open Prisma Studio to view and edit your data:
```bash
npm run db:studio
```

### Reset Database
To start fresh (⚠️ This will delete all data):
```bash
npm run db:reset
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Make sure PostgreSQL is running
   - Check your `DATABASE_URL` in `.env`
   - Ensure the database exists

2. **Prisma Client Not Generated**
   ```bash
   npm run db:generate
   ```

3. **Missing Dependencies**
   ```bash
   npm install
   ```

4. **Port Already in Use**
   - Change the port: `npm run dev -- -p 3001`
   - Or kill the process using port 3000

### Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify your database connection
4. Make sure you've run the setup steps in order

## 🎯 Next Steps

Once your setup is complete, you can:
1. Explore the landing page at [http://localhost:3000](http://localhost:3000)
2. View the database in Prisma Studio
3. Start building authentication (Task 3)
4. Customize the design and branding
5. Add more sample data as needed

Happy coding! 🚀