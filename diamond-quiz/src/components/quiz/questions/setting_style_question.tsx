import React, { useEffect, useState } from 'react';
import { quizData } from '../../../data/quiz_data';

const options = quizData.questions.settingStyle.options;

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const SettingStyleQuestion: React.FC<Props> = ({ value, onChange }) => {
    const [selected, setSelected] = useState(options[0]);

    // sync with parent value
    useEffect(() => {
        if (value) {
            const found = options.find((o: any) => o.value === value);
            if (found) setSelected(found);
        } else {
            onChange(options[0].value); // default select first
        }
    }, [value, onChange]);

    const handleSelect = (opt: (typeof options)[number]) => {
        setSelected(opt);
        onChange(opt.value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            {/* BIG PREVIEW */}
            <div className="bg-white rounded-3xl shadow-xl mb-8 w-full h-62 overflow-hidden object-center object-cover flex items-center justify-center">
                <img
                    src={selected.image}
                    alt={selected.label}
                    className=" object-cover"
                />
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((opt: any) => {
                    const isActive = opt.value === selected.value;

                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt)}
                            className={`relative rounded-2xl border-2 transition  ${
                                isActive
                                    ? 'border-black'
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            {isActive && (
                                <div className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                    ✓
                                </div>
                            )}
                            <div className=" w-full h-32 overflow-hidden flex items-center justify-center rounded-xl">
                                <img
                                    src={opt.image}
                                    alt={opt.label}
                                    className=" w-full object-cover"
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* DESCRIPTION */}
            {selected.description && (
                <p className="mt-8 text-lg text-gray-700 max-w-md mx-auto">
                    {selected.description}
                </p>
            )}
        </div>
    );
};

export default SettingStyleQuestion;
