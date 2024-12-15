interface Submission {
  student: string;
  content: string;
  score: number;
  submittedAt: Date;
}

export interface AssignmentDto {
  type: string;
  title: string;
  description: string;
  maxScore: number;
  dueDate: Date;
  allowedSubmissionNumber: number;
  submissions?: Submission[];
}
