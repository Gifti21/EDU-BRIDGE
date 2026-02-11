# E-Student Portal

A comprehensive K-12 school management system built with Next.js, React, Tailwind CSS, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database URL and other configuration.

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Login Credentials

After seeding the database, you can use these credentials:

- **Administrator:** admin@greenwood.edu / admin123
- **Teacher:** math.teacher@greenwood.edu / teacher123  
- **Parent:** john.smith@email.com / parent123
- **Student:** alice.smith@student.greenwood.edu / student123
- **Financer:** finance@greenwood.edu / finance123

## 📊 Features

- **Role-Based Access Control** - Separate dashboards for students, teachers, parents, administrators, and financial staff
- **Academic Management** - Grade tracking, assignment management, and progress monitoring
- **Attendance System** - Digital attendance with real-time parent notifications
- **Communication Hub** - Secure messaging and announcements
- **Financial Management** - Fee management and online payment processing
- **Calendar & Events** - School calendar and event management
- **Behavioral Tracking** - Disciplinary records and incident management
- **Reporting & Analytics** - Comprehensive reporting with visual analytics

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
- `npm run db:reset` - Reset database

## 🏗️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn/ui
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** NextAuth.js
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
├── lib/                    # Utility functions
├── types/                  # TypeScript definitions
└── hooks/                  # Custom React hooks

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seeding script
```

## 🔧 Development

The project uses:
- **TypeScript** for type safety
- **Prisma** for database operations
- **Tailwind CSS** for styling
- **ESLint** for code quality

## 📝 License

This project is licensed under the MIT License.