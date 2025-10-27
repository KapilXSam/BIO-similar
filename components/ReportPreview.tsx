// FIX: Provided full implementation for missing ReportPreview component.
import React, { useState, useEffect } from 'react';
import type { ProcessedArticle } from '../types';
import { generateReportSummary } from '../services/geminiService';
import { generatePdfReport } from '../services/pdfService';
import { LoadingSpinner } from './common/LoadingSpinner';

export const ReportPreview: React.FC<{ articles: ProcessedArticle[] }> = ({ articles }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const activeArticles = articles.filter(a => a.status !== 'Archived' && a.relevanceScore > 3);

    useEffect(() => {
        if (activeArticles.length > 0) {
            setIsLoading(true);
            setSummary('');
            const articleData = activeArticles.map(({ title, summary }) => ({ title, summary: summary || '' }));
            
            generateReportSummary(articleData)
                .then(setSummary)
                .catch(err => {
                    console.error("Failed to generate report summary:", err);
                    setSummary("Could not generate an executive summary.");
                })
                .finally(() => setIsLoading(false));

        } else {
            setSummary('');
        }
    }, [articles]);

    const handleDownload = async () => {
        if (!summary || activeArticles.length === 0) return;
        
        const blob = await generatePdfReport(activeArticles, summary);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Pharma-Intel-Briefing-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (articles.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Daily Briefing</h3>
                <p className="text-sm text-gray-500">Process the news feed to generate a report.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Daily Executive Briefing</h3>
                <button 
                    onClick={handleDownload}
                    disabled={isLoading || !summary}
                    className="px-3 py-1.5 text-sm bg-brand-lightblue text-white font-semibold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Download PDF
                </button>
            </div>
            {isLoading && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <LoadingSpinner className="h-4 w-4" />
                    <span>Synthesizing report...</span>
                </div>
            )}
            {summary && (
                <div className="text-sm text-gray-600 whitespace-pre-wrap prose max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}></div>
            )}
        </div>
    );
};