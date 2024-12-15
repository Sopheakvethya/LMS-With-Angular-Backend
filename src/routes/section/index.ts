import { Router } from "express";
import { isAuth } from "../../middleware/auth";
import {
  createSectionController,
  deleteSectionController,
  getSectionController,
  updateSectionController,
} from "./section.controller";

const router = Router();

router.post("/", isAuth, createSectionController);
router.get("/", isAuth, getSectionController);
router.put("/", isAuth, updateSectionController);
router.delete("/", isAuth, deleteSectionController);

export default router;
