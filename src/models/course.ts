import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: -1,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const MaterialSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["Lesson", "Assignment"],
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  maxScore: {
    type: Number,
  },
  allowedSubmissionNumber: {
    type: Number,
  },
  submissions: [SubmissionSchema],
});

const SectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  materials: [MaterialSchema],
});

export const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sections: [SectionSchema],
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  teachers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});
