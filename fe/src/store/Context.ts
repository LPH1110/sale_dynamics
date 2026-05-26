import { createContext, Dispatch } from 'react';
import { StoreState, StoreAction } from './reducer';

export type StoreContextType = [StoreState, Dispatch<StoreAction>];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export default StoreContext;
