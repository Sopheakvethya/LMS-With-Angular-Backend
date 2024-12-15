import type mongoose from "mongoose";

interface Lesson {
  type: string;
  title: string;
  content: string;
}

interface Submission {
  student: string;
  content: string;
  score: number;
  submittedAt: Date;
}

interface Assignment {
  title: string;
  content: string;
  maxScore: number;
  dueDate: Date;
  allowedSubmissionNumber: number;
  submissions: Submission[];
}

export interface CourseDto {
  title: string;
  description: string;
  sections?: {
    title: string;
    materials: Lesson[] & Assignment[];
  }[];
  teachers: mongoose.Types.ObjectId[];
  students?: mongoose.Types.ObjectId[];
}
