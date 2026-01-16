import { useState } from 'react';
import { quizData } from '../../data/quiz_data';

import QuestionWrapper from './question_wrapper';
import QuizIntro from './quiz_intro';

import SettingStyleQuestion from './questions/setting_style_question';
import MetalQuestion from './questions/metal_question';
import OriginQuestion from './questions/origin_questions';
import ShapeQuestion from './questions/shape_questions';
import BudgetQuestion from './questions/budget_question';
import PriorityQuestion from './questions/priority_question';

const Quiz = () => {
    const [hasStarted, setHasStarted] = useState(false); // 👈 NEW
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const steps = quizData.steps;
    const currentStepId = steps[currentStepIndex];
    const currentTitle = quizData.questions[currentStepId].title;

    const isCurrentStepAnswered = () => {
        switch (currentStepId) {
            case 'settingStyle':
                return !!answers.settingStyle;

            case 'metal':
                return (
                    !!answers.metal &&
                    (answers.metal === 'platinum' || !!answers.metalKarat)
                );

            case 'origin':
                return !!answers.origin;

            case 'shape':
                return !!answers.shape;

            case 'budget':
                return (
                    !!answers.budget &&
                    Number(answers.budget) >= quizData.questions.budget.min
                );

            case 'priority':
                return !!answers.priority;

            default:
                return false;
        }
    };

    const handleNext = () => {
        if (!isCurrentStepAnswered()) return;

        // ✅ FINAL SUBMIT
        if (currentStepIndex === steps.length - 1) {
            const { url, paramMap } = quizData.redirect;

            const searchParams = new URLSearchParams();

            Object.entries(paramMap).forEach(([answerKey, paramKey]) => {
                const value = answers[answerKey];
                if (value !== undefined && value !== null) {
                    searchParams.set(paramKey, String(value));
                }
            });

            const redirectUrl = `${url}?${searchParams.toString()}`;

            // 🔁 redirect
            window.location.href = redirectUrl;
            return;
        }

        setCurrentStepIndex((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    const updateAnswer = (key: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    const renderQuestion = () => {
        switch (currentStepId) {
            case 'settingStyle':
                return (
                    <SettingStyleQuestion
                        value={answers.settingStyle}
                        onChange={(v) => updateAnswer('settingStyle', v)}
                    />
                );
            case 'metal':
                return (
                    <MetalQuestion
                        metal={answers.metal}
                        karat={answers.metalKarat}
                        onMetalChange={(v) => updateAnswer('metal', v)}
                        onKaratChange={(v) => updateAnswer('metalKarat', v)}
                    />
                );
            case 'origin':
                return (
                    <OriginQuestion
                        value={answers.origin}
                        onChange={(v) => updateAnswer('origin', v)}
                    />
                );
            case 'shape':
                return (
                    <ShapeQuestion
                        value={answers.shape}
                        onChange={(v) => updateAnswer('shape', v)}
                    />
                );
            case 'budget':
                return (
                    <BudgetQuestion
                        value={answers.budget}
                        onChange={(v) => updateAnswer('budget', v)}
                    />
                );
            case 'priority':
                return (
                    <PriorityQuestion
                        value={answers.priority}
                        onChange={(v) => updateAnswer('priority', v)}
                    />
                );
            default:
                return null;
        }
    };

    // ✅ SHOW INTRO FIRST
    if (!hasStarted) {
        return <QuizIntro onStart={() => setHasStarted(true)} />;
    }

    return (
        <QuestionWrapper
            title={currentTitle}
            currentStep={currentStepIndex + 1}
            totalSteps={steps.length}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === steps.length - 1}
            isNextDisabled={!isCurrentStepAnswered()}
        >
            {renderQuestion()}
        </QuestionWrapper>
    );
};

export default Quiz;
