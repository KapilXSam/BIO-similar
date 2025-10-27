
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Chatbot } from './Chatbot';
import { ImageAnalyzer } from './ImageAnalyzer';
import { ComplexQuery } from './ComplexQuery';
import { AudioTranscriber } from './AudioTranscriber';
import { GroundingSearch } from './GroundingSearch';
import { ContentAnalyzer } from './ContentAnalyzer';

type Tool = 'chat' | 'image' | 'query' | 'transcribe' | 'search' | 'content';

const tools: { id: Tool, name: string }[] = [
    { id: 'chat', name: 'Chat Assistant' },
    { id: 'search', name: 'Live Search' },
    { id: 'query', name: 'Complex Query' },
    { id: 'content', name: 'Content Analyzer' },
    { id: 'image', name: 'Image Analyzer' },
    { id: 'transcribe', name: 'Voice Notes' },
];

export const IntelligenceTools: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tool>('chat');

    const renderTool = () => {
        switch (activeTool) {
            case 'chat': return <Chatbot />;
            case 'image': return <ImageAnalyzer />;
            case 'query': return <ComplexQuery />;
            case 'transcribe': return <AudioTranscriber />;
            case 'search': return <GroundingSearch />;
            case 'content': return <ContentAnalyzer />;
            default: return null;
        }
    }

    return (
        <Card>
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Intelligence Tools</h3>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tools.map((tool) => (
                         <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                                activeTool === tool.id
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tool.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {renderTool()}
            </div>
        </Card>
    );
};
