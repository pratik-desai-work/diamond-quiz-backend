import React from 'react';
import { quizData } from '../../data/quiz_data';

interface QuizIntroProps {
    onStart: () => void;
}

const QuizIntro: React.FC<QuizIntroProps> = ({ onStart }) => {
    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center text-white text-center px-6"
            style={{
                backgroundImage: `url(${quizData.intro.image})`, // 👈 replace with actual image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="bg-black/20 absolute inset-0" />

            <div className="relative z-10 max-w-2xl">
                <p className="tracking-widest text-sm mb-4">Axe</p>

                <h1 className="text-4xl md:text-6xl font-light mb-4">
                    {quizData.intro.title}
                </h1>

                <h2 className="text-6xl md:text-8xl font-extrabold mb-8">
                    {quizData.intro.subtitle}
                </h2>

                <button
                    onClick={onStart}
                    className=" bg-black text-white px-10 py-4 w-50 rounded-full font-semibold hover:scale-105 hover:bg-black/90 cursor-pointer transition duration-300"
                >
                    {quizData.intro.ctaText || "Let's start"}
                </button>

                <p className="mt-4 text-sm opacity-80">{quizData.intro.note}</p>
            </div>
        </div>
    );
};

export default QuizIntro;
