import { Menu, message } from 'antd';
import { MenuProps } from 'rc-menu';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GroupSearchResult } from '..';
import { chatroomList } from '../../../services/contact';
import GroupCard from './GroupCard';
interface InfosWithKey extends GroupSearchResult {
	key: string;
}
type MenuItem = Required<MenuProps>['items'][number];
const Wrapper = styled.div`
	display: flex;
	position: relative;
	.card-container {
		position: absolute;
		left: 400px;
	}
`;
function GroupList() {
	const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([]);
	const [current, setCurrent] = useState('1');
	const [items, setItems] = useState<MenuItem[]>([]);
	const [infosFromKey, setInfosFromKey] = useState<InfosWithKey[]>([]);

	const getGroupList = async () => {
		try {
			const res = await chatroomList();

			if (res.status === 201 || res.status === 200) {
				const groupResult: GroupSearchResult[] = res.data
					.filter((item: GroupSearchResult) => {
						return item.type === true;
					})
					.map((item: GroupSearchResult) => {
						return {
							...item,
							key: item.id
						};
					});
				//结果分组（暂时没有群主和管理员）
				const finalItems: {
					key: string;
					label: string;
					icon: ReactNode;
					children: { key: string; label: ReactNode }[];
				}[] = [
					{
						key: '我加入的群聊',
						label: '我加入的群聊',
						icon: '',
						children: []
					},
					{
						key: '我管理的群聊',
						label: '我管理的群聊',
						icon: '',
						children: []
					}
				];
				const infosWithKey = groupResult.map((group, index) => ({ ...group, key: index + 1 + '' }));
				finalItems[0].children = groupResult.map((group, index) => ({
					key: index + 1 + '',
					label: group.name
				}));
				setItems(finalItems);
				setInfosFromKey(infosWithKey);
				setGroupResult(groupResult);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};
	const onClick: MenuProps['onClick'] = e => {
		console.log('click ', e);
		setCurrent(e.key);
	};
	useEffect(() => {
		getGroupList();
	}, []);
	return (
		<Wrapper>
			<Menu
				onClick={onClick}
				style={{ width: 256 }}
				defaultOpenKeys={['我加入的群聊', '1']}
				selectedKeys={[current]}
				mode="inline"
				items={items}
				id="contactList-menu"
			/>
			<div className="card-container">
				<GroupCard info={infosFromKey.filter(_ => _.key === current)?.[0]}></GroupCard>
			</div>
		</Wrapper>
	);
}
export default GroupList;
