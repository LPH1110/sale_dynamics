import { StoreState, StoreAction } from './reducer';

export default function logger(reducer: (state: StoreState, action: StoreAction) => StoreState) {
  return (prevState: StoreState, action: StoreAction): StoreState => {
    console.group(action.type);

    console.log('Prev state: ', prevState);
    console.log('Action: ', action);

    const nextState = reducer(prevState, action);

    console.log('Next state: ', nextState);
    console.groupEnd();

    return nextState;
  };
}
