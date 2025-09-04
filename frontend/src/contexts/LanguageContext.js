import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  // Função para detectar geolocalização
  const detectLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('en'); // Default para inglês se geolocalização não disponível
        return;
      }

      // Timeout para detectar localização em 5 segundos
      const timeoutId = setTimeout(() => {
        resolve('en'); // Default para inglês se timeout
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;
            
            // Usar API de geocoding reverso para detectar país
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            
            if (response.ok) {
              const data = await response.json();
              const countryCode = data.countryCode;
              
              // Se for Brasil (BR) ou Portugal (PT), usar português
              if (countryCode === 'BR' || countryCode === 'PT') {
                resolve('pt');
              } else {
                resolve('en');
              }
            } else {
              resolve('en');
            }
          } catch (error) {
            console.error('Erro ao detectar localização:', error);
            resolve('en');
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Erro de geolocalização:', error);
          resolve('en');
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  };

  // Inicializar idioma baseado na localização
  useEffect(() => {
    const initializeLanguage = async () => {
      // Verificar se já existe preferência salva
      const savedLanguage = localStorage.getItem('language');
      
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        // Detectar baseado na localização
        const detectedLanguage = await detectLocation();
        setLanguage(detectedLanguage);
        localStorage.setItem('language', detectedLanguage);
      }
      
      setLoading(false);
    };

    initializeLanguage();
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const value = {
    language,
    changeLanguage,
    loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
