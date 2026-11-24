const express = require("express");
const {
  createGetSelectionsHandler,
  createPostSelectionHandler,
  createResetSelectionsHandler,
  createRemoveSelectionHandler,
  createChangeSelectionHandler,
} = require("../controllers/selection.controller");

function createSelectionRouter(prisma) {
  const router = express.Router();
  router.get("/:studentId/selections", createGetSelectionsHandler(prisma));
  router.post("/:studentId/selections", createPostSelectionHandler(prisma));
  router.delete("/:studentId/selections", createResetSelectionsHandler(prisma));
  router.delete("/:studentId/selections/:courseId", createRemoveSelectionHandler(prisma));
  router.put("/:studentId/selections/:courseId", createChangeSelectionHandler(prisma));
  return router;
}

module.exports = { createSelectionRouter };
