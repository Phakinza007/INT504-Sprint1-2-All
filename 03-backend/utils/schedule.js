const DAY_ORDER = new Map([
  ["MONDAY", 1],
  ["TUESDAY", 2],
  ["WEDNESDAY", 3],
  ["THURSDAY", 4],
  ["FRIDAY", 5],
  ["SATURDAY", 6],
  ["SUNDAY", 7],
]);

function compareValues(left, right) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left).localeCompare(String(right), "en", { numeric: true });
}

function normalizeTime(value) {
  if (value instanceof Date) {
    return `${String(value.getUTCHours()).padStart(2, "0")}:${String(
      value.getUTCMinutes(),
    ).padStart(2, "0")}`;
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/);
    if (match) {
      return `${match[1].padStart(2, "0")}:${match[2]}`;
    }
  }

  throw new TypeError("Schedule time must be a Date or an HH:MM string");
}

function compareSchedules(left, right) {
  return (
    compareValues(left.course?.yearLevel, right.course?.yearLevel) ||
    compareValues(left.course?.id, right.course?.id) ||
    compareValues(left.section, right.section) ||
    compareValues(
      DAY_ORDER.get(String(left.dayOfWeek).toUpperCase()) ?? 99,
      DAY_ORDER.get(String(right.dayOfWeek).toUpperCase()) ?? 99,
    ) ||
    compareValues(normalizeTime(left.startTime), normalizeTime(right.startTime)) ||
    compareValues(left.id, right.id)
  );
}

function toPublicSchedule(schedule) {
  return {
    id: schedule.id,
    course: {
      id: schedule.course.id,
      code: schedule.course.code,
      title: schedule.course.title,
      type: schedule.course.type,
      yearLevel: schedule.course.yearLevel,
    },
    section: schedule.section,
    startWeek: schedule.startWeek,
    endWeek: schedule.endWeek,
    dayOfWeek: String(schedule.dayOfWeek).toUpperCase(),
    startTime: normalizeTime(schedule.startTime),
    endTime: normalizeTime(schedule.endTime),
    studentGroup: schedule.studentGroup ?? null,
    remarks: schedule.remarks ?? null,
  };
}

function countSectionsByCourse(schedules) {
  const sectionsByCourse = new Map();

  for (const schedule of schedules) {
    const courseId = schedule.course.id;
    if (!sectionsByCourse.has(courseId)) {
      sectionsByCourse.set(courseId, new Set());
    }
    sectionsByCourse.get(courseId).add(schedule.section);
  }

  return sectionsByCourse;
}

function isFixed(schedule, sectionsByCourse) {
  if (schedule.course.type !== "CORE") return false;
  if (schedule.studentGroup !== null) return true;
  return sectionsByCourse.get(schedule.course.id).size === 1;
}

function toYearLevelSchedule(schedule, sectionsByCourse) {
  return {
    ...toPublicSchedule(schedule),
    room: schedule.room ?? null,
    fixed: isFixed(schedule, sectionsByCourse),
  };
}

module.exports = {
  compareSchedules,
  normalizeTime,
  toPublicSchedule,
  countSectionsByCourse,
  toYearLevelSchedule,
};
