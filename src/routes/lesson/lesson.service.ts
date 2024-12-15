import mongoose from "mongoose";
import { CourseSchema } from "../../models/course";
import type { LessonDto } from "../../types/course/lesson-dto";

export async function createLessonService(
  lesson: LessonDto,
  courseId: string,
  sectionId: string
) {
  lesson.type = "Lesson";

  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId, "sections._id": sectionId },
    { $push: { "sections.$.materials": lesson } }
  );

  return;
}

export async function getLessonService(lessonId: string, courseId: string) {
  const Course = mongoose.model("Course", CourseSchema);

  const course = await Course.findOne({
    _id: courseId,
    sections: {
      $elemMatch: {
        materials: {
          $elemMatch: {
            _id: lessonId,
            type: "Lesson",
          },
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const matchingSection = course.sections.find((section) =>
    section.materials.some(
      (material) =>
        material._id.toString() === lessonId && material.type === "Lesson"
    )
  );

  if (!matchingSection) {
    return null;
  }

  const matchingMaterial = matchingSection.materials.find(
    (material) =>
      material._id.toString() === lessonId && material.type === "Lesson"
  );

  return matchingMaterial;
}

export async function updateLessonService(
  lesson: LessonDto,
  lessonId: string,
  courseId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  lesson.type = "Lesson";

  await Course.updateOne(
    { _id: courseId, "sections.materials._id": lessonId },
    { $set: { "sections.$[section].materials.$[material]": lesson } },
    {
      arrayFilters: [
        { "section.materials._id": lessonId },
        { "material._id": lessonId },
      ],
    }
  );
}

export async function deleteLessonService(lessonId: string, courseId: string) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId },
    { $pull: { "sections.$[].materials": { _id: lessonId } } }
  );
}
