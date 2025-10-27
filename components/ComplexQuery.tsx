import React, { useState } from 'react';
import { getComplexQueryResponse } from '../services/geminiService';
import { LoadingSpinner } from './common/LoadingSpinner';

export const ComplexQuery: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError('Please enter a query.');
            return;
        }
        setIsLoading(true);
        setResult('');
        setError('');
        try {
            const response = await getComplexQueryResponse(prompt);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-brand-blue mb-2">Complex Query with Thinking Mode</h3>
            <p className="text-sm text-gray-600 mb-4">Uses <strong>gemini-2.5-pro</strong> for deep reasoning on complex topics. This may take a bit longer.</p>
            
            <label htmlFor="complex-prompt" className="block text-sm font-medium text-gray-700 mb-2">Enter your complex question:</label>
            <textarea
                id="complex-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-lightblue focus:border-brand-lightblue"
                placeholder="e.g., Analyze the long-term strategic implications of interchangeable biosimilars on the US healthcare market..."
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-2 w-full px-4 py-2 bg-brand-lightblue text-white rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400 flex items-center justify-center"
            >
                {isLoading && <LoadingSpinner className="h-5 w-5 mr-2 text-white" />}
                {isLoading ? 'Thinking...' : 'Submit for Analysis'}
            </button>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            {result && (
                <div className="mt-6">
                    <h4 className="font-semibold text-brand-blue">Analysis:</h4>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md border text-sm text-gray-800 whitespace-pre-wrap prose max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
                </div>
            )}
        </div>
    );
};
