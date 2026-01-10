  // app/models/quiz.server.ts
  import { DefaultOptionInput } from "app/types/quiz.types";
import prisma from "../db.server"; // adjust path if needed
  import { defaultQuestions } from "../utils/default-quiz";
  import { type Quiz, type Question, type Option, Prisma } from "@prisma/client";

  // Optional: more specific type with included relations
  export type QuizWithQuestions = Quiz & {
    questions: (Question & {
      options: Option[];
    })[];
  };


  /**
   * Get quiz for a shop or create it with default questions if it doesn't exist
   */
  export async function getOrCreateQuiz(shop: string): Promise<QuizWithQuestions> {
    let quiz = await prisma.quiz.findUnique({
      where: { shop },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            id: "asc", // ← later you can change to sortOrder
          },
        },
      },
    });

    if (!quiz) {
      quiz = await createDefaultQuizForShop(shop);
    }

    return quiz;
  }

  /**
   * Create a new quiz with all default questions and options for a shop
   */
  export async function createDefaultQuizForShop(shop: string): Promise<QuizWithQuestions> {
    return prisma.$transaction(async (tx) => {
      // 1. Create the Quiz record
      const quiz = await tx.quiz.create({
        data: {
          shop,
        },
      });

      // 2. Create all default questions
      for (const defaultQ of defaultQuestions) {
        const { options, ...questionData } = defaultQ;

        const question = await tx.question.create({
          data: {
            quizId: quiz.id,
            key: questionData.key,
            title: questionData.title,
            type: questionData.type,
            description: questionData.description ?? null,
            min: questionData.min ?? null,
            suggestions:
    questionData.suggestions != null
      ? [...questionData.suggestions] // remove readonly
      : Prisma.JsonNull
          },
        });

        // 3. Create options if they exist
        if (options && options.length > 0) {
          await tx.option.createMany({
            data: options.map((opt) => ({
              questionId: question.id,
              value: opt.value,
              label: opt.label,
              image: opt.image ?? null,
              description: opt.description ?? null,
              icon: opt.icon ?? null,
              upgrade: opt.upgrade ?? null,
              karats: opt.karats != null ? [...opt.karats] : Prisma.JsonNull,
              extra: opt.extra != null ? { ...opt.extra } : Prisma.JsonNull,
              specs: opt.specs != null ? { ...opt.specs } : Prisma.JsonNull,
              highlight: opt.highlight ?? null,
              diamondImage: opt.diamondImage ?? null,
            })),
          });
        }
      }

      // 4. Return the freshly created quiz with all relations
      return tx.quiz.findUniqueOrThrow({
        where: { id: quiz.id },
        include: {
          questions: {
            include: {
              options: true,
            },
            orderBy: { id: "asc" },
          },
        },
      });
    });
  }

  /**
   * Get quiz without auto-creating if it doesn't exist
   */
  export async function getQuiz(shop: string): Promise<QuizWithQuestions | null> {
    return prisma.quiz.findUnique({
      where: { shop },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });
  }

/**
 * Update a question by ID
 */
export async function updateQuestion(
  questionId: number,
  data: {
    title?: string;
    description?: string | null;
    type?: string;
    min?: number | null;
    suggestions?: readonly string[] | null;
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
 * Update an option by ID
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
 * Add a new question to a quiz
 */
export async function addQuestionToQuiz(
  quizId: number,
  data: {
    key: string;
    title: string;
    type: string;
    description?: string | null;
    min?: number | null;
    suggestions?: readonly string[] | null;
  }
): Promise<Question> {
  return prisma.question.create({
    data: {
      quizId,
      key: data.key,
      title: data.title,
      type: data.type,
      description: data.description ?? null,
      min: data.min ?? null,
      suggestions:
        data.suggestions == null
          ? Prisma.JsonNull
          : [...data.suggestions],
    },
  });
}


/**
 * Add a new option to a question
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
 * Delete an option by ID
 */
export async function deleteOption(optionId: number): Promise<Option> {
  return prisma.option.delete({
    where: { id: optionId },
  });
}

/**
 * Delete a question and all its options
 */
export async function deleteQuestion(questionId: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // 1. Delete options first
    await tx.option.deleteMany({
      where: { questionId },
    });

    // 2. Delete the question
    await tx.question.delete({
      where: { id: questionId },
    });
  });
}