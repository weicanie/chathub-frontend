import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOneToOne, findChatroom, friendshipList } from '../../services/contact';
import ContactList from '../ContactList';
import { AddFriendModal } from './AddFriendModal';
import './index.css';

interface User {
	id: number;
	email: string;
	headPic: string;
	nickName: string;
	username: string;
	create_at: Date;
}

interface SearchFriend {
	name: string;
}

export interface FriendshipSearchResult {
	groupName: string; //分组名
	id: number;
	username: string;
	nickName: string;
	headPic: string;
	email: string;
	avatar_url: string;
}

function getUserInfo(): User {
	return JSON.parse(localStorage.getItem('userInfo')!);
}

export function Friendship() {
	const [friendshipResult, setFriendshipResult] = useState<Array<FriendshipSearchResult>>([]);
	const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);
	const navigate = useNavigate();

	// 点击私聊好友后跳转到聊天室
	async function goToChat(friendId: number) {
		const userId = getUserInfo().id;
		try {
			const res = await findChatroom(userId, friendId);

			if (res.data) {
				navigate('/chat', {
					state: {
						chatroomId: res.data
					}
				});
			} else {
				const res2 = await createOneToOne(friendId);
				navigate('/chat', {
					state: {
						chatroomId: res2.data
					}
				});
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	const columns: ColumnsType<FriendshipSearchResult> = [
		{
			title: 'ID',
			dataIndex: 'id'
		},
		{
			title: '用户名',
			dataIndex: 'username'
		},
		{
			title: '昵称',
			dataIndex: 'nickName'
		},
		{
			title: '头像',
			render: (_, record) => (
				<div>
					<img src={record.headPic} id="friendHeadpic" />
				</div>
			)
		},
		{
			title: '邮箱',
			dataIndex: 'email'
		},
		{
			title: '操作',
			render: (_, record) => (
				// antd table组件的render函数：
				// render(当前单元格的值, 当前行数据, 当前行索引): 组件 (渲染在对应的table cell里)
				<div>
					<a
						href="#"
						onClick={() => {
							goToChat(record.id);
						}}
					>
						聊天
					</a>
				</div>
			)
		}
	];

	const searchFriend = async () => {
		try {
			const res = await friendshipList();

			if (res.status === 201 || res.status === 200) {
				//获取到各分组的好友列表
				let allGroupFriendList = res.data;
				//暂时不定义服务器返回字段的类型
				let friendList: FriendshipSearchResult[] = [];
				for (let group of allGroupFriendList) {
					let groupName = group.name;
					//@ts-ignore
					group.friend.forEach(_ => {
						_.groupName = groupName;
						_.headPic = _.avatar_url;
					});
					//@ts-ignore
					friendList = friendList.concat(group.friend);
				}
				setFriendshipResult(
					friendList.map((item: FriendshipSearchResult) => {
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
	};

	useEffect(() => {
		searchFriend();
	}, []);

	const [form] = useForm();
	//TODO 搜索和添加功能移到全局
	return <ContactList></ContactList>;
	return (
		<div id="friendship-container">
			<div className="friendship-form">
				<Form form={form} onFinish={searchFriend} name="search" layout="inline" colon={false}>
					<Form.Item label="名称" name="name">
						<Input />
					</Form.Item>

					<Form.Item label=" ">
						<Button type="primary" htmlType="submit">
							搜索
						</Button>
					</Form.Item>
					<Form.Item label=" ">
						<Button
							type="primary"
							style={{ background: 'green' }}
							onClick={() => setAddFriendModalOpen(true)}
						>
							添加好友
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className="friendship-table">
				{/* 				<Table columns={columns} dataSource={friendshipResult} style={{ width: '1000px' }} /> */}
			</div>
			<AddFriendModal
				isOpen={isAddFriendModalOpen}
				handleClose={() => {
					setAddFriendModalOpen(false);
				}}
			/>
		</div>
	);
}
