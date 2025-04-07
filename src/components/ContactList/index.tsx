import type { MenuProps } from 'antd';
import { Menu, message } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { friendshipList } from '../../services/contact';
import { FriendshipSearchResult } from '../Friendship';
import FiriendCard from './FiriendCard';

const Wrapper = styled.div`
	display: flex;
	position: relative;
	.card-container {
		position: absolute;
		left: 400px;
	}
`;

type MenuItem = Required<MenuProps>['items'][number];
interface InfosWithKey extends FriendshipSearchResult {
	key: string;
}
enum friendGroupName {
	default = '我的好友',
	friend = '朋友',
	family = '家人',
	schoolmate = '同学',
	favorite = '特别关心'
}
const ContactList: React.FC = () => {
	const [friendshipResult, setFriendshipResult] = useState<Array<FriendshipSearchResult>>([]);
	const [current, setCurrent] = useState('1');
	const [friendItems, setFriendItems] = useState<MenuItem[]>([]);
	const [infosFromKey, setInfosFromKey] = useState<InfosWithKey[]>([]);

	const getFriendList = async () => {
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
				//结果分组
				const defaultList = friendList.filter(_ => _.groupName === friendGroupName.default);
				const friends = friendList.filter(_ => _.groupName === friendGroupName.friend);
				const familyList = friendList.filter(_ => _.groupName === friendGroupName.family);
				const schoolmateList = friendList.filter(_ => _.groupName === friendGroupName.schoolmate);
				const favoriteList = friendList.filter(_ => _.groupName === friendGroupName.favorite);
				//转化成item
				const groupItems = [defaultList, friends, familyList, schoolmateList, favoriteList];
				let cnt = 1; //生成 key
				const finalItems: {
					key: string;
					label: string;
					icon: ReactNode;
					children: { key: string; label: ReactNode }[];
				}[] = [];
				for (let groupName of [
					friendGroupName.default,
					friendGroupName.friend,
					friendGroupName.family,
					friendGroupName.schoolmate,
					friendGroupName.favorite
				]) {
					finalItems.push({
						key: groupName,
						label: groupName,
						icon: '',
						children: []
					});
				}
				//记录信息对应到卡片
				const infosFromKey: InfosWithKey[] = [];
				for (let i = 0; i < groupItems.length; i++) {
					for (let friend of groupItems[i]) {
						finalItems[i].children.push({ key: '' + cnt, label: friend.nickName });
						infosFromKey.push({ ...friend, key: '' + cnt });
						cnt++;
					}
				}
				console.log('finalItems', finalItems);
				console.log('infosFromKey', infosFromKey);
				setFriendItems(finalItems);
				setInfosFromKey(infosFromKey);
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
			console.log('e', e);
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};

	useEffect(() => {
		getFriendList();
	}, []);

	const onClick: MenuProps['onClick'] = e => {
		console.log('click ', e);
		setCurrent(e.key);
	};

	return (
		<Wrapper>
			<Menu
				onClick={onClick}
				style={{ width: 256 }}
				defaultOpenKeys={['我的好友', '1']}
				selectedKeys={[current]}
				mode="inline"
				items={friendItems}
				id="contactList-menu"
			/>
			<div className="card-container">
				<FiriendCard info={infosFromKey.filter(_ => _.key === current)?.[0]}></FiriendCard>
			</div>
		</Wrapper>
	);
};

export default ContactList;
