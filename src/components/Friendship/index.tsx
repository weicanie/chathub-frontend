import { message } from 'antd';
import { useEffect, useState } from 'react';
import { friendshipList } from '../../services/contact';
import ContactList from './ContactList';
import './index.css';

export interface FriendshipSearchResult {
	groupName: string; //分组名
	id: number;
	username: string;
	nickName: string;
	headPic: string;
	email: string;
	avatar_url: string;
}

export function Friendship() {
	const [friendshipResult, setFriendshipResult] = useState<Array<FriendshipSearchResult>>([]);

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

	return <ContactList></ContactList>;
}
