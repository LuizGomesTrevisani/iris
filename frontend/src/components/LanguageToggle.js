import React from 'react';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    changeLanguage(newLanguage);
  };
  
  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="border-slate-600 text-slate-300 hover:bg-slate-800 px-3 py-2 rounded-lg flex items-center space-x-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === 'pt' ? 'EN' : 'PT'}
      </span>
    </Button>
  );
};
