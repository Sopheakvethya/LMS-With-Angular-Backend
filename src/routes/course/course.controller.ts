import type { Request, Response } from "express";
import {
  createCourseService,
  deleteCourseService,
  demoteStudentService,
  getCourseService,
  joinCourseService,
  leaveCourseService,
  promoteStudentService,
  updateCourseService,
} from "./course.service";
import { getUserCoursesService } from "../user/user.service";
import mongoose from "mongoose";
import type { CourseDto } from "../../types/course/create-course-dto";
import { isStudent, isTeacher } from "../../utils/permissions";
import type { UpdateCourseDto } from "../../types/course/update-course-dto";

export async function createCourseController(req: Request, res: Response) {
  const userId = req.user._id;
  const course = req.body as CourseDto;

  if (!course) {
    res.status(400).json({ message: "Course required" });
    return;
  }

  const newCourse = await createCourseService(course, userId);

  res.status(201).json({ message: "Course created successfully", newCourse });
}

export async function getCourseController(req: Request, res: Response) {
  const userId = req.user._id;
  const courseId = req.query.courseId;

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  if (
    !isTeacher(userId, course as unknown as CourseDto) &&
    !isStudent(userId, course as unknown as CourseDto)
  ) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json({ message: "Course fetched successfully", course });
}

export async function updateCourseController(req: Request, res: Response) {
  const userId = req.user._id;
  const courseId = req.query.courseId;
  const course = req.body as UpdateCourseDto;

  if (!course) {
    res.status(400).json({ message: "Course required" });
    return;
  }

  const existingCourse = await getCourseService(courseId as string);

  if (!existingCourse) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  if (!isTeacher(userId as string, existingCourse as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const updatedCourse = await updateCourseService(courseId as string, course);

  res
    .status(200)
    .json({ message: "Course updated successfully", updatedCourse });
}

export async function deleteCourseController(req: Request, res: Response) {
  const userId = req.user._id;
  const courseId = req.query.courseId;

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  const existingCourse = await getCourseService(courseId as string);

  if (!existingCourse) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  if (!isTeacher(userId as string, existingCourse as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await deleteCourseService(courseId as string);

  res.status(200).json({ message: "Course deleted successfully" });
}

export async function joinCourseController(req: Request, res: Response) {
  const courseId = req.query.courseId;
  const userId = req.user._id;

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  const userCourses = await getUserCoursesService(userId);
  if (userCourses!.includes(new mongoose.Types.ObjectId(courseId as string))) {
    res.status(409).json({ message: "Course already joined" });
    return;
  }

  await joinCourseService(courseId as string, userId);
  res.status(200).json({ message: "Course joined successfully" });
}

export async function leaveCourseController(req: Request, res: Response) {
  const courseId = req.query.courseId;
  const userId = req.user._id;

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  const userCourses = await getUserCoursesService(userId);
  if (!userCourses!.includes(new mongoose.Types.ObjectId(courseId as string))) {
    res.status(409).json({ message: "Course not joined" });
    return;
  }

  await leaveCourseService(courseId as string, userId);
  res.status(200).json({ message: "Left course successfully" });
}

export async function promoteStudentController(req: Request, res: Response) {
  const courseId = req.query.courseId;
  const studentId = req.query.studentId;
  const userId = req.user._id;

  if (!courseId || !studentId) {
    res.status(400).json({ message: "Course ID and Student ID are required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  if (!isTeacher(userId as string, course as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  if (!isStudent(userId as string, course as unknown as CourseDto)) {
    res.status(409).json({ message: "Student not found in course" });
    return;
  }

  await promoteStudentService(courseId as string, studentId as string);

  res.status(200).json({ message: "Student promoted successfully" });
}

export async function demoteStudentController(req: Request, res: Response) {
  const courseId = req.query.courseId;
  const studentId = req.query.studentId;
  const userId = req.user._id;

  if (!courseId || !studentId) {
    res.status(400).json({ message: "Course ID and Student ID are required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  if (!isTeacher(userId as string, course as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  if (!isTeacher(userId as string, course as unknown as CourseDto)) {
    res.status(409).json({ message: "Teacher not found in course" });
    return;
  }

  await demoteStudentService(courseId as string, studentId as string);

  res.status(200).json({ message: "Student demoted successfully" });
}
