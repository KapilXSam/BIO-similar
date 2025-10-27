import React from 'react';
import { LoadingSpinner } from './common/LoadingSpinner';

interface ControlPanelProps {
    onProcess: () => void;
    isProcessing: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onProcess, isProcessing }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <button
                onClick={onProcess}
                disabled={isProcessing}
                className="px-4 py-2 bg-brand-blue text-white font-semibold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
                {isProcessing ? (
                    <>
                        <LoadingSpinner className="h-5 w-5 mr-2 text-white" />
                        Processing...
                    </>
                ) : 'Load & Process News Feed'}
            </button>
            <p className="text-sm text-gray-500">
                {isProcessing ? "Fetching, analyzing, and summarizing articles..." : "Click to start the daily intelligence briefing process."}
            </p>
        </div>
    );
};
