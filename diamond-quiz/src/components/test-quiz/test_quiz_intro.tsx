import React from 'react';

interface QuizIntroProps {
    quiz: {
        title: string;
        subtitle: string;
        description?: string;
        ctaText?: string;
        note?: string;
        image: string;
    };
    onStart: () => void;
}

const TestQuizIntro: React.FC<QuizIntroProps> = ({ quiz, onStart }) => {
    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center text-white px-6"
            style={{
                backgroundImage: `url(${quiz.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 max-w-3xl text-center">
                <h2 className="tracking-widest text-sm mb-4 uppercase">
                    {quiz.subtitle}
                </h2>

                <h1 className="text-5xl md:text-7xl font-light mb-4">
                    {quiz.title}
                </h1>

                {quiz.description && (
                    <p className="text-lg opacity-90 mb-8">
                        {quiz.description}
                    </p>
                )}

                <button
                    onClick={onStart}
                    className=" bg-primary text-black px-10 py-4 rounded-full font-semibold transition hover:scale-105"
                >
                    {quiz.ctaText || "Let's start"}
                </button>

                {quiz.note && (
                    <p className="mt-4 text-sm opacity-80">{quiz.note}</p>
                )}
            </div>
        </div>
    );
};

export default TestQuizIntro;
