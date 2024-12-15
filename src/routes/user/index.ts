import { Router } from "express";
import {
  getUserController,
  getUserCoursesController,
  loginUserController,
  registerUserController,
} from "./user.controller";
import { isAuth } from "../../middleware/auth";

const router = Router();

router.get("/", isAuth, getUserController);
// router.put("/", isAuth, updateUserController);
// router.delete("/", isAuth, deleteUserController);

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/courses", isAuth, getUserCoursesController);

export default router;
