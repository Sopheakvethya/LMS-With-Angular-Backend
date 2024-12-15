import type { Request, Response } from "express";
import { getUserCoursesService } from "../user/user.service";
import mongoose from "mongoose";
import {
  createAssignmentService,
  deleteAssignmentService,
  getAssignmentService,
  getunbsubmittedAssignmentsService,
  updateAssignmentService,
} from "./assignment.service";
import type { AssignmentDto } from "../../types/course/assignment-dto";
import { getCourseService } from "../course/course.service";
import type { CourseDto } from "../../types/course/create-course-dto";
import { isStudent, isTeacher } from "../../utils/permissions";

export async function createAssignmentController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const sectionId = req.query.sectionId;
  const assignment = req.body as AssignmentDto;

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

  if (!assignment) {
    res.status(400).json({ message: "assignment is required" });
    return;
  }

  await createAssignmentService(
    assignment,
    courseId as string,
    sectionId as string
  );

  res.status(201).json({ message: "assignment created successfully" });
}

export async function getAssignmentController(req: Request, res: Response) {
  const courseId = req.query.courseId;
  const assignmentId = req.query.assignmentId;
  const userId = req.user._id;

  if (!assignmentId) {
    res.status(400).json({ message: "Assignment ID is required" });
    return;
  }

  const userCourses = await getUserCoursesService(userId);

  if (!userCourses!.includes(new mongoose.Types.ObjectId(courseId as string))) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const course = await getCourseService(courseId as string);
  const _isStudent = isStudent(userId, course as unknown as CourseDto) ?? false;

  const assignment = await getAssignmentService(
    assignmentId as string,
    courseId as string,
    _isStudent
  );
  if (!assignment) {
    res.status(404).json({ message: "assignment not found" });
    return;
  }

  res
    .status(200)
    .json({ message: "Assignment fetched successfully", assignment });
}

export async function updateAssignmentController(req: Request, res: Response) {
  const userId = req.user._id;

  const assignmentId = req.query.assignmentId;
  const courseId = req.query.courseId;

  const assignment = req.body as AssignmentDto;

  if (!assignmentId) {
    res.status(400).json({ message: "assignment ID is required" });
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

  await updateAssignmentService(
    assignment,
    assignmentId as string,
    courseId as string
  );

  res.status(200).json({ message: "assignment updated successfully" });
}

export async function deleteAssignmentController(req: Request, res: Response) {
  const userId = req.user._id;

  const assignmentId = req.query.assignmentId;
  const courseId = req.query.courseId;

  if (!assignmentId) {
    res.status(400).json({ message: "assignment ID is required" });
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

  const assignment = await getAssignmentService(
    assignmentId as string,
    courseId as string,
    false
  );

  if (!assignment) {
    res.status(404).json({ message: "assignment not found" });
    return;
  }

  await deleteAssignmentService(assignmentId as string, courseId as string);

  res.status(200).json({ message: "assignment deleted successfully" });
}

export async function getUnsubmittedAssignmentController(
  req: Request,
  res: Response
) {
  const userId = req.user._id;

  const userCourses = await getUserCoursesService(userId);

  if (!userCourses) {
    res.status(404).json({ message: "no courses found" });
    return;
  }

  const unbsubmittedAssignments = await getunbsubmittedAssignmentsService(
    userCourses,
    userId
  );

  if (!unbsubmittedAssignments) {
    res.status(404).json({ message: "Cannot fetch unsubmitted assignments" });
    return;
  }

  res.status(200).json({
    message: "unsubassignment fetched successfully",
    unbsubmittedAssignments,
  });
}
