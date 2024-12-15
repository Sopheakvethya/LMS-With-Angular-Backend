import type { Request, Response } from "express";
import {
  createLessonService,
  deleteLessonService,
  getLessonService,
  updateLessonService,
} from "./lesson.service";
import type { LessonDto } from "../../types/course/lesson-dto";
import { getCourseService } from "../course/course.service";
import { isTeacher } from "../../utils/permissions";
import type { CourseDto } from "../../types/course/create-course-dto";

export async function createLessonController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const sectionId = req.query.sectionId;
  const lesson = req.body as LessonDto;

  if (!courseId) {
    res.status(400).json({ message: "course ID is required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "course not found" });
    return;
  }

  if (!isTeacher(userId, course as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  if (!sectionId) {
    res.status(400).json({ message: "section ID is required" });
    return;
  }

  if (!lesson) {
    res.status(400).json({ message: "lesson is required" });
    return;
  }

  await createLessonService(lesson, courseId as string, sectionId as string);

  res.status(201).json({ message: "lesson created successfully" });
}

export async function getLessonController(req: Request, res: Response) {
  const userId = req.user._id;

  const lessonId = req.query.lessonId;
  const courseId = req.query.courseId;

  if (!lessonId) {
    res.status(400).json({ message: "lesson ID is required" });
    return;
  }

  if (!courseId) {
    res.status(400).json({ message: "course ID is required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "course not found" });
    return;
  }

  if (!isTeacher(userId, course as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const lesson = await getLessonService(lessonId as string, courseId as string);

  if (!lesson) {
    res.status(404).json({ message: "lesson not found" });
    return;
  }

  res.status(200).json({ message: "lesson fetched successfully", lesson });
}

export async function updateLessonController(req: Request, res: Response) {
  const userId = req.user._id;

  const lessonId = req.query.lessonId;
  const courseId = req.query.courseId;

  const lesson = req.body as LessonDto;

  if (!lessonId) {
    res.status(400).json({ message: "lesson ID is required" });
    return;
  }

  if (!courseId) {
    res.status(400).json({ message: "course ID is required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "course not found" });
    return;
  }

  if (!isTeacher(userId, course as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await updateLessonService(lesson, lessonId as string, courseId as string);

  res.status(200).json({ message: "lesson updated successfully" });
}

export async function deleteLessonController(req: Request, res: Response) {
  const userId = req.user._id;

  const lessonId = req.query.lessonId;
  const courseId = req.query.courseId;

  if (!lessonId) {
    res.status(400).json({ message: "lesson ID is required" });
    return;
  }

  if (!courseId) {
    res.status(400).json({ message: "course ID is required" });
    return;
  }

  const course = await getCourseService(courseId as string);

  if (!course) {
    res.status(404).json({ message: "course not found" });
    return;
  }

  if (!isTeacher(userId, course as unknown as CourseDto)) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const lesson = await getLessonService(lessonId as string, courseId as string);

  if (!lesson) {
    res.status(404).json({ message: "lesson not found" });
    return;
  }

  await deleteLessonService(lessonId as string, courseId as string);

  res.status(200).json({ message: "lesson deleted successfully" });
}
