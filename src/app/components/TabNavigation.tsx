import React from 'react';
import { Camera, Shield } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'totp', label: 'Authenticator', icon: Shield },
  { id: 'camera', label: 'Camera', icon: Camera },
];

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === id
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </div>
  );
} 