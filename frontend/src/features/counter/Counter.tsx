import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { increment, decrement, reset } from "./counterSlice";
import { useGetMeQuery } from "../auth/authApi";

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading, error } = useGetMeQuery();

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        ようこそ、{data?.username} さん
      </div>
      <h2>Reduxカウンター</h2>
      <p>今の値: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(reset())}>リセット</button>
    </div>
  );
};

export default Counter;
