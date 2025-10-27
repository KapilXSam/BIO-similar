import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const StarIcon = () => (
    // FIX: Moved SVG presentation attributes from the style object to be direct props on the SVG element to resolve a TypeScript type error with `imageRendering`.
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g>
            <path className="fill-current" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
        </g>
    </svg>
);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className="group relative px-4 py-2 bg-brand-accent text-gray-800 font-semibold text-sm border-2 border-brand-accent rounded-lg shadow-sm transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed hover:bg-transparent hover:text-brand-accent hover:shadow-lg hover:shadow-yellow-500/50"
        >
            {/* Stars */}
            <div className="absolute top-[20%] left-[20%] w-6 h-auto text-yellow-50 filter drop-shadow-none z-[-5] transition-all duration-1000 ease-[cubic-bezier(0.05,0.83,0.43,0.96)] group-hover:top-[-80%] group-hover:left-[-30%] group-hover:w-6 group-hover:filter-[drop-shadow(0_0_10px_#fffdef)] group-hover:z-10">
                <StarIcon />
            </div>
            <div className="absolute top-[45%] left-[45%] w-4 h-auto text-yellow-50 filter drop-shadow-none z-[-5] transition-all duration-1000 ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[-25%] group-hover:left-[10%] group-hover:w-4 group-hover:filter-[drop-shadow(0_0_10px_#fffdef)] group-hover:z-10">
                <StarIcon />
            </div>
            <div className="absolute top-[40%] left-[40%] w-1.5 h-auto text-yellow-50 filter drop-shadow-none z-[-5] transition-all duration-1000 ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[55%] group-hover:left-[25%] group-hover:w-1.5 group-hover:filter-[drop-shadow(0_0_10px_#fffdef)] group-hover:z-10">
                <StarIcon />
            </div>
            <div className="absolute top-[20%] left-[40%] w-2 h-auto text-yellow-50 filter drop-shadow-none z-[-5] transition-all duration-[800ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[30%] group-hover:left-[80%] group-hover:w-2 group-hover:filter-[drop-shadow(0_0_10px_#fffdef)] group-hover:z-10">
                <StarIcon />
            </div>
            <div className="absolute top-[25%] left-[45%] w-4 h-auto text-yellow-50 filter drop-shadow-none z-[-5] transition-all duration-[600ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[25%] group-hover:left-[115%] group-hover:w-4 group-hover:filter-[drop-shadow(0_0_10px_#fffdef)] group-hover:z-10">
                <StarIcon />
            </div>
            <div className="absolute top-[5%] left-[50%] w-1.5 h-auto text-yellow-50 filter drop-shadow-none z-[-5] transition-all duration-[800ms] ease group-hover:top-[5%] group-hover:left-[60%] group-hover:w-1.5 group-hover:filter-[drop-shadow(0_0_10px_#fffdef)] group-hover:z-10">
                <StarIcon />
            </div>
            <span className="relative z-0">{children}</span>
        </button>
    );
};