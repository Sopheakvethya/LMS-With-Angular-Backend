import mongoose from "mongoose";
import type { SubmissionDto } from "../../types/course/submission-dto";
import { CourseSchema } from "../../models/course";

export async function createSectionService(
  courseId: string,
  SectionTitle: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId },
    {
      $push: {
        sections: { title: SectionTitle, materials: [] },
      },
    }
  );

  return;
}

export async function getSectionByIdService(
  courseId: string,
  sectionId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  const course = await Course.findOne({
    _id: courseId,
    sections: {
      $elemMatch: {
        _id: sectionId,
      },
    },
  });

  if (!course) {
    return null;
  }

  const section = course.sections.find((section) =>
    section._id.equals(sectionId)
  );

  return section;
}

export async function getSectionByTitleService(
  courseId: string,
  sectionTitle: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  const course = await Course.findOne({
    _id: courseId,
    sections: {
      $elemMatch: {
        title: sectionTitle,
      },
    },
  });

  if (!course) {
    return null;
  }

  const section = course.sections.find(
    (section) => section.title === sectionTitle
  );

  return section;
}

export async function updateSectionService(
  courseId: string,
  sectionId: string,
  newSectionTitle: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId, "sections._id": sectionId },
    {
      $set: {
        "sections.$.title": newSectionTitle,
      },
    }
  );

  return;
}

export async function deleteSectionService(
  courseId: string,
  sectionId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId, "sections._id": sectionId },
    {
      $pull: {
        sections: { _id: sectionId },
      },
    }
  );

  return;
}
