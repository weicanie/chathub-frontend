import { Table, TabsProps, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { ReactNode, useEffect, useState } from 'react';
import { agreeFriendRequest, friendRequestList, rejectFriendRequest } from '../../services/contact';
import './index.css';

interface User {
	id: number;
	headPic: string;
	nickName: string;
	email: string;
	captcha: string;
	avatar_url: string;
}

interface FriendRequest {
	id: number;
	from: number;
	toUserId: number;
	reason: string;
	create_at: Date;
	fromUser: User;
	toUser: User;
	status: number;
}
//原来toMe和fromMe都展示,现在只展示toMe且已处理的不再展示（空时展示什么？）
export function FRNotification() {
	const [form] = useForm();
	const [fromMe, setFromMe] = useState<Array<FriendRequest>>([]);
	const [toMe, setToMe] = useState<Array<FriendRequest>>([]);
	async function queryFriendRequestList() {
		try {
			const res = await friendRequestList();
			if (res.status === 201 || res.status === 200) {
				setFromMe(
					res.data.fromMe.map((item: FriendRequest) => {
						return {
							...item,
							key: item.id
						};
					})
				);
				setToMe(
					res.data.toMe.map((item: FriendRequest) => {
						return {
							...item,
							key: item.id
						};
					})
				);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	useEffect(() => {
		queryFriendRequestList();
	}, []);
	function toMeListItem(toMe: Array<FriendRequest>) {
		const toMeList: ReactNode[] = [];
		for (let i = 0; i < toMe.length; i++) {
			const record = toMe[i];
			toMeList.push(
				<li className="list-row" key={record.id}>
					<div>
						<img className="size-10 rounded-box" src={record.fromUser.avatar_url} />
					</div>
					<div>
						<div>{record.fromUser.nickName}</div>
						<div className="text-xs uppercase font-semibold opacity-60">
							{new Date(record.create_at).toLocaleString()}
						</div>
					</div>
					<p className="list-col-wrap text-xs">{record.reason}</p>
					{record.status === 0 ? (
						<>
							<button className="btn btn-square btn-ghost" onClick={() => agree(record.from)}>
								接受
							</button>
							<button className="btn btn-square btn-ghost" onClick={() => reject(record.from)}>
								拒绝
							</button>
						</>
					) : record.status === 1 ? (
						'已通过'
					) : (
						'已拒绝'
					)}
				</li>
			);
		}
		return toMeList;
	}
	const toMeColumns: ColumnsType<FriendRequest> = [
		{
			title: '用户',
			render: (_, record) => {
				return (
					<div>
						<img src={record.fromUser.avatar_url} width={30} height={30} />
						{' ' + record.fromUser.nickName + ' 请求加你为好友'}
					</div>
				);
			}
		},
		{
			title: '理由',
			dataIndex: 'reason'
		},
		{
			title: '请求时间',
			render: (_, record) => {
				return new Date(record.create_at).toLocaleString();
			}
		},
		{
			title: '操作',
			render: (_, record) => {
				console.log(record);
				if (record.status === 0) {
					return (
						<div>
							<a href="#" onClick={() => agree(record.from)}>
								同意
							</a>
							<br />
							<a href="#" onClick={() => reject(record.from)}>
								拒绝
							</a>
						</div>
					);
				} else {
					const map: Record<string, any> = {
						1: '已通过',
						2: '已拒绝'
					};
					return <div>{map[record.status]}</div>;
				}
			}
		}
	];
	const fromMeColumns: ColumnsType<FriendRequest> = [
		{
			title: '用户',
			render: (_, record) => {
				return (
					<div>
						{' 请求添加好友 ' + record.toUser.nickName}
						<img src={record.toUser.avatar_url} width={30} height={30} />
					</div>
				);
			}
		},
		{
			title: '理由',
			dataIndex: 'reason'
		},
		{
			title: '请求时间',
			render: (_, record) => {
				return new Date(record.create_at).toLocaleString();
			}
		},
		{
			title: '状态',
			render: (_, record) => {
				const map: Record<string, any> = {
					0: '申请中',
					1: '已通过',
					2: '已拒绝'
				};
				return <div>{map[record.status]}</div>;
			}
		}
	];

	const items: TabsProps['items'] = [
		{
			key: '1',
			label: '发给我的',
			children: (
				<div style={{ width: 1000 }}>
					<Table columns={toMeColumns} dataSource={toMe} style={{ width: '1000px' }} />
				</div>
			)
		},
		{
			key: '2',
			label: '我发出的',
			children: (
				<div style={{ width: 1000 }}>
					<Table columns={fromMeColumns} dataSource={fromMe} style={{ width: '1000px' }} />
				</div>
			)
		}
	];

	const onChange = (key: string) => {
		console.log(key);
	};

	async function agree(id: number) {
		try {
			const res = await agreeFriendRequest(id); //FIXME id为空

			if (res.status === 201 || res.status === 200) {
				message.success('操作成功');
				queryFriendRequestList();
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	async function reject(id: number) {
		try {
			const res = await rejectFriendRequest(id);

			if (res.status === 201 || res.status === 200) {
				message.success('操作成功');
				queryFriendRequestList();
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	return (
		<>
			{/* <div id="notification-container">
				<div className="notification-list">
					<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
				</div>
			</div> */}
			<ul className="list bg-base-100  shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">好友申请</li>
				{toMeListItem(toMe)}
			</ul>
		</>
	);
}
