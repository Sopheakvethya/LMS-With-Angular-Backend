import { Router } from "express";
import {
  createLessonController,
  deleteLessonController,
  getLessonController,
  updateLessonController,
} from "./lesson.controller";
import { isAuth } from "../../middleware/auth";

const router = Router();

router.post("/", isAuth, createLessonController);
router.get("/", isAuth, getLessonController);
router.put("/", isAuth, updateLessonController);
router.delete("/", isAuth, deleteLessonController);

export default router;
