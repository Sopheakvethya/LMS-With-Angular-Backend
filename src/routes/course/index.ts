import { Router } from "express";
import {
  createCourseController,
  deleteCourseController,
  demoteStudentController,
  getCourseController,
  joinCourseController,
  leaveCourseController,
  promoteStudentController,
  updateCourseController,
} from "./course.controller";
import { isAuth } from "../../middleware/auth";

const router = Router();

router.post("/", isAuth, createCourseController);
router.get("/", isAuth, getCourseController);
router.put("/", isAuth, updateCourseController);
router.delete("/", isAuth, deleteCourseController);

router.put("/join", isAuth, joinCourseController);
router.put("/leave", isAuth, leaveCourseController);
router.put("/promote", isAuth, promoteStudentController);
router.put("/demote", isAuth, demoteStudentController);

export default router;
