import React from 'react';

interface SectionHeaderProps {
  step: number;
  title: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ step, title, action }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold">
      {step}
    </span>
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {action}
  </div>
);
