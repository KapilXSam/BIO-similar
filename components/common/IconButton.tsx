import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ariaLabel, ...props }) => {
    return (
        <button
            {...props}
            aria-label={ariaLabel}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors duration-200"
        >
            {children}
        </button>
    );
};
