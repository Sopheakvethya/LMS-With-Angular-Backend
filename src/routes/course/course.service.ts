import mongoose from "mongoose";
import { CourseSchema } from "../../models/course";
import { UserSchema } from "../../models/user";
import type { CourseDto } from "../../types/course/create-course-dto";
import type { UpdateCourseDto } from "../../types/course/update-course-dto";

export async function createCourseService(course: CourseDto, userId: string) {
  const Course = mongoose.model("courses", CourseSchema);
  const User = mongoose.model("users", UserSchema);

  const newCourse = await Course.create(course);
  await User.updateOne({ _id: userId }, { $push: { courses: newCourse._id } });

  return newCourse;
}

export async function getCourseService(courseId: string) {
  const Course = mongoose.model("courses", CourseSchema);

  const course = await Course.findOne({ _id: courseId });

  return course;
}

export async function updateCourseService(
  courseId: string,
  course: UpdateCourseDto
) {
  const Course = mongoose.model("courses", CourseSchema);

  const newCourse = await Course.updateOne({ _id: courseId }, course);

  return newCourse;
}

export async function deleteCourseService(courseId: string) {
  const Course = mongoose.model("courses", CourseSchema);
  const User = mongoose.model("users", UserSchema);

  await Course.deleteOne({ _id: courseId });
  await User.updateMany({}, { $pull: { courses: courseId } });
}

export async function joinCourseService(courseId: string, userId: string) {
  const Course = mongoose.model("courses", CourseSchema);
  const User = mongoose.model("users", UserSchema);

  await Course.findOneAndUpdate(
    { _id: courseId },
    { $push: { students: userId } }
  );
  await User.findOneAndUpdate(
    { _id: userId },
    { $push: { courses: courseId } }
  );

  return;
}

export async function leaveCourseService(courseId: string, userId: string) {
  const Course = mongoose.model("courses", CourseSchema);
  const User = mongoose.model("users", UserSchema);

  await Course.findOneAndUpdate(
    { _id: courseId },
    { $pull: { students: userId } }
  );
  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { courses: courseId } }
  );

  return;
}

export async function promoteStudentService(
  courseId: string,
  studentId: string
) {
  const Course = mongoose.model("courses", CourseSchema);

  await Course.updateOne(
    { _id: courseId },
    { $pull: { students: studentId }, $push: { teachers: studentId } }
  );

  return;
}

export async function demoteStudentService(
  courseId: string,
  studentId: string
) {
  const Course = mongoose.model("courses", CourseSchema);

  await Course.updateOne(
    { _id: courseId },
    { $pull: { teachers: studentId }, $push: { students: studentId } }
  );

  return;
}
