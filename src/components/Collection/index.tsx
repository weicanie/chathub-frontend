import { message } from 'antd';
import { ReactNode, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { favoriteDel } from '../../services/favor';
import { useDispatchT, useSelectorT } from '../../store';
import { favorAsyncAction } from '../../store/favor';
import { User } from '../Chat_Main';

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

export function Collection() {
	// const [favoriteList, setFavoriteList] = useState<Array<Favorite>>([]);
	const dispatch = useDispatchT();

	const favoriteList = useSelectorT(state => {
		return state['favor'].favorList;
	}, shallowEqual);

	useEffect(() => {
		//store中已有则组件重新挂载时不请求
		if (favoriteList.length > 0) return;
		dispatch(favorAsyncAction());
	}, [favoriteList.length]);

	async function delFavorite(id: number) {
		try {
			const res = await favoriteDel(id);

			if (res.status === 201 || res.status === 200) {
				message.success('删除成功');
				dispatch(favorAsyncAction());
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	function favoriteListItem(favoriteList: Array<Favorite>) {
		const toMeList: ReactNode[] = [];
		for (let i = 0; i < favoriteList.length; i++) {
			const record = favoriteList[i];
			toMeList.push(
				<li className="list-row" key={record.id}>
					<div>
						<img className="size-10 rounded-box" src={record.sender.avatar_url} />
					</div>
					<div>
						<div>{record.sender.nickName}</div>
						<div className="text-xs uppercase font-semibold opacity-60">
							{new Date(record.chatHistory.create_at).toLocaleString()}
						</div>
					</div>
					<p className="list-col-wrap text-xs">{record.chatHistory.content}</p>
					<button className="btn btn-square btn-secondary" onClick={() => delFavorite(record.id)}>
						删除
					</button>
				</li>
			);
		}
		return toMeList;
	}

	return (
		<>
			<ul className="list bg-base-100  shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide" key={-1}>
					收藏
				</li>
				{favoriteListItem(favoriteList)}
			</ul>
		</>
	);
}
