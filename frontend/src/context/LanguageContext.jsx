import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '../utils/dictionary';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('schemesetu_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('schemesetu_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
  };

  const t = (key, params = {}) => {
    let str = dictionary[lang]?.[key] || dictionary['en']?.[key] || key;
    if (typeof str === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach(pKey => {
        str = str.replace(new RegExp(`{\\s*${pKey}\\s*}`, 'g'), params[pKey]);
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
