
import React, { useState } from 'react';
import { analyzeFreeformContent } from '../services/geminiService';
import { LoadingSpinner } from './common/LoadingSpinner';

export const ContentAnalyzer: React.FC = () => {
    const [content, setContent] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError('Please enter some content to analyze.');
            return;
        }
        setIsLoading(true);
        setResult('');
        setError('');
        try {
            const response = await analyzeFreeformContent(content);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-brand-blue mb-2">Freeform Content Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">Paste any text (e.g., from a document, email, or article) to get a structured analysis using <strong>gemini-2.5-flash</strong>.</p>
            
            <label htmlFor="content-input" className="block text-sm font-medium text-gray-700 mb-2">Paste your content here:</label>
            <textarea
                id="content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-lightblue focus:border-brand-lightblue"
                placeholder="Enter text to analyze..."
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-2 w-full px-4 py-2 bg-brand-lightblue text-white rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400 flex items-center justify-center"
            >
                {isLoading && <LoadingSpinner className="h-5 w-5 mr-2 text-white" />}
                {isLoading ? 'Analyzing...' : 'Analyze Content'}
            </button>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            {result && (
                <div className="mt-6">
                    <h4 className="font-semibold text-brand-blue">Analysis:</h4>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md border text-sm text-gray-800 whitespace-pre-wrap">{result}</div>
                </div>
            )}
        </div>
    );
};
