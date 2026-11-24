const express = require("express");
const {
  createGetSchedulesHandler,
  createGetYearLevelSchedulesHandler,
} = require("../controllers/schedule.controller");

function createScheduleRouter(prisma) {
  const router = express.Router();
  router.get("/", createGetSchedulesHandler(prisma));
  return router;
}

function createGetYearLevelSchedulesRouter(prisma) {
  const router = express.Router();
  router.get("/:yearLevel/schedules", createGetYearLevelSchedulesHandler(prisma));

  return router;
}

module.exports = { createScheduleRouter, createGetYearLevelSchedulesRouter };
