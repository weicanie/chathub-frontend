import { Table, Tabs, TabsProps, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { agreeFriendRequest, friendRequestList, rejectFriendRequest } from '../../services/contact';
import './index.css';

interface User {
	id: number;
	headPic: string;
	nickName: string;
	email: string;
	captcha: string;
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

export function FRNotification() {
	const [form] = useForm();
	const [fromMe, setFromMe] = useState<Array<FriendRequest>>([]);
	const [toMe, setToMe] = useState<Array<FriendRequest>>([]);

	async function queryFriendRequestList() {
		try {
			const res = await friendRequestList();
			console.log(res);
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

	const onChange = (key: string) => {
		console.log(key);
	};

	const toMeColumns: ColumnsType<FriendRequest> = [
		{
			title: '用户',
			render: (_, record) => {
				return (
					<div>
						<img src={record.fromUser.headPic} width={30} height={30} />
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

	const fromMeColumns: ColumnsType<FriendRequest> = [
		{
			title: '用户',
			render: (_, record) => {
				return (
					<div>
						{' 请求添加好友 ' + record.toUser.nickName}
						<img src={record.toUser.headPic} width={30} height={30} />
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

	return (
		<div id="notification-container">
			<div className="notification-list">
				<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
			</div>
		</div>
	);
}
