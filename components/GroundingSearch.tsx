import React, { useState } from 'react';
import { getGroundedResponse } from '../services/geminiService';
import type { GroundingTool, GroundingChunk } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';

export const GroundingSearch: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [tool, setTool] = useState<GroundingTool>('googleSearch');
    const [result, setResult] = useState<{ text: string; chunks: GroundingChunk[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a search query.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const response = await getGroundedResponse(prompt, tool);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-brand-blue mb-2">Live Search & Maps</h3>
            <p className="text-sm text-gray-600 mb-4">Get up-to-date information using <strong>gemini-2.5-flash</strong> grounded on Google Search or Maps.</p>

            <div className="flex bg-gray-100 rounded-lg p-1 mb-4 w-max">
                <button onClick={() => setTool('googleSearch')} className={`px-4 py-1 text-sm font-medium rounded-md ${tool === 'googleSearch' ? 'bg-white text-brand-blue shadow' : 'text-gray-600'}`}>
                    Web Search
                </button>
                <button onClick={() => setTool('googleMaps')} className={`px-4 py-1 text-sm font-medium rounded-md ${tool === 'googleMaps' ? 'bg-white text-brand-blue shadow' : 'text-gray-600'}`}>
                    Maps Search
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="grounding-prompt" className="block text-sm font-medium text-gray-700 mb-2">Your Query:</label>
                <div className="flex items-center">
                    <input
                        id="grounding-prompt"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={tool === 'googleSearch' ? "e.g., latest news on adalimumab biosimilars" : "e.g., top biotech research centers near Boston"}
                        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-brand-lightblue focus:border-brand-lightblue"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-brand-lightblue text-white rounded-r-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400 flex items-center justify-center"
                    >
                         {isLoading ? <LoadingSpinner className="h-5 w-5 text-white" /> : 'Search'}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            {result && (
                <div className="mt-6">
                    <h4 className="font-semibold text-brand-blue">Response:</h4>
                    <p className="mt-2 p-4 bg-gray-50 rounded-md border text-sm text-gray-800 whitespace-pre-wrap">{result.text}</p>
                    
                    {result.chunks.length > 0 && (
                        <div className="mt-4">
                            <h5 className="font-semibold text-gray-700">Sources:</h5>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                {result.chunks.map((chunk, index) => {
                                    const source = chunk.web || chunk.maps;
                                    return source ? (
                                        <li key={index}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-lightblue hover:underline">{source.title}</a>
                                        </li>
                                    ) : null;
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
