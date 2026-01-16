import React from 'react';
import { quizData } from '../../../data/quiz_data';

const options = quizData.questions.priority.options;

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const PriorityQuestion: React.FC<Props> = ({ value, onChange }) => {
    const selectedOption =
        options.find((opt: any) => opt.value === value) || options[1]; // default middle

    return (
        <div className=" max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* LEFT OPTIONS */}
            <div className="flex flex-col items-center gap-3">
                {options.map((opt: any) => (
                    <label
                        key={opt.value}
                        className={`relative cursor-pointer rounded-2xl border-2 p-8 py-6 transition-all w-full overflow-hidden bg-white ${
                            value === opt.value
                                ? 'border-black shadow-xl'
                                : 'border-gray-200 hover:shadow-md'
                        }`}
                    >
                        <input
                            type="radio"
                            name="priority"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            className="hidden"
                        />

                        {/* Ribbon */}
                        {opt.highlight && (
                            <div className="absolute top-4 -right-9 rotate-45 bg-yellow-400 text-black text-sm font-semibold px-10 py-1 shadow">
                                Get it All
                            </div>
                        )}

                        <h3 className=" font-semibold mb-2">{opt.label}</h3>
                        <p className="text-gray-500 text-sm">
                            {opt.description}
                        </p>
                    </label>
                ))}
            </div>

            {/* RIGHT PREVIEW */}
            <div className="bg-white h-fit rounded-2xl shadow-lg overflow-hidden flex flex-col">
                {/* Diamond Image */}
                <div className="bg-gray-200 w-full h-74 flex justify-center items-center overflow-hidden">
                    {selectedOption.diamondImage && (
                        <img
                            src={selectedOption.diamondImage}
                            alt="Diamond"
                            className=" w-full object-cover"
                        />
                    )}
                </div>

                {/* Specs */}
                {selectedOption.specs && (
                    <div className="border-t p-3">
                        <div className="text-center text-xs text-gray-500 uppercase mb-4 flex items-center justify-center gap-1">
                            Stone Quality
                            <span className="text-gray-400">?</span>
                        </div>

                        <div className="grid grid-cols-4 text-center">
                            <Spec
                                label="Carat"
                                value={selectedOption.specs.carat}
                            />
                            <Spec
                                label="Color"
                                value={selectedOption.specs.color}
                            />
                            <Spec
                                label="Clarity"
                                value={selectedOption.specs.clarity}
                            />
                            <Spec
                                label="Ratio"
                                value={selectedOption.specs.ratio}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Spec = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
    </div>
);

export default PriorityQuestion;
