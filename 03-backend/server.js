const { PrismaClient } = require("@prisma/client");
const { createApp } = require("./app");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set before starting the backend");
}

const prisma = new PrismaClient();
const app = createApp({ prisma });
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
