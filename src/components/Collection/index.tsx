import { Popconfirm, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactNode, useEffect, useState } from 'react';
import { favoriteDel, queryFavoriteList } from '../../services/favor';
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
	const [favoriteList, setFavoriteList] = useState<Array<Favorite>>([]);
	console.log('🚀 ~ Collection ~ favoriteList:', favoriteList);
	const columns: ColumnsType<Favorite> =
		favoriteList.length > 0
			? [
					{
						title: 'ID',
						dataIndex: 'id'
					},
					{
						title: '内容',
						render: (_, record) =>
							record && (
								<div>
									{record.chatHistory.type === 0 ? (
										record.chatHistory.content
									) : record.chatHistory.type === 1 ? (
										<img src={record.chatHistory.content} style={{ maxHeight: 200 }} />
									) : (
										<a href={record.chatHistory.content} download>
											{record.chatHistory.content}
										</a>
									)}
								</div>
							)
					},
					{
						title: '发表时间',
						render: (_, record) => (
							<div>{new Date(record.chatHistory.create_at).toLocaleString()}</div>
						)
					},
					{
						title: '操作',
						render: (_, record) => (
							<div>
								<Popconfirm
									title="删除收藏"
									description="确认删除吗？"
									onConfirm={() => delFavorite(record.id)}
									okText="Yes"
									cancelText="No"
								>
									<a href="#">删除</a>
								</Popconfirm>
							</div>
						)
					}
				]
			: [];

	async function delFavorite(id: number) {
		try {
			const res = await favoriteDel(id);

			if (res.status === 201 || res.status === 200) {
				message.success('删除成功');
				query();
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	const query = async () => {
		try {
			const res = await queryFavoriteList();

			if (res.status === 201 || res.status === 200) {
				setFavoriteList(
					res.data.map((item: Favorite) => {
						return {
							...item,
							key: item.id,
							//@ts-ignore
							chatHistory: item.chatRecord
						};
					})
				);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};

	useEffect(() => {
		query();
	}, []);
	//FIXME 收藏删除功能异常：无法收藏
	function favoriteListItem(favoriteList: Array<Favorite>) {
		const toMeList: ReactNode[] = [];
		for (let i = 0; i < favoriteList.length; i++) {
			const record = favoriteList[i];
			toMeList.push(
				<li className="list-row">
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
			{/* <div id="friendship-container">
			<div className="favorite-table">
				<Table columns={columns} dataSource={favoriteList} style={{ width: '1000px' }} />
			</div>
		</div> */}
			<ul className="list bg-base-100  shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">收藏</li>
				{favoriteListItem(favoriteList)}
			</ul>
		</>
	);
}
