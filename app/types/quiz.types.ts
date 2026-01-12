// app/types/quiz.types.ts
export type DefaultQuestionInput = {
  key: string;
  title: string;
  type: string;
  description?: string | null;
  min?: number | null;
  suggestions?: number[] | null;
  active?: boolean;
  order?: number;
  options: DefaultOptionInput[];
};

export type DefaultOptionInput = {
  value: string;
  label: string;
  image?: string | null;
  description?: string | null;
  icon?: string | null;
  upgrade?: boolean | null;
  karats?: Array<{ value: string; label: string; upgrade?: boolean }> | null;
  extra?: { title: string; content: string } | null;
  highlight?: boolean | null;
  diamondImage?: string | null;
  specs?: Record<string, string> | null;
};

export interface QuizOption {
  id?: number;
  value: string;
  label: string;
  image?: string | null;
  description?: string | null;
  icon?: string | null;
  upgrade?: boolean | null;
  karats?: Array<{ value: string; label: string; upgrade?: boolean }> | null;
  extra?: { title: string; content: string } | null;
  highlight?: boolean | null;
  diamondImage?: string | null;
  specs?: {
    carat?: string;
    color?: string;
    clarity?: string;
    ratio?: string;
    [key: string]: any;
  } | null;
}

export interface QuizQuestion {
  id?: number;
  quizId: number;
  order: number;
  key: string;
  title: string;
  type: "select" | "budget" | string;
  description?: string | null;
  min?: number | null;
  suggestions?: number[] | null;
  active?: boolean;
  options: QuizOption[];
  sortOrder?: number; // if you decide to add ordering later
}

export interface Quiz {
   id: number;
  owner: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  note: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  questions: QuizQuestion[];
}