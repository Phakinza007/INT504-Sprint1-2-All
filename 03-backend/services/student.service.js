async function findStudentProfile(prisma, studentId) {
  if (!/^\d{11}$/.test(studentId)) return null;

  const settings = await prisma.academicSettings.findUnique({ where: { id: 1 } });
  if (!settings || studentId.slice(2, 8) !== settings.programCode) return null;

  const entryYear = Number(studentId.slice(0, 2));
  const studentNumber = Number(studentId.slice(8));
  const yearLevel = settings.currentAcademicYear % 100 - entryYear + 1;
  if (yearLevel < 1 || yearLevel > 4) return null;

  const range = await prisma.studentGroupRange.findFirst({
    where: {
      entryYear,
      fromNo: { lte: studentNumber },
      toNo: { gte: studentNumber },
    },
  });
  if (!range) return null;

  return { studentId, yearLevel, studentGroup: range.studentGroup };
}

module.exports = { findStudentProfile };
