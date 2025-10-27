import React from 'react';

interface Tab {
    name: string;
    href: string;
    current: boolean;
}

interface TabsProps {
    tabs: Tab[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">Select a tab</label>
                <select id="tabs" name="tabs" className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    {tabs.map((tab) => <option key={tab.name}>{tab.name}</option>)}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a key={tab.name} href={tab.href} className={classNames(tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm')} aria-current={tab.current ? 'page' : undefined}>
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};
