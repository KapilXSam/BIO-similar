
import React, { useState } from 'react';
import { Card } from './common/Card';

interface ListManagerProps {
    title: string;
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (item: string) => void;
    placeholder: string;
}

const ListManager: React.FC<ListManagerProps> = ({ title, items, onAdd, onRemove, placeholder }) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">{title}</h4>
             <form onSubmit={handleAdd} className="flex mb-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md text-sm focus:ring-brand-lightblue focus:border-brand-lightblue"
                    placeholder={placeholder}
                />
                <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md text-sm font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400">Add</button>
            </form>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border rounded-md min-h-[6rem] max-h-48 overflow-y-auto">
                {items.map(item => (
                    <span key={item} className="flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full h-fit">
                        {item}
                        <button onClick={() => onRemove(item)} className="ml-2 text-blue-600 hover:text-blue-900 font-bold">&times;</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

interface ConfigurationDashboardProps {
    companies: string[];
    keywords: string[];
    onAddCompany: (company: string) => void;
    onRemoveCompany: (company: string) => void;
    onAddKeyword: (keyword: string) => void;
    onRemoveKeyword: (keyword: string) => void;
}

export const ConfigurationDashboard: React.FC<ConfigurationDashboardProps> = ({
    companies,
    keywords,
    onAddCompany,
    onRemoveCompany,
    onAddKeyword,
    onRemoveKeyword,
}) => {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Monitoring Configuration</h3>
            <p className="text-sm text-gray-600 mb-6">Add or remove companies and keywords to customize the news feed. Changes are saved locally for your next session.</p>
            <div className="space-y-6">
                <ListManager 
                    title="Monitored Companies" 
                    items={companies} 
                    onAdd={onAddCompany} 
                    onRemove={onRemoveCompany} 
                    placeholder="Add a company..." 
                />
                <ListManager 
                    title="Monitored Keywords" 
                    items={keywords} 
                    onAdd={onAddKeyword} 
                    onRemove={onRemoveKeyword} 
                    placeholder="Add a keyword..." 
                />
            </div>
        </Card>
    );
};
