import mongoose from "mongoose";
import { UserSchema } from "../../models/user";

export async function registerUserService(username: string, password: string) {
  const User = mongoose.model("users", UserSchema);

  const user = new User({
    username,
    password,
  });

  await user.save();
  return user;
}

export async function getUserByIdService(userId: string) {
  const User = mongoose.model("users", UserSchema);

  const user = await User.findById(userId);
  return user;
}

export async function getUserByUsernameService(username: string) {
  const User = mongoose.model("users", UserSchema);

  const user = await User.findOne({ username });
  return user;
}

export async function updateUserService(userId: string, username: string) {
  const User = mongoose.model("users", UserSchema);

  const user = await User.updateOne({ _id: userId }, { username });
  return;
}

export async function getUserCoursesService(userId: string) {
  const User = mongoose.model("users", UserSchema);

  const user = await User.findById(userId);
  return user?.courses;
}
