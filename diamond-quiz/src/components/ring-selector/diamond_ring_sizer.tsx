import { useState } from 'react';

import diamondImage from '../../assets/diamond.png';
import handImage from '../../assets/hand.jpg';

const DIAMOND_SIZES = [
    { label: 'XS', scale: 0.7 },
    { label: 'S', scale: 0.8 },
    { label: 'M', scale: 1 },
    { label: 'L', scale: 1.2 },
    { label: 'XL', scale: 1.3 },
    { label: 'XXL', scale: 1.5 },
];

export default function DiamondRingSizer() {
    const [selectedSize, setSelectedSize] = useState(DIAMOND_SIZES[2]);

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Preview Area */}
            <div className="relative w-90 select-none">
                {/* Hand */}
                <img
                    src={handImage}
                    alt="Hand"
                    className="w-full object-contain"
                />

                {/* Diamond */}
                <div className="absolute w-4 h-4 left-[40%] top-[45%] transition-transform duration-300 ease-in-out">
                    <img
                        src={diamondImage}
                        alt="Diamond"
                        className=" w-full h-full object-contain"
                        style={{
                            transform: `translateX(-50%) scale(${selectedSize.scale})`,
                        }}
                    />
                </div>
            </div>

            {/* Size Controls */}
            <div className="flex gap-2 flex-wrap justify-center">
                {DIAMOND_SIZES.map((size) => {
                    const isActive = size.label === selectedSize.label;

                    return (
                        <button
                            key={size.label}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition
                ${isActive
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                }
              `}
                        >
                            {size.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
