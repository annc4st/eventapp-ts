export const INCREMENT = "counter/INCREMENT" as const;
export const DECREMENT = "counter/DECREMENT" as const;

/* Redux action creator, which is just a helper function returning the action, 
and we can export it to further dispatch the associated action to the store as needed:*/
export const increment = (numberToIncrement: number = 1) => ({
    type: INCREMENT,
    payload: {
      incrementBy: numberToIncrement,
    },
  });

  export const decrement = (numberToDecrement: number = 1) => ({
    type: DECREMENT,
    payload: {
      decrementBy: numberToDecrement,
    },
  });
  

  export type CounterAction =
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>;