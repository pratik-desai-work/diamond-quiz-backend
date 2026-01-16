import React from 'react';
import { quizData } from '../../../data/quiz_data';

const { min, suggestions } = quizData.questions.budget;

interface Props {
    value?: number;
    onChange: (value: number) => void;
}

const BudgetQuestion: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className="max-w-xl mx-auto text-center">
            <div className="mb-6">
                <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-5xl font-light text-gray-400">
                        $
                    </span>
                    <input
                        type="number"
                        min={min}
                        value={value || ''}
                        onChange={(e) => onChange(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full text-5xl font-bold text-center pl-16 pr-8 py-8 border-4 border-gray-200 rounded-3xl focus:border-black focus:outline-none transition"
                    />
                </div>
            </div>

            <div className=" w-full grid grid-cols-3 gap-4 mb-6">
                {suggestions.map((amount: any) => (
                    <button
                        key={amount}
                        onClick={() => onChange(amount)}
                        className={`px-8 py-4 text-lg rounded-2xl border-2 transition-all cursor-pointer ${
                            value === amount
                                ? 'bg-black text-white border-black'
                                : 'border-gray-300 hover:border-black'
                        }`}
                    >
                        ${amount.toLocaleString()}
                    </button>
                ))}
            </div>

            <p className="text-gray-500 text-sm">
                Minimum budget of ${min.toLocaleString()}
            </p>
        </div>
    );
};

export default BudgetQuestion;
