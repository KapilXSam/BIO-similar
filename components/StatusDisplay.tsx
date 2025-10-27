
import React from 'react';
import type { AppStatus } from '../types';

interface StatusDisplayProps {
    status: AppStatus;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
    return (
        <div className="my-6 p-4 bg-blue-50 border-l-4 border-brand-lightblue rounded-r-lg">
            <p className="text-sm font-medium text-brand-blue mb-2">{status.message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-brand-accent h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${status.progress}%` }}
                ></div>
            </div>
        </div>
    );
};
   