import React from 'react';
import { quizData } from '../../../data/quiz_data';

const { options, description: sharedDescription } = quizData.questions.origin;

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const OriginQuestion: React.FC<Props> = ({ value, onChange }) => {
    const selectedOption = options.find((opt: any) => opt.value === value);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Two large cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-5">
                {options.map((opt: any) => (
                    <label
                        key={opt.value}
                        className={`relative h-52 cursor-pointer rounded-xl rounded-s-2xl rounded-e-2xl border-4 transition-all ${
                            value === opt.value
                                ? 'border-black bg-gray-50'
                                : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                        <input
                            type="radio"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            className="hidden"
                        />

                        <div className="bg-pink-100 absolute w-full h-full overflow-hidden rounded-xl flex items-center justify-center">
                            <img
                                src={opt.icon}
                                alt={opt.label}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/10 rounded-3xl" />

                        {/* Label */}
                        <div className="absolute bottom-0 w-full text-center py-3 text-white text-lg font-semibold z-10">
                            {opt.label}
                        </div>

                        {/* Check */}
                        {value === opt.value && (
                            <div className="absolute -top-3 -right-3 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-sm z-10">
                                ✓
                            </div>
                        )}
                    </label>
                ))}
            </div>

            {/* Shared description (always visible) */}
            <p className="text-center text-gray-600 text-sm mb-6 max-w-3xl mx-auto">
                {sharedDescription}
            </p>

            {/* Selected option extra info */}
            {selectedOption?.extra && (
                <div className="max-w-3xl px-6 mx-auto  space-y-3">
                    <h3 className=" text-lg font-semibold">
                        {selectedOption.extra.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {selectedOption.extra.content}
                    </p>
                </div>
            )}
        </div>
    );
};

export default OriginQuestion;
