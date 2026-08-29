import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-[#090C12] border border-[rgba(255,255,255,0.06)] rounded-lg',
        className
      )}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 focus-visible:outline-none select-none cursor-pointer',
              isActive
                ? 'bg-[#131A26] text-[#E6E9ED] shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)]'
                : 'text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26]/50 border border-transparent'
            )}
          >
            {tab.icon && <span className={isActive ? 'text-[#F5A900]' : 'text-[#9AA3AD]'}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 text-[10px] font-mono rounded-full',
                  isActive
                    ? 'bg-[#F5A900]/20 text-[#F5A900] border border-[#F5A900]/30'
                    : 'bg-[#131A26] text-[#66707C]'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
