import mongoose from "mongoose";
import type { CourseDto } from "../types/course/create-course-dto";

export function isTeacher(userId: string, course: CourseDto) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const isTeacher = course.teachers?.some((teacherId) =>
    userObjectId.equals(teacherId)
  );
  return isTeacher;
}

export function isStudent(userId: string, course: CourseDto) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const isStudent = course.students?.some((studentId) =>
    userObjectId.equals(studentId)
  );
  return isStudent;
}
