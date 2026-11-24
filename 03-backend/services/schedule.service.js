function findSchedules(prisma, yearLevel) {
  return prisma.courseSchedule.findMany({
    ...(yearLevel === undefined ? {} : { where: { course: { yearLevel } } }),
    include: { course: true },
  });
}

module.exports = { findSchedules };
