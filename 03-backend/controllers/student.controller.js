const { findStudentProfile } = require("../services/student.service");

function createGetStudentHandler(prisma) {
  return async (request, response, next) => {
    try {
      const profile = await findStudentProfile(prisma, request.params.studentId);
      if (!profile) return response.sendStatus(404);
      response.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { createGetStudentHandler };
