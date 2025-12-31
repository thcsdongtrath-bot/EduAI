
export enum Grade {
  GRADE_6 = '6',
  GRADE_7 = '7',
  GRADE_8 = '8',
  GRADE_9 = '9'
}

export enum TestType {
  MIN_15 = '15 Phút',
  MIN_45 = '1 Tiết (45 Phút)',
  MID_TERM = 'Giữa Kỳ',
  FINAL_TERM = 'Cuối Kỳ'
}

export interface Question {
  id: string;
  type: string;
  instruction: string;
  content: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface TestData {
  title: string;
  grade: Grade;
  unit: string;
  duration: number;
  questions: Question[];
}

export interface StudentResult {
  id: string;
  studentName: string;
  studentClass: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  answers: Record<string, string>;
}

export enum View {
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  CREATE_TEST = 'CREATE_TEST',
  STUDENT_PORTAL = 'STUDENT_PORTAL',
  ANALYTICS = 'ANALYTICS'
}

export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  NONE = 'NONE'
}
