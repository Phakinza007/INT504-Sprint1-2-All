const express = require("express");
const path = require("node:path");
const { createScheduleRouter, createGetYearLevelSchedulesRouter } = require("./routes/schedule.routes");
const { createStudentRouter } = require("./routes/student.routes");
const { createSelectionRouter } = require("./routes/selection.routes");
const { compareSchedules, normalizeTime, toPublicSchedule } = require("./utils/schedule");

function createApp({ prisma, teamCode = process.env.TEAM_CODE, logger = console }) {
  if (!prisma?.courseSchedule?.findMany) {
    throw new TypeError("A Prisma client with courseSchedule.findMany is required");
  }
  if (typeof teamCode !== "string" || teamCode.trim() === "") {
    throw new TypeError("TEAM_CODE must be set to the agreed team code");
  }

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());

  app.get("/api/v1/health", (_request, response) => {
    response.status(200).json({ status: "ok", team: teamCode });
  });

  app.use("/api/v1/schedules", createScheduleRouter(prisma));
  app.use("/api/v1/year-levels", createGetYearLevelSchedulesRouter(prisma));
  app.use("/api/v1/students", createStudentRouter(prisma));
  app.use("/api/v1/students", createSelectionRouter(prisma));

  // Serve the frontend on the API's origin for local development.
  app.use(express.static(path.join(__dirname, "../frontend")));

  app.use((error, _request, response, _next) => {
    // Keep internal database details out of the public API response.
    logger.error("Backend request failed:", error);
    response.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

module.exports = {
  createApp,
  compareSchedules,
  normalizeTime,
  toPublicSchedule,
};
