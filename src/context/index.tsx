
import React, { createContext, useContext } from 'react';

export const AppContext = createContext({});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

