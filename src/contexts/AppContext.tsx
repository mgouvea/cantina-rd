'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { User } from '@/types';

type AppContextState = {
  userContext: User[];
  setUserContext: React.Dispatch<React.SetStateAction<User[]>>;
};

const AppContext = createContext<AppContextState | null>(null);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<User[]>([]);

  const value = useMemo(
    () => ({
      userContext,
      setUserContext,
    }),
    [userContext]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextState => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('useApp must be used within a AppProvider');
  }

  return context;
};
