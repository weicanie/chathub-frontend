import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { User } from '../components/Chat_Main';
import { queryFavoriteList } from '../services/favor';

interface Favorite {
	id: number;
	chatHistory: {
		id: number;
		content: string;
		type: number;
		create_at: Date;
	};
	sender: User;
}

const initialState: {
	favorList: Favorite[];
} = {
	favorList: []
};

const favorAsyncAction = createAsyncThunk('favor!!!', async () => {
	try {
		const res = await queryFavoriteList();
		const favorList = res.data.map((item: Favorite) => {
			return {
				...item,
				key: item.id,
				//@ts-ignore
				chatHistory: item.chatRecord
			};
		});
		return favorList;
	} catch (e: any) {
		message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
	}
});

const slice = createSlice({
	name: 'favor',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(favorAsyncAction.fulfilled, (state, { payload }) => {
			//直接修改state的Proxy, RTK内部实现state的新建
			state.favorList = payload;
		});
	}
});

const favorReducer = slice.reducer;
export default favorReducer;
export { favorAsyncAction };
