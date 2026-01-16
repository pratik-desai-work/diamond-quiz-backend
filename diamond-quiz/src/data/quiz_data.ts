import rawQuizData from './quiz_data.json';
import type { QuizData, QuizStep } from '../types/quiz.types';

/**
 * Basic runtime validation
 */
function validateQuizData(data: any): asserts data is QuizData {
    if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error('quiz_data.json: missing or invalid "steps"');
    }

    if (!data.questions) {
        throw new Error('quiz_data.json: missing "questions"');
    }
}

validateQuizData(rawQuizData);

export const quizData: QuizData = rawQuizData;
export type { QuizStep };
