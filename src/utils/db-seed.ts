import mongoose from "mongoose";
import { CourseSchema } from "../models/course";
import { UserSchema } from "../models/user";

const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);

  await User.deleteMany({});
  await Course.deleteMany({});

  // Create courses
  const courses = await Course.insertMany([
    {
      title: "Mathematics 101",
      description: "Basic Mathematics course covering algebra and geometry.",
      sections: [
        {
          title: "Algebra Basics",
          materials: [
            {
              type: "Lesson",
              title: "Introduction to Algebra",
              content: "Learn the fundamentals of algebra...",
            },
            {
              type: "Assignment",
              title: "Algebra Worksheet",
              content: "Complete the worksheet by next week.",
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // due in one week
              maxScore: 100,
              allowedSubmissionNumber: 1,
              submissions: [],
            },
          ],
        },
        {
          title: "Geometry",
          materials: [
            {
              type: "Lesson",
              title: "Introduction to Geometry",
              content: "Learn the fundamentals of geometry...",
            },
            {
              type: "Assignment",
              title: "Geometry Worksheet",
              content: "Complete the worksheet by next week.",
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // due in two weeks
              maxScore: 100,
              allowedSubmissionNumber: 2,
              submissions: [],
            },
          ],
        },
      ],
      students: [],
      teachers: [],
    },
    {
      title: "History of Art",
      description: "Exploring the history of art and major movements.",
      sections: [
        {
          title: "Renaissance",
          materials: [
            {
              type: "Lesson",
              title: "Renaissance Art",
              content: "Study the art of the Renaissance period...",
            },
            {
              type: "Assignment",
              title: "Renaissance Research Paper",
              content: "Write a research paper on Renaissance art.",
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              maxScore: 100,
              allowedSubmissionNumber: 1,
              submissions: [],
            },
          ],
        },
      ],
      students: [],
      teachers: [],
    },
  ]);

  // Create users and link them to courses
  const users = await User.insertMany([
    {
      username: "Vethya",
      password: "$2b$04$PnqgC4.LZBFf9XhLr2qnced8obqFBrG3iL17vOsxQm35g3s//jrJ6",
      courses: [courses[0]._id, courses[1]._id],
    },
    {
      username: "Jeff Bezos",
      password: "$2b$04$PnqgC4.LZBFf9XhLr2qnced8obqFBrG3iL17vOsxQm35g3s//jrJ6",
      courses: [courses[1]._id],
    },
    {
      username: "Nicholas",
      password: "$2b$04$PnqgC4.LZBFf9XhLr2qnced8obqFBrG3iL17vOsxQm35g3s//jrJ6",
      courses: [courses[0]._id],
    },
    {
      username: "Bratt Pitt",
      password: "$2b$04$PnqgC4.LZBFf9XhLr2qnced8obqFBrG3iL17vOsxQm35g3s//jrJ6",
      courses: [],
    },
    {
      username: "James Bond",
      password: "$2b$04$PnqgC4.LZBFf9XhLr2qnced8obqFBrG3iL17vOsxQm35g3s//jrJ6",
      courses: [],
    },
  ]);

  // Update course students with user references
  await Course.updateOne(
    { _id: courses[0]._id },
    { $set: { students: [users[2]._id], teachers: [users[0]._id] } }
  );

  await Course.updateOne(
    { _id: courses[1]._id },
    { $set: { students: [users[0]._id, users[1]._id] } }
  );

  // Update course with submissions
  await Course.updateOne(
    { _id: courses[0]._id, "sections.materials.type": "Assignment" },
    {
      $push: {
        "sections.$[section].materials.$[material].submissions": {
          student: users[2]._id,
          content: "Completed assignment",
          score: 90,
        },
      },
    },
    {
      arrayFilters: [
        { "section.materials.type": "Assignment" },
        { "material.type": "Assignment" },
      ],
    }
  );

  console.log("Database seeded successfully!");
  mongoose.connection.close();
};

seedDatabase().catch((error) => console.error("Seeding error:", error));
