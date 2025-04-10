import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import favorReducer from './favor';

const store = configureStore({
	reducer: {
		favor: favorReducer
	}
});

// 获取 root state 的类型
type RootState = ReturnType<typeof store.getState>;
// 定义 dispatch 类型
type AppDispatch = typeof store.dispatch;
//创建一个固定了 root state 的类型的 useSelector（这样就不用每次都声明）
export const useSelectorT: TypedUseSelectorHook<RootState> = useSelector;
//固定 useDispatch 类型
export const useDispatchT: () => AppDispatch = useDispatch;

export default store;
