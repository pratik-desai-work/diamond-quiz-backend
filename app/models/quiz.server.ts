// app/models/quiz.server.ts

import prisma from "../db.server";
import { defaultQuestions } from "../utils/default-quiz";
import type { DefaultOptionInput } from "app/types/quiz.types";
import { Prisma, type Quiz, type Question, type Option } from "@prisma/client";
import shopify  from "app/shopify.server";
import {
  STAGED_UPLOADS_CREATE,
  FILE_CREATE,
} from "app/utils/graphql/graphql-queries";

/**
 * Quiz with questions and options
 */
export type QuizWithQuestions = Quiz & {
  questions: (Question & {
    options: Option[];
  })[];
};

/**
 * Get the single quiz or create it with default data
 */
export async function getOrCreateQuiz(): Promise<QuizWithQuestions> {
  let quiz = await prisma.quiz.findFirst({
    include: {
      questions: {
        include: { options: true },
        orderBy: { order: "asc" }, // ✅ IMPORTANT
      },
    },
  });

  if (!quiz) {
    quiz = await createDefaultQuiz();
  }

  return quiz;
}

/**
 * Create default quiz with metadata + default questions
 */
export async function createDefaultQuiz(): Promise<QuizWithQuestions> {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Create quiz
    const quiz = await tx.quiz.create({
      data: {
        owner: "Axe",
        title: "Diamond",
        subtitle: "QUIZ",
        description:
          "Answer a few simple questions and we’ll help you discover the diamond that fits you best.",
        ctaText: "Let’s start",
        note: "Takes less than 2 minutes",
        image:
          "https://images.pexels.com/photos/30852236/pexels-photo-30852236.jpeg",
      },
    });

    // 2️⃣ Create default questions
    for (let index = 0; index < defaultQuestions.length; index++) {
      const defaultQ = defaultQuestions[index];
      const { options, ...questionData } = defaultQ;

      const question = await tx.question.create({
        data: {
          quizId: quiz.id,
          order: index + 1, // ✅ QUESTION NUMBER
          key: questionData.key,
          title: questionData.title,
          type: questionData.type,
          description: questionData.description ?? null,
          min: questionData.min ?? null,
          suggestions:
            questionData.suggestions != null
              ? [...questionData.suggestions]
              : Prisma.JsonNull,
          active: questionData.active ?? true,
        },
      });

      // 3️⃣ Create options
      if (options?.length) {
        await tx.option.createMany({
          data: options.map((opt) => ({
            questionId: question.id,
            value: opt.value,
            label: opt.label,
            image: opt.image ?? null,
            description: opt.description ?? null,
            icon: opt.icon ?? null,
            upgrade: opt.upgrade ?? null,
            highlight: opt.highlight ?? null,
            diamondImage: opt.diamondImage ?? null,
            karats:
              opt.karats != null ? [...opt.karats] : Prisma.JsonNull,
            extra:
              opt.extra != null ? { ...opt.extra } : Prisma.JsonNull,
            specs:
              opt.specs != null ? { ...opt.specs } : Prisma.JsonNull,
          })),
        });
      }
    }

    // 4️⃣ Return full quiz
    return tx.quiz.findUniqueOrThrow({
      where: { id: quiz.id },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" }, // ✅ IMPORTANT
        },
      },
    });
  });
}

/**
 * Get quiz WITHOUT auto-create
 */
export async function getQuiz(): Promise<QuizWithQuestions | null> {
  return prisma.quiz.findFirst({
    include: {
      questions: {
        include: { options: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

/**
 * Update a question
 */
export async function updateQuestion(
  questionId: number,
  data: {
    title?: string;
    description?: string | null;
    type?: string;
    min?: number | null;
    suggestions?: readonly number[] | null;
  }
): Promise<Question> {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      title: data.title,
      description: data.description ?? undefined,
      type: data.type,
      min: data.min ?? undefined,
      suggestions:
        data.suggestions === undefined
          ? undefined
          : data.suggestions === null
          ? Prisma.JsonNull
          : [...data.suggestions],
    },
  });
}

/**
 * Toggle question active/inactive
 */
export async function toggleQuestionActive(
  questionId: number,
  active: boolean
): Promise<Question> {
  return prisma.question.update({
    where: { id: questionId },
    data: { active },
  });
}

/**
 * Add a new question to quiz (AUTO ORDER)
 */
export async function addQuestionToQuiz(
  quizId: number,
  data: {
    key: string;
    title: string;
    type: string;
    description?: string | null;
    min?: number | null;
    suggestions?: readonly number[] | null;
  }
): Promise<Question> {
  const lastQuestion = await prisma.question.findFirst({
    where: { quizId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const nextOrder = (lastQuestion?.order ?? 0) + 1;

  return prisma.question.create({
    data: {
      quizId,
      order: nextOrder, // ✅ AUTO INCREMENT
      key: data.key,
      title: data.title,
      type: data.type,
      description: data.description ?? null,
      min: data.min ?? null,
      suggestions:
        data.suggestions != null
          ? [...data.suggestions]
          : Prisma.JsonNull,
      active: true,
    },
  });
}

/**
 * Update option
 */
export async function updateOption(
  optionId: number,
  data: Partial<DefaultOptionInput>
): Promise<Option> {
  return prisma.option.update({
    where: { id: optionId },
    data: {
      value: data.value,
      label: data.label,
      image: data.image ?? undefined,
      description: data.description ?? undefined,
      icon: data.icon ?? undefined,
      upgrade: data.upgrade ?? undefined,
      highlight: data.highlight ?? undefined,
      diamondImage: data.diamondImage ?? undefined,
      karats:
        data.karats === undefined
          ? undefined
          : data.karats === null
          ? Prisma.JsonNull
          : [...data.karats],
      extra:
        data.extra === undefined
          ? undefined
          : data.extra === null
          ? Prisma.JsonNull
          : { ...data.extra },
      specs:
        data.specs === undefined
          ? undefined
          : data.specs === null
          ? Prisma.JsonNull
          : { ...data.specs },
    },
  });
}

/**
 * Add option to question
 */
export async function addOptionToQuestion(
  questionId: number,
  option: DefaultOptionInput
): Promise<Option> {
  return prisma.option.create({
    data: {
      questionId,
      value: option.value,
      label: option.label,
      image: option.image ?? null,
      description: option.description ?? null,
      icon: option.icon ?? null,
      upgrade: option.upgrade ?? null,
      highlight: option.highlight ?? null,
      diamondImage: option.diamondImage ?? null,
      karats:
        option.karats != null ? [...option.karats] : Prisma.JsonNull,
      extra:
        option.extra != null ? { ...option.extra } : Prisma.JsonNull,
      specs:
        option.specs != null ? { ...option.specs } : Prisma.JsonNull,
    },
  });
}

/**
 * Delete option
 */
export async function deleteOption(optionId: number): Promise<Option> {
  return prisma.option.delete({
    where: { id: optionId },
  });
}

/**
 * Delete question (and its options)
 */
export async function deleteQuestion(questionId: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.option.deleteMany({
      where: { questionId },
    });

    await tx.question.delete({
      where: { id: questionId },
    });
  });
}

