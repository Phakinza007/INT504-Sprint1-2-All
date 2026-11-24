const express = require("express");
const { createGetStudentHandler } = require("../controllers/student.controller");

function createStudentRouter(prisma) {
  const router = express.Router();
  router.get("/:studentId", createGetStudentHandler(prisma));
  return router;
}

module.exports = { createStudentRouter };
