import { Router } from "express";
import { isAuth } from "../../middleware/auth";
import {
  createSubmissionController,
  deleteSubmissionController,
  getSubmissionsController,
  updateSubmissionController,
} from "./submission.controller";

const router = Router();

router.post("/", isAuth, createSubmissionController);
router.get("/", isAuth, getSubmissionsController);
router.put("/", isAuth, updateSubmissionController);
router.delete("/", isAuth, deleteSubmissionController);

export default router;
