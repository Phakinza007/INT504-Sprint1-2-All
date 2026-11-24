const { findSchedules } = require("../services/schedule.service");
const { compareSchedules, toPublicSchedule, countSectionsByCourse, toYearLevelSchedule } = require("../utils/schedule");

function createGetSchedulesHandler(prisma) {
  return async (request, response, next) => {
    const requestedLevel = request.query.yearLevel;
    let yearLevel;

    if (requestedLevel !== undefined) {
      if (
        typeof requestedLevel !== "string" ||
        !["1", "2", "3", "4"].includes(requestedLevel)
      ) {
        return response.status(400).json({ error: "yearLevel must be 1, 2, 3, or 4" });
      }
      yearLevel = Number(requestedLevel);
    }

    try {
      const schedules = await findSchedules(prisma, yearLevel);

      response.status(200).json(
        schedules.sort(compareSchedules).map(toPublicSchedule),
      );
    } catch (error) {
      next(error);
    }
  };
}

function createGetYearLevelSchedulesHandler(prisma) {
  return async (request, response, next) => {
    const yearLevel = Number(request.params.yearLevel);
    const studentGroup = request.query.studentGroup;

    try {
      const schedules = await findSchedules(prisma, yearLevel);
      const sectionsByCourse = countSectionsByCourse(schedules);
      const rows = schedules
        .sort(compareSchedules)
        .map((schedule) => toYearLevelSchedule(schedule, sectionsByCourse));

      if (studentGroup === undefined) {
        return response.status(200).json(rows);
      }

      response.status(200).json(rows.filter((row) =>
        !row.fixed || row.studentGroup === null || row.studentGroup === studentGroup,
      ));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { createGetSchedulesHandler , createGetYearLevelSchedulesHandler};
