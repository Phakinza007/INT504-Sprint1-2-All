const {
  findSelections,
  createSelection,
  resetSelections,
  removeSelection,
  changeSelection,
} = require("../services/selection.service");

function createGetSelectionsHandler(prisma) {
  return async (request, response, next) => {
    try {
      const selections = await findSelections(prisma, request.params.studentId);
      if (!selections) return response.sendStatus(404);
      response.status(200).json(selections);
    } catch (error) {
      next(error);
    }
  };
}

function createPostSelectionHandler(prisma) {
  return async (request, response, next) => {
    const studentId = request.params.studentId;
    const { courseId, section } = request.body ?? {};

    try {
      const result = await createSelection(prisma, studentId, courseId, section);

      if (!result) return response.sendStatus(404);
      if (result === "ALREADY_SELECTED") return response.sendStatus(409);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

function createResetSelectionsHandler(prisma) {
  return async (request, response, next) => {
    try {
      const reset = await resetSelections(prisma, request.params.studentId);
      if (!reset) return response.sendStatus(404);
      response.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}

function createRemoveSelectionHandler(prisma) {
  return async (request, response, next) => {
    const courseId = Number(request.params.courseId);
    if (!Number.isInteger(courseId) || courseId < 1) return response.sendStatus(404);
    try {
      const removed = await removeSelection(prisma, request.params.studentId, courseId);
      response.sendStatus(removed ? 204 : 404);
    } catch (error) {
      next(error);
    }
  };
}

function createChangeSelectionHandler(prisma) {
  return async (request, response, next) => {
    const courseId = Number(request.params.courseId);
    const section = request.body?.section;
    if (!Number.isInteger(courseId) || courseId < 1 ||
        !Number.isInteger(section) || section < 1 || section > 99) {
      return response.sendStatus(404);
    }
    try {
      const selection = await changeSelection(prisma, request.params.studentId, courseId, section);
      if (!selection) return response.sendStatus(404);
      response.status(200).json(selection);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  createGetSelectionsHandler,
  createPostSelectionHandler,
  createResetSelectionsHandler,
  createRemoveSelectionHandler,
  createChangeSelectionHandler,
};
