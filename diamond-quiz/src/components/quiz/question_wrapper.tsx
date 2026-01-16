import React from 'react';

interface QuestionWrapperProps {
    children: React.ReactNode;
    title: string;
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    isFirst: boolean;
    isLast: boolean;
    isNextDisabled: boolean; // ✅ NEW
}

const QuestionWrapper: React.FC<QuestionWrapperProps> = ({
    children,
    title,
    currentStep,
    totalSteps,
    onNext,
    onBack,
    isFirst,
    isLast,
    isNextDisabled,
}) => {
    return (
        <div className=" relative z-0 w-full">
            <div className=" w-full h-full absolute top-0 left-0 -z-10">
                <img
                    src="https://images.pexels.com/photos/8281580/pexels-photo-8281580.jpeg"
                    alt="background"
                    className="w-full h-full object-cover opacity-20"
                />
            </div>
            <div className="w-full p-4 min-h-screen bg-linear-to-b from-pink-50/40 to-white/10 flex flex-col z-10">
                {/* Progress */}
                <div className="w-full px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-black h-2 rounded-full transition-all duration-500"
                            style={{
                                width: `${(currentStep / totalSteps) * 100}%`,
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span>
                            {Math.round((currentStep / totalSteps) * 100)}%
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl md:text-3xl text-center mb-6">
                        {title}
                    </h1>
                    {children}
                </div>

                {/* Buttons */}
                <button
                    onClick={onBack}
                    disabled={isFirst}
                    className="px-8 py-4 border-2 w-40 border-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed bg-white z-10 hover:bg-gray-100 transition fixed bottom-4 left-4"
                >
                    Back
                </button>

                <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`px-8 py-4 self-baseline rounded-full w-40 font-semibold transition fixed bottom-4 right-4 z-10 ${
                        isNextDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                    {isLast ? 'View Results' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default QuestionWrapper;
