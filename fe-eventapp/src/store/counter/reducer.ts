import { CounterState } from "./types";
import { CounterAction, INCREMENT, DECREMENT } from "./actions";


const initialState: CounterState = {
    value: 0,
  };

  export const counterReducer = (state = initialState, action: CounterAction) : CounterState => {
    switch(action.type) {
        case INCREMENT:
            return { ...state, value: state.value + action.payload.incrementBy };
        case DECREMENT:
            return { ...state, value: state.value - action.payload.decrementBy };
        default:
            return state;
        
    }
  }