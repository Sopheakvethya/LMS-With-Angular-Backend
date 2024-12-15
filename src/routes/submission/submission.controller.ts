import type { Request, Response } from "express";
import type { SubmissionDto } from "../../types/course/submission-dto";
import {
  createSubmissionService,
  deleteSubmissionService,
  getSubmissionService,
  updateSubmissionService,
} from "./submission.service";
import { isStudent, isTeacher } from "../../utils/permissions";
import { getCourseService } from "../course/course.service";
import type { CourseDto } from "../../types/course/create-course-dto";
import { getAssignmentService } from "../assignment/assignment.service";

export async function createSubmissionController(req: Request, res: Response) {
  const userId = req.user._id;

  const assignmentId = req.query.assignmentId;
  const courseId = req.query.courseId;
  const submission = req.body as SubmissionDto;

  const course = await getCourseService(courseId as string);
  if (isTeacher(userId, course as unknown as CourseDto)) {
    res.status(403).json({ message: "teachers cannot submit" });
    return;
  }

  const now = new Date();
  const assignment = await getAssignmentService(
    assignmentId as string,
    courseId as string,
    true
  );

  if (!assignment) {
    res.status(404).json({ message: "assignment not found" });
    return;
  }

  if (assignment.dueDate! < now) {
    res.status(400).json({ message: "assignment deadline has passed" });
    return;
  }

  const submissions = await getSubmissionService(
    userId,
    courseId as string,
    assignmentId as string,
    false
  );

  if (!submissions) {
    res.status(500).json({ message: "couldn't get submissions" });
    return;
  }

  if (submissions.length >= assignment.allowedSubmissionNumber!) {
    res.status(400).json({ message: "max submissions reached" });
    return;
  }

  await createSubmissionService(
    userId,
    assignmentId as string,
    courseId as string,
    submission
  );

  res.status(201).json({ message: "submission created successfully" });
}

export async function getSubmissionsController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const assignmentId = req.query.assignmentId;

  const course = await getCourseService(courseId as string);
  const _isTeacher = isTeacher(userId, course as unknown as CourseDto);

  const submissions = await getSubmissionService(
    userId,
    courseId as string,
    assignmentId as string,
    _isTeacher
  );

  res
    .status(200)
    .json({ message: "submissions retrieved successfully", submissions });
}

export async function updateSubmissionController(req: Request, res: Response) {
  const userId = req.user._id;

  const assignmentId = req.query.assignmentId;
  const submissionId = req.query.submissionId;
  const courseId = req.query.courseId;

  const newSubmission = req.body as SubmissionDto;

  if (!newSubmission) {
    res.status(400).json({ message: "missing submission data" });
    return;
  }

  const course = await getCourseService(courseId as string);
  const _isTeacher = isTeacher(userId, course as unknown as CourseDto);

  if (!_isTeacher) {
    res.status(403).json({ message: "only teachers can update submissions" });
    return;
  }

  const assignment = await getAssignmentService(
    assignmentId as string,
    courseId as string,
    true
  );

  if (!assignment) {
    res.status(404).json({ message: "assignment not found" });
    return;
  }

  if (newSubmission.score! > assignment.maxScore!) {
    res.status(400).json({ message: "score exceeds max score" });
    return;
  }

  const submission = await getSubmissionService(
    userId,
    courseId as string,
    assignmentId as string,
    _isTeacher
  );

  if (!submission) {
    res.status(404).json({ message: "submission not found" });
    return;
  }

  const updatedSubmission = await updateSubmissionService(
    courseId as string,
    submissionId as string,
    newSubmission
  );

  res
    .status(200)
    .json({ message: "submission updated successfully", updatedSubmission });
}

export async function deleteSubmissionController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const assignmentId = req.query.assignmentId;
  const submissionId = req.query.submissionId;

  const course = await getCourseService(courseId as string);
  const _isTeacher = isTeacher(userId, course as unknown as CourseDto);

  if (!_isTeacher) {
    res.status(403).json({ message: "only teachers can delete submissions" });
    return;
  }

  const submission = await getSubmissionService(
    userId,
    courseId as string,
    assignmentId as string,
    _isTeacher
  );

  if (!submission) {
    res.status(404).json({ message: "submission not found" });
    return;
  }

  await deleteSubmissionService(
    assignmentId as string,
    submissionId as string,
    courseId as string
  );

  res.status(200).json({ message: "submission deleted successfully" });
}
