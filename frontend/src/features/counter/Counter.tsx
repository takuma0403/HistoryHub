import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../app/store'
import { increment, decrement, reset } from './counterSlice'

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Reduxカウンター</h2>
      <p>今の値: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(reset())}>リセット</button>
    </div>
  )
}

export default Counter
