import type { Request, Response } from "express";
import type { RegisterUserDto } from "../../types/user/register-user-dto";
import {
  getUserByIdService,
  getUserByUsernameService,
  getUserCoursesService,
  registerUserService,
  updateUserService,
} from "./user.service";
import jwtGenerate from "../../utils/jwt-generate";
import type { UpdateUserDto } from "../../types/user/update-user-dto";

export async function getUserController(req: Request, res: Response) {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  const user = await getUserByIdService(userId as string);

  res.status(200).json({ message: "User fetched successfully", user: user });
}

// export async function updateUserController(req: Request, res: Response) {
//   const { username } = req.body as UpdateUserDto;

//   const user = await getUserByUsernameService(username);

//   if (!user) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }

//   const updatedUser = await updateUserService(username);

//   res
//     .status(200)
//     .json({ message: "User updated successfully", user: updatedUser });
// }

// export async function deleteUserController(req: Request, res: Response) {
//   const userId = req.user._id;

//   await getUserByIdService(userId);

//   res.status(200).json({ message: "User deleted successfully" });
// }

export async function registerUserController(req: Request, res: Response) {
  const { username, password } = req.body as RegisterUserDto;

  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 4,
  });

  const user = await registerUserService(username, hashedPassword);
  res.status(200).json({ message: "User registered successfully", user });
}

export async function loginUserController(req: Request, res: Response) {
  const { username, password } = req.body as RegisterUserDto;

  const user = await getUserByUsernameService(username);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await Bun.password.verify(password, user.password, "bcrypt");

  if (!isMatch) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  const payload = {
    _id: user._id.toString(),
    username: user.username,
  };

  const { accessToken, refreshToken } = await jwtGenerate.signTokens(payload);
  res.status(200).json({
    message: "User logged in successfully",
    accessToken,
    refreshToken,
  });
}

export async function getUserCoursesController(req: Request, res: Response) {
  const userId = req.user._id;
  const courses = await getUserCoursesService(userId);

  res
    .status(200)
    .json({ message: "Fetched user courses successfully", courses });
}
