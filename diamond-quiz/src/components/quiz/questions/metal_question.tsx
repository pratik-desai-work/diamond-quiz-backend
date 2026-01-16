import React from 'react';
import { quizData } from '../../../data/quiz_data';

const options = quizData.questions.metal.options;

interface Props {
    metal?: string;
    karat?: string;
    onMetalChange: (value: string) => void;
    onKaratChange: (value: string) => void;
}

const MetalQuestion: React.FC<Props> = ({
    metal,
    karat,
    onMetalChange,
    onKaratChange,
}) => {
    const selected = options.find((o: any) => o.value === metal);

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* METAL OPTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                {options.map((opt: any) => {
                    const isSelected = metal === opt.value;

                    return (
                        <label
                            key={opt.value}
                            className={`relative cursor-pointer rounded-xl rounded-s-2xl rounded-e-2xl   border-4 transition-all h-40 ${
                                isSelected
                                    ? 'border-black shadow-lg'
                                    : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            <input
                                type="radio"
                                name="metal"
                                value={opt.value}
                                checked={isSelected}
                                onChange={() => onMetalChange(opt.value)}
                                className="hidden"
                            />

                            {/* IMAGE */}
                            <div className=" bg-pink-100 absolute inset-0 w-full h-full overflow-hidden rounded-xl object-center flex items-center justify-center">
                                <img
                                    src={opt.image}
                                    alt={opt.label}
                                    className=" w-full h-full object-cover"
                                />
                            </div>

                            {/* DARK OVERLAY FOR TEXT READABILITY */}
                            <div className="absolute inset-0 bg-black/10 rounded-xl" />

                            {/* LABEL */}
                            <div className="absolute bottom-0 w-full text-center py-3 text-white text-lg font-semibold z-10">
                                {opt.label}
                            </div>

                            {/* CHECK MARK */}
                            {isSelected && (
                                <div className="absolute -top-3 -right-3 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-sm z-10">
                                    ✓
                                </div>
                            )}
                        </label>
                    );
                })}
            </div>

            {/* DESCRIPTION */}
            {selected?.description && (
                <p className="text-center text-gray-700 max-w-3xl mx-auto mb-4">
                    {selected.description}
                </p>
            )}

            {/* KARAT OPTIONS */}
            {selected?.karats && (
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                    {selected.karats.map((k: any) => {
                        const isSelected = karat === k.value;

                        return (
                            <label
                                key={k.value}
                                className={`cursor-pointer w-full text-center px-10 py-5 rounded-full text-lg font-medium border-2 transition-all ${
                                    isSelected
                                        ? 'bg-black text-white border-black'
                                        : 'border-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <input
                                    type="radio"
                                    value={k.value}
                                    checked={isSelected}
                                    onChange={() => onKaratChange(k.value)}
                                    className="hidden"
                                />
                                {k.label}
                                {k.upgrade && (
                                    <span className="ml-2 text-sm opacity-70">
                                        Upgrade
                                    </span>
                                )}
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MetalQuestion;
