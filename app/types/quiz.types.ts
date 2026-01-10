// app/types/quiz.types.ts
export type DefaultQuestionInput = {
  key: string;
  title: string;
  type: string;
  description?: string | null;
  min?: number | null;
  suggestions?: number[] | null;
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
  key: string;
  title: string;
  type: "select" | "budget" | string;
  description?: string | null;
  min?: number | null;
  suggestions?: number[] | null;
  options: QuizOption[];
  sortOrder?: number; // if you decide to add ordering later
}

export interface Quiz {
  id: number;
  shop: string;
  createdAt: Date;
  updatedAt: Date;
  questions: QuizQuestion[];
}