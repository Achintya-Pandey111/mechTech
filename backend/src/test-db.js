
import prisma from "./configs/db.js";

async function testConnection() {
  try {
    await prisma.$connect();

    console.log("Connected to Supabase successfully!");

    const result = await prisma.$queryRaw`
      SELECT 1 AS result
    `;

    console.log("Query result:", result);

  } catch (error) {
    console.error("Connection failed:", error);

  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
