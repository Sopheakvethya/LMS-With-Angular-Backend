import { Router } from "express";
import { isAuth } from "../../middleware/auth";
import {
  createAssignmentController,
  deleteAssignmentController,
  getAssignmentController,
  getUnsubmittedAssignmentController,
  updateAssignmentController,
} from "./assignment.controller";

const router = Router();

router.post("/", isAuth, createAssignmentController);
router.get("/", isAuth, getAssignmentController);
router.put("/", isAuth, updateAssignmentController);
router.delete("/", isAuth, deleteAssignmentController);

router.get("/unsubmitted", isAuth, getUnsubmittedAssignmentController);

export default router;
