import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Database Seeding (Prisma Seed - Syllabus Section 8)...");

  // 1. Seed Departments (Lecture 1: Relations & Lookup tables)
  const cseDept = await prisma.department.upsert({
    where: { name: "Computer Science & Engineering" },
    update: {},
    create: {
      name: "Computer Science & Engineering",
      collegeName: "Institute of Technology",
    },
  });

  const itDept = await prisma.department.upsert({
    where: { name: "Information Technology" },
    update: {},
    create: {
      name: "Information Technology",
      collegeName: "Institute of Technology",
    },
  });

  const mechDept = await prisma.department.upsert({
    where: { name: "Mechanical Engineering" },
    update: {},
    create: {
      name: "Mechanical Engineering",
      collegeName: "Institute of Technology",
    },
  });

  console.log("✅ Seeded Departments: CSE, IT, Mechanical");

  // Hash default password for all seed accounts
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash("Password123!", salt);

  // 2. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@college.edu" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@college.edu",
      passwordHash: defaultPassword,
      role: "ADMIN",
      departmentId: cseDept.id,
    },
  });

  // 3. Seed Alumni Users
  const priya = await prisma.user.upsert({
    where: { email: "priya.sharma@alumni.edu" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "priya.sharma@alumni.edu",
      passwordHash: defaultPassword,
      role: "ALUMNI",
      departmentId: cseDept.id,
      graduationYear: 2021,
      currentCompany: "Google",
      jobTitle: "Senior Software Engineer",
      skills: "System Design, Go, Distributed Systems, Cloud Architecture",
    },
  });

  const david = await prisma.user.upsert({
    where: { email: "david.chen@alumni.edu" },
    update: {},
    create: {
      name: "David Chen",
      email: "david.chen@alumni.edu",
      passwordHash: defaultPassword,
      role: "ALUMNI",
      departmentId: itDept.id,
      graduationYear: 2019,
      currentCompany: "Microsoft",
      jobTitle: "Product Manager",
      skills: "Product Strategy, Cloud Solutions, Agile, User Experience",
    },
  });

  // 4. Seed Student Users
  const alex = await prisma.user.upsert({
    where: { email: "alex.rivera@college.edu" },
    update: {},
    create: {
      name: "Alex Rivera",
      email: "alex.rivera@college.edu",
      passwordHash: defaultPassword,
      role: "STUDENT",
      departmentId: cseDept.id,
      studentNumber: "STU2024091",
      batchYear: 2022,
      graduationYear: 2026,
      skills: "JavaScript, React, Node.js, PostgreSQL",
    },
  });

  const neha = await prisma.user.upsert({
    where: { email: "neha.patel@college.edu" },
    update: {},
    create: {
      name: "Neha Patel",
      email: "neha.patel@college.edu",
      passwordHash: defaultPassword,
      role: "STUDENT",
      departmentId: itDept.id,
      studentNumber: "STU2023104",
      batchYear: 2023,
      graduationYear: 2027,
      skills: "Python, Data Analysis, SQL",
    },
  });

  console.log("✅ Seeded Users: 1 Admin, 2 Alumni, 2 Students");

  // 5. Seed Posts (1:N with User)
  const post1 = await prisma.post.create({
    data: {
      authorId: priya.id,
      title: "Advice for Software Engineering Interviews in 2026",
      content:
        "Focus on fundamental data structures, relational database normalization (3NF), and building clean, modular REST APIs with Express.js and PostgreSQL. Real portfolio projects stand out the most!",
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: alex.id,
      title: "Exploring Backend Architecture with Express & Prisma",
      content:
        "Currently working on normalizing our database schema and implementing clean MVC controllers. Alumni guidance on scalable backend patterns would be great!",
    },
  });

  // 6. Seed Comments & Composite Key Likes
  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: alex.id,
      content: "Thank you for the advice, Priya! This is very insightful.",
    },
  });

  await prisma.postLike.create({
    data: {
      userId: alex.id,
      postId: post1.id,
    },
  });

  console.log("✅ Seeded Posts, Comments, and PostLikes (Composite PK)");

  // 7. Seed Mentorship Request
  await prisma.mentorship.create({
    data: {
      studentId: alex.id,
      alumniId: priya.id,
      status: "ACCEPTED",
      message:
        "Hi Priya! I would love guidance on preparing for fullstack backend engineering roles.",
    },
  });

  // 8. Seed Opportunities & Applications (M:N Relation)
  const opp1 = await prisma.opportunity.create({
    data: {
      postedById: priya.id,
      title: "Software Engineer Intern - Summer 2026",
      company: "Google",
      location: "Bangalore / Hybrid",
      type: "INTERNSHIP",
      description:
        "Join our cloud systems team to build scalable services using Node.js and PostgreSQL. Great for 3rd and 4th year students.",
      deadline: new Date(Date.now() + 86400000 * 30),
    },
  });

  await prisma.application.create({
    data: {
      opportunityId: opp1.id,
      studentId: alex.id,
      resumeUrl: "https://drive.google.com/sample-resume-alex.pdf",
      status: "SUBMITTED",
    },
  });

  console.log("✅ Seeded Mentorship and Opportunity Applications");
  console.log("🚀 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
