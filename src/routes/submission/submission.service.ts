import mongoose from "mongoose";
import type { SubmissionDto } from "../../types/course/submission-dto";
import { CourseSchema } from "../../models/course";

export async function createSubmissionService(
  userId: string,
  assignmentId: string,
  courseId: string,
  submission: SubmissionDto
) {
  submission.student = userId;

  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId, "sections.materials._id": assignmentId },
    {
      $push: {
        "sections.$[section].materials.$[material].submissions": submission,
      },
    },
    {
      arrayFilters: [
        { "section.materials._id": assignmentId },
        { "material._id": assignmentId },
      ],
    }
  );

  return;
}

export async function getSubmissionService(
  userId: string,
  courseId: string,
  assignmentId: string,
  isTeacher: boolean
) {
  const Course = mongoose.model("Course", CourseSchema);

  const course = await Course.findOne({
    _id: courseId,
    sections: {
      $elemMatch: {
        materials: {
          $elemMatch: {
            _id: assignmentId,
            type: "Assignment",
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
        material._id.toString() === assignmentId &&
        material.type === "Assignment"
    )
  );

  if (!matchingSection) {
    return null;
  }

  const matchingMaterial = matchingSection.materials.find(
    (material) =>
      material._id.toString() === assignmentId && material.type === "Assignment"
  );

  if (!matchingMaterial) {
    return null;
  }

  if (isTeacher) {
    return matchingMaterial.submissions;
  }

  const submissions = matchingMaterial.submissions.filter((submission) =>
    submission.student.equals(new mongoose.Types.ObjectId(userId))
  );

  return submissions;
}

export async function updateSubmissionService(
  courseId: string,
  submissionId: string,
  submission: SubmissionDto
) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId, "sections.materials.submissions._id": submissionId },
    {
      $set: {
        "sections.$[section].materials.$[material].submissions.$[submission].score":
          submission.score,
      },
    },
    {
      arrayFilters: [
        { "section.materials.submissions._id": submissionId },
        { "material.submissions._id": submissionId },
        { "submission._id": submissionId },
      ],
    }
  );

  return;
}

export async function deleteSubmissionService(
  assignmentId: string,
  submissionId: string,
  courseId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId },
    {
      $pull: {
        "sections.$[section].materials.$[material].submissions": {
          _id: submissionId,
        },
      },
    },
    {
      arrayFilters: [
        { "section.materials._id": assignmentId },
        { "material._id": assignmentId },
      ],
    }
  );

  return;
}
