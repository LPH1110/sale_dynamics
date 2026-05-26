import React, { useReducer } from 'react';
import reducer, { initState } from './reducer';
import StoreContext from './Context';
import logger from './logger';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(logger(reducer), initState);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
