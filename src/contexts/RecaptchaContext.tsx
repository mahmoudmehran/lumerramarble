'use client';

import { createContext, useContext, ReactNode } from 'react';

interface RecaptchaContextType {
  siteKey: string;
  enabled: boolean;
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  siteKey: '',
  enabled: false,
});

export function RecaptchaProvider({ 
  children, 
  siteKey, 
  enabled 
}: { 
  children: ReactNode; 
  siteKey: string; 
  enabled: boolean;
}) {
  return (
    <RecaptchaContext.Provider value={{ siteKey, enabled }}>
      {children}
    </RecaptchaContext.Provider>
  );
}

export function useRecaptchaConfig() {
  return useContext(RecaptchaContext);
}
