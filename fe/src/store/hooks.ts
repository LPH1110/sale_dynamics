import { useContext } from 'react';
import StoreContext, { StoreContextType } from './Context';

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
