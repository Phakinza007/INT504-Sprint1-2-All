const { PrismaClient } = require("@prisma/client");
const { courses, schedules } = require("./seed-data.json");

const prisma = new PrismaClient();

function mysqlTime(value) {
  return new Date(`1970-01-01T${value}:00.000Z`);
}

async function main() {
  if (courses.length !== 51 || schedules.length !== 92) {
    throw new Error("Seed data does not match the Sprint 1 row counts");
  }

  await prisma.$transaction(async (tx) => {
    await tx.academicSettings.upsert({
      where: { id: 1 },
      create: { id: 1, currentAcademicYear: 2569, currentSemester: 1, programCode: "504504", programName: "BSc.IT" },
      update: { currentAcademicYear: 2569, currentSemester: 1, programCode: "504504", programName: "BSc.IT" },
    });

    const ranges = [
      [1, 69, "A", 1, 70], [2, 69, "B", 71, 140],
      [3, 68, "A", 1, 67], [4, 68, "B", 68, 135],
      [5, 67, "A", 1, 65], [6, 67, "B", 66, 130],
      [7, 66, "A", 1, 60], [8, 66, "B", 61, 120],
    ];

    for (const [id, entryYear, studentGroup, fromNo, toNo] of ranges) {
      const range = { id, entryYear, studentGroup, fromNo, toNo };
      await tx.studentGroupRange.upsert({ where: { id }, create: range, update: range });
    }

    for (const course of courses) {
      await tx.course.upsert({
        where: { id: course.id },
        create: course,
        update: course,
      });
    }

    for (const schedule of schedules) {
      const data = {
        ...schedule,
        startTime: mysqlTime(schedule.startTime),
        endTime: mysqlTime(schedule.endTime),
      };
      await tx.courseSchedule.upsert({
        where: { id: schedule.id },
        create: data,
        update: data,
      });
    }
  }, { timeout: 30000 });

  console.log(`Seeded ${courses.length} courses and ${schedules.length} schedules`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
