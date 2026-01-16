import { useMemo, useState } from 'react';
import quizData from '../../data/dummy_data.json';

import GenericQuestion from './questions/generic_question';
import TestQuizIntro from './test_quiz_intro';

const Quiz = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const quiz = quizData.quiz;

    // ✅ prepare questions (order + active)
    const questions = useMemo(() => {
        return quiz.questions
            .filter((q: any) => q.active !== false)
            .sort((a: any, b: any) => a.order - b.order);
    }, [quiz.questions]);

    const currentQuestion = questions[currentIndex];

    // ✅ validation
    const isCurrentStepAnswered = () => {
        const value = answers[currentQuestion.key];

        switch (currentQuestion.type) {
            case 'select':
                return Boolean(value);

            case 'budget':
                return (
                    value !== undefined &&
                    Number(value) >= Number(currentQuestion.min || 0)
                );

            default:
                return false;
        }
    };

    const handleNext = () => {
        if (!isCurrentStepAnswered()) return;

        if (currentIndex === questions.length - 1) {
            console.log('FINAL ANSWERS:', answers);
            return;
        }

        setCurrentIndex((p) => p + 1);
    };

    const handleBack = () => {
        setCurrentIndex((p) => Math.max(0, p - 1));
    };

    // ✅ intro screen
    if (!hasStarted) {
        return (
            <TestQuizIntro quiz={quiz} onStart={() => setHasStarted(true)} />
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-primary/20 relative">
            {/* HEADER */}
            <div className=" bg-emerald-200 p-6 pb-3 sticky top-0 z-10">
                {/* Progress */}
                <div className="w-full px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <p className=" font-medium text-gray-400 mb-4">
                        Step {currentIndex + 1} of {questions.length}
                    </p>
                    <div className=" w-full flex items-center justify-center relative z-0">
                        <div className=" w-full rounded-full h-2 z-10">
                            <div
                                className=" bg-gray-400 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${(Number(currentIndex + 1) / questions.length) * 100}%`,
                                }}
                            />
                        </div>
                        <div className=" w-full h-px bg-black absolute top-1 z-0"></div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-6 py-4 bg-red-200 flex items-center justify-center">
                <GenericQuestion
                    question={currentQuestion}
                    value={answers[currentQuestion.key]}
                    onChange={(value) =>
                        setAnswers((prev) => ({
                            ...prev,
                            [currentQuestion.key]: value,
                        }))
                    }
                />
            </div>

            {/* FOOTER NAV */}
            <div className="px-6 py-4 sticky bottom-0 bg-indigo-200 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 min-w-45 rounded-xl border-2 cursor-pointer border-primary font-medium transition ${
                            currentIndex === 0
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:bg-primary/10'
                        }`}
                    >
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isCurrentStepAnswered()}
                        className={`px-8 py-3 rounded-xl min-w-45 font-semibold cursor-pointer text-black transition ${
                            isCurrentStepAnswered()
                                ? ' bg-primary hover:bg-primary/90'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {currentIndex === questions.length - 1
                            ? 'Finish'
                            : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
