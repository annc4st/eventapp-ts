
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counter/actions';
import { selectCount } from '../store/counter/selectors';

export const Counter = () => {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Count + 1</button>
      <button onClick={() => dispatch(decrement())}>Count - 1</button>
      <button onClick={() => dispatch(decrement(5))}>Count + 5</button>
      <button onClick={() => dispatch(decrement(5))}>Count - 5</button>
    </div>
  );
};