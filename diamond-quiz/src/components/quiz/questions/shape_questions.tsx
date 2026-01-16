import React from 'react';
import { quizData } from '../../../data/quiz_data';

const options = quizData.questions.shape.options;

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const ShapeQuestion: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className=" w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {options.map((opt: any) => (
                    <label
                        key={opt.value}
                        className={`relative w-full h-32 cursor-pointer rounded-xl rounded-s-2xl rounded-e-2xl   border-4 transition-all ${
                            value === opt.value
                                ? 'scale-105 border-black bg-gray-50'
                                : 'scale-100 border-transparent hover:border-gray-300'
                        }`}
                    >
                        <input
                            type="radio"
                            name="shape"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            className="hidden"
                        />
                        <div className=" bg-pink-100 absolute inset-0 w-full h-full overflow-hidden rounded-xl object-center flex items-center justify-center">
                            <img
                                src={opt.image}
                                alt={opt.label}
                                className=" object-cover"
                            />
                        </div>
                        {/* DARK OVERLAY FOR TEXT READABILITY */}
                        <div className="absolute inset-0 bg-black/10 rounded-xl" />

                        {/* LABEL */}
                        <div className="absolute bottom-0 w-full text-center py-3 text-white text-lg font-semibold z-10">
                            {opt.label}
                        </div>
                        {value === opt.value && (
                            <div className="absolute -top-3 -right-3 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-sm z-10">
                                ✓
                            </div>
                        )}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ShapeQuestion;
