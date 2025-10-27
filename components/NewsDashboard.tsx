import React from 'react';
import type { ProcessedArticle } from '../types';
import { IconButton } from './common/IconButton';
import { AnimatedButton } from './common/AnimatedButton';

interface NewsDashboardProps {
    articles: ProcessedArticle[];
    onAction: (articleId: string, action: 'speak' | 'archive') => void;
}

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Regulatory Updates': return 'bg-red-100 text-red-800';
        case 'Commercial & Market Access': return 'bg-green-100 text-green-800';
        case 'Legal & IP Developments': return 'bg-yellow-100 text-yellow-800';
        case 'Financial & Corporate': return 'bg-blue-100 text-blue-800';
        case 'Conference & Research': return 'bg-indigo-100 text-indigo-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getRelevanceColor = (score: number) => {
    if (score > 7) return 'bg-red-500';
    if (score > 4) return 'bg-yellow-500';
    return 'bg-green-500';
};

export const NewsDashboard: React.FC<NewsDashboardProps> = ({ articles, onAction }) => {

    const handleDownloadFeed = () => {
        if (articles.length === 0) return;

        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
        const filename = `Pharma-Intel-News-Feed_${timestamp}.txt`;

        const fileContent = articles.map(article => {
            return `
--------------------------------------------------
Title: ${article.title}
Company: ${article.companyName}
Link: ${article.link}
Category: ${article.category} (${article.subCategory})
Relevance Score: ${article.relevanceScore}/10
Summary: ${article.summary}
--------------------------------------------------
            `.trim();
        }).join('\n\n');

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    if (articles.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800">News Feed</h3>
                <p className="mt-2 text-sm text-gray-500">No articles processed yet. Click "Load & Process News Feed" to begin.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                 <h3 className="text-lg font-semibold text-gray-800">News Feed</h3>
                 <AnimatedButton onClick={handleDownloadFeed} disabled={articles.length === 0}>
                    Download Feed
                 </AnimatedButton>
            </div>
            <div className="divide-y divide-gray-200">
                {articles.map((article) => (
                    <div key={article.id} className={`p-4 transition-opacity duration-300 ${article.status === 'Archived' ? 'opacity-50 bg-gray-50' : ''}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex-grow pr-4">
                                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(article.category)}`}>
                                        {article.category}
                                    </span>
                                    <span className="text-xs font-medium text-gray-500">{article.subCategory}</span>
                                </div>
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-md font-semibold text-brand-blue hover:underline">
                                    {article.title}
                                </a>
                                <p className="text-sm text-gray-600 mt-2">{article.summary}</p>
                            </div>
                            <div className="flex-shrink-0 ml-4 flex items-center space-x-1 sm:space-x-2">
                                <div className="flex items-center" title={`Relevance: ${article.relevanceScore}/10`}>
                                    <div className={`w-3 h-3 rounded-full ${getRelevanceColor(article.relevanceScore)}`}></div>
                                    <span className="ml-1.5 text-sm font-bold text-gray-700">{article.relevanceScore}</span>
                                </div>
                                <IconButton ariaLabel="Speak summary" onClick={() => onAction(article.id, 'speak')} disabled={article.status === 'Archived'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a.5.5 0 01.5.5v12a.5.5 0 01-1 0v-12a.5.5 0 01.5-.5z" /><path d="M4 8.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM16 8.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM7 6.5a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm6 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5z" /></svg>
                                </IconButton>
                                <IconButton ariaLabel="Archive article" onClick={() => onAction(article.id, 'archive')} disabled={article.status === 'Archived'}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};