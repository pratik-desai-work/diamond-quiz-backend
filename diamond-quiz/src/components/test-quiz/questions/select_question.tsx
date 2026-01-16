import React, { useEffect, useState } from 'react';

interface Props {
    question: {
        title: string;
        description?: string;
        options: any[];
    };
    value?: string;
    onChange: (value: string) => void;
}

const SelectQuestion: React.FC<Props> = ({ question, value, onChange }) => {
    const { options, title, description } = question;
    const [selected, setSelected] = useState<any | null>(null);

    // default + sync
    useEffect(() => {
        if (value) {
            const found = options.find((o) => o.value === value);
            if (found) setSelected(found);
        } else if (options.length) {
            setSelected(options[0]);
            onChange(options[0].value);
        }
    }, [value, options, onChange]);

    if (!selected) return null;

    const previewImage = selected.image || selected.diamondImage || null;

    return (
        <div className="w-full max-w-3xl mx-auto text-center ">
            <h1 className=" font-semibold text-xl lg:text-2xl ">{title}</h1>
            {/* QUESTION DESCRIPTION */}
            {description && (
                <p className="mb-6 text-gray-600 max-w-xl mx-auto">
                    {description}
                </p>
            )}

            {/* PREVIEW IMAGE */}
            {/* {previewImage && (
                <div className="bg-white rounded-3xl shadow-lg mb-8 h-64 overflow-hidden flex items-center justify-center">
                    <img
                        src={previewImage}
                        alt={selected.label}
                        className="w-full h-full object-cover"
                    />
                </div>
            )} */}

            {/* OPTIONS */}
            <div className=" flex items-center justify-center flex-wrap gap-4 max-w-5xl">
                {options.map((opt) => {
                    const isActive = opt.value === selected.value;
                    const thumb = opt.image || opt.diamondImage || null;

                    return (
                        <div className="w-1/4 flex flex-col items-center">
                            <button
                                key={opt.value}
                                onClick={() => {
                                    setSelected(opt);
                                    onChange(opt.value);
                                }}
                                className={`relative w-full rounded-xl border-3 overflow-hidden shadow-xl transition ${
                                    isActive
                                        ? ' border-primary'
                                        : ' border-gray-200 hover:border-primary/30'
                                }`}
                            >
                                {thumb ? (
                                    <div className=" w-full h-52 rounded-lg overflow-hidden">
                                        <img
                                            src={thumb}
                                            alt={opt.label}
                                            className="w-full h-full object-cover "
                                        />
                                    </div>
                                ) : (
                                    <div className="h-32 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </button>
                            <p className="mt-2 text-sm font-medium">
                                {opt.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* OPTION DESCRIPTION */}
            {selected.description && (
                <p className="mt-6 text-gray-500 max-w-md mx-auto">
                    {selected.description}
                </p>
            )}
        </div>
    );
};

export default SelectQuestion;
