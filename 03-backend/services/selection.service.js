const { countSectionsByCourse, toYearLevelSchedule } = require("../utils/schedule");
const { findSchedules } = require("./schedule.service");
const { findStudentProfile } = require("./student.service");

async function findSelections(prisma, studentId) {
  const profile = await findStudentProfile(prisma, studentId);
  if (!profile) return null;

  return prisma.selection.findMany({
    where: { studentId },
    orderBy: { courseId: "asc" },
  });
}

async function createSelection(prisma, studentId, courseId, section) {
  const profile = await findStudentProfile(prisma, studentId);
  if (!profile) return null;

  const schedules = await findSchedules(prisma, profile.yearLevel);
  const sectionsByCourse = countSectionsByCourse(schedules);
  const selectedSchedule = schedules.find((schedule) => {
    return schedule.course.id === courseId && schedule.section === section;
  });

  if (!selectedSchedule) return null;
  const row = toYearLevelSchedule(selectedSchedule, sectionsByCourse);
  if (row.fixed) return null;

  try {
    return await prisma.selection.create({
      data: { studentId, courseId, section },
    });
  } catch (error) {
    if (error.code === "P2002") return "ALREADY_SELECTED";
    throw error;
  }
}

async function resetSelections(prisma, studentId) {
  const profile = await findStudentProfile(prisma, studentId);
  if (!profile) return false;

  await prisma.selection.deleteMany({ where: { studentId } });
  return true;
}

async function removeSelection(prisma, studentId, courseId) {
  const result = await prisma.selection.deleteMany({ where: { studentId, courseId } });
  return result.count > 0;
}

async function changeSelection(prisma, studentId, courseId, section) {
  const where = { studentId_courseId: { studentId, courseId } };
  const current = await prisma.selection.findUnique({ where });
  if (!current) return null;
  if (current.section === section) return current;

  const schedule = await prisma.courseSchedule.findFirst({
    where: { courseId, section },
    select: { id: true },
  });
  if (!schedule) return null;

  try {
    return await prisma.selection.update({ where, data: { section } });
  } catch (error) {
    if (error.code === "P2025") return null;
    throw error;
  }
}

module.exports = {
  findSelections, createSelection, resetSelections, removeSelection, changeSelection,
};
