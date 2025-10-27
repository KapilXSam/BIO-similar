
import React, { useState, useEffect } from 'react';

// Components
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { StatusDisplay } from './components/StatusDisplay';
import { NewsDashboard } from './components/NewsDashboard';
import { ReportPreview } from './components/ReportPreview';
import { ConfigurationDashboard } from './components/ConfigurationDashboard';
import { IntelligenceTools } from './components/IntelligenceTools';

// Services & Data
import { processNewsFeed } from './services/processingService';
import { INITIAL_MONITORED_COMPANIES, INITIAL_MONITORED_KEYWORDS } from './constants';

// Types
import type { ProcessedArticle, AppStatus } from './types';

const App: React.FC = () => {
    // State
    const [articles, setArticles] = useState<ProcessedArticle[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<AppStatus>({ message: 'Ready to process news feed.', progress: 0 });
    
    // Configuration State with Local Storage persistence
    const [monitoredCompanies, setMonitoredCompanies] = useState<string[]>(() => {
        const saved = localStorage.getItem('monitoredCompanies');
        return saved ? JSON.parse(saved) : INITIAL_MONITORED_COMPANIES;
    });
    
    const [monitoredKeywords, setMonitoredKeywords] = useState<string[]>(() => {
        const saved = localStorage.getItem('monitoredKeywords');
        return saved ? JSON.parse(saved) : INITIAL_MONITORED_KEYWORDS;
    });

    useEffect(() => {
        localStorage.setItem('monitoredCompanies', JSON.stringify(monitoredCompanies));
    }, [monitoredCompanies]);

    useEffect(() => {
        localStorage.setItem('monitoredKeywords', JSON.stringify(monitoredKeywords));
    }, [monitoredKeywords]);


    // Handlers
    const handleProcessNews = async () => {
        setIsProcessing(true);
        setArticles([]);
        try {
            const processed = await processNewsFeed(monitoredCompanies, monitoredKeywords, setStatus);
            setArticles(processed);
        } catch (error) {
            console.error("An error occurred during processing:", error);
            setStatus({ message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, progress: 0 });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDashboardAction = (articleId: string, action: 'speak' | 'archive') => {
        if (action === 'archive') {
            setArticles(prev => prev.map(a => a.id === articleId ? { ...a, status: 'Archived' } : a));
        } else if (action === 'speak') {
            const article = articles.find(a => a.id === articleId);
            if (article && article.summary) {
                // Cancel any previous speech
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(article.summary);
                speechSynthesis.speak(utterance);
            }
        }
    };

    // Configuration Handlers
    const addCompany = (company: string) => !monitoredCompanies.find(c => c.toLowerCase() === company.toLowerCase()) && setMonitoredCompanies(prev => [...prev, company]);
    const removeCompany = (company: string) => setMonitoredCompanies(prev => prev.filter(c => c !== company));
    const addKeyword = (keyword: string) => !monitoredKeywords.find(k => k.toLowerCase() === keyword.toLowerCase()) && setMonitoredKeywords(prev => [...prev, keyword]);
    const removeKeyword = (keyword: string) => setMonitoredKeywords(prev => prev.filter(k => k !== keyword));


    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column: Controls & News Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <ControlPanel onProcess={handleProcessNews} isProcessing={isProcessing} />
                        {isProcessing && <StatusDisplay status={status} />}
                        <NewsDashboard articles={articles} onAction={handleDashboardAction} />
                    </div>

                    {/* Right Column: Report & Tools */}
                    <div className="space-y-6">
                        <ReportPreview articles={articles} />
                        <ConfigurationDashboard 
                            companies={monitoredCompanies}
                            keywords={monitoredKeywords}
                            onAddCompany={addCompany}
                            onRemoveCompany={removeCompany}
                            onAddKeyword={addKeyword}
                            onRemoveKeyword={removeKeyword}
                        />
                        <IntelligenceTools />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
