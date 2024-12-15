import type { Request, Response } from "express";
import {
  createSectionService,
  deleteSectionService,
  getSectionByIdService,
  getSectionByTitleService,
  updateSectionService,
} from "./section.service";
import { isStudent, isTeacher } from "../../utils/permissions";
import { getCourseService } from "../course/course.service";
import type { CourseDto } from "../../types/course/create-course-dto";

export async function createSectionController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const sectionTitle = req.query.sectionTitle;

  const course = await getCourseService(courseId as string);
  if (isStudent(userId, course as unknown as CourseDto)) {
    res.status(403).json({ message: "students cannot create sections" });
    return;
  }

  const section = await getSectionByTitleService(
    courseId as string,
    sectionTitle as string
  );

  if (section) {
    res.status(500).json({ message: "section already exists" });
    return;
  }

  await createSectionService(courseId as string, sectionTitle as string);

  res.status(201).json({ message: "section created successfully" });
}

export async function getSectionController(req: Request, res: Response) {
  const courseId = req.query.courseId;
  const sectionId = req.query.sectionId;

  if (!sectionId) {
    res.status(400).json({ message: "missing section id" });
    return;
  }

  const section = await getSectionByIdService(
    courseId as string,
    sectionId as string
  );

  if (!section) {
    res.status(404).json({ message: "section not found" });
    return;
  }

  res.status(200).json({ message: "section retrieved successfully", section });
}

export async function updateSectionController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const sectionId = req.query.sectionId;
  const newSectionTitle = req.query.sectionTitle;

  if (!newSectionTitle) {
    res.status(400).json({ message: "missing section title" });
    return;
  }

  const course = await getCourseService(courseId as string);
  const _isTeacher = isTeacher(userId, course as unknown as CourseDto);

  if (!_isTeacher) {
    res.status(403).json({ message: "only teachers can update sections" });
    return;
  }

  const section = await getSectionByIdService(
    courseId as string,
    sectionId as string
  );

  if (!section) {
    res.status(404).json({ message: "sectionnot found" });
    return;
  }

  const updatedSubmission = await updateSectionService(
    courseId as string,
    sectionId as string,
    newSectionTitle as string
  );

  res
    .status(200)
    .json({ message: "submission updated successfully", updatedSubmission });
}

export async function deleteSectionController(req: Request, res: Response) {
  const userId = req.user._id;

  const courseId = req.query.courseId;
  const sectionId = req.query.sectionId;

  const course = await getCourseService(courseId as string);
  const _isTeacher = isTeacher(userId, course as unknown as CourseDto);

  if (!_isTeacher) {
    res.status(403).json({ message: "only teachers can delete submissions" });
    return;
  }

  const section = await getSectionByIdService(
    courseId as string,
    sectionId as string
  );

  if (!section) {
    res.status(404).json({ message: "submission not found" });
    return;
  }

  await deleteSectionService(courseId as string, sectionId as string);

  res.status(200).json({ message: "submission deleted successfully" });
}
