import mongoose from "mongoose";
import { CourseSchema } from "../../models/course";
import type { AssignmentDto } from "../../types/course/assignment-dto";

export async function createAssignmentService(
  assignment: AssignmentDto,
  courseId: string,
  sectionId: string
) {
  assignment.type = "Assignment";

  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId, "sections._id": sectionId },
    { $push: { "sections.$.materials": assignment } }
  );

  return;
}

export async function getAssignmentService(
  assignmentId: string,
  courseId: string,
  isStudent: boolean
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

  const materialCopy = { ...matchingMaterial?.toObject() };

  if (isStudent) {
    delete materialCopy.submissions;
  }

  return materialCopy;
}

export async function updateAssignmentService(
  assignment: AssignmentDto,
  assignmentId: string,
  courseId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  assignment.type = "Assignment";

  await Course.updateOne(
    { _id: courseId, "sections.materials._id": assignmentId },
    { $set: { "sections.$[section].materials.$[material]": assignment } },
    {
      arrayFilters: [
        { "section.materials._id": assignmentId },
        { "material._id": assignmentId },
      ],
    }
  );
}

export async function deleteAssignmentService(
  assignmentId: string,
  courseId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  await Course.updateOne(
    { _id: courseId },
    { $pull: { "sections.$[].materials": { _id: assignmentId } } }
  );
}

export async function getunbsubmittedAssignmentsService(
  userCourses: mongoose.Types.ObjectId[],
  userId: string
) {
  const Course = mongoose.model("Course", CourseSchema);

  const courses = await Course.find({
    _id: { $in: userCourses },
    sections: {
      $elemMatch: {
        materials: {
          $elemMatch: {
            type: "Assignment",
            submissions: { $not: { $elemMatch: { student: userId } } },
          },
        },
      },
    },
    teachers: { $nin: [userId] },
  });

  const unsubmittedAssignments = courses.map((course) => {
    const unsubmittedAssignments = course.sections
      .map((section) => {
        return section.materials.filter(
          (material) =>
            material.type === "Assignment" &&
            !material.submissions.some(
              (submission) => submission.student.toString() === userId
            )
        );
      })
      .flat();

    return unsubmittedAssignments;
  });

  return unsubmittedAssignments.flat();
}
