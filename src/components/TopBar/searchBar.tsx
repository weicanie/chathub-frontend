import { message } from 'antd';
import { Dispatch, PropsWithChildren, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { addMember, friendAdd } from '../../services/contact';
import { GroupResult, searchGroup, searchUser, UserResult } from '../../services/search';
import wei_ls from '../../utils/wei_ls';
type Props = PropsWithChildren<{
	curKey: string;
	setCard: Dispatch<SetStateAction<ReactNode>>;
}>;

function SearchBar({ curKey, setCard }: Props) {
	console.log('🚀 ~ SearchBar ~ curKey:', curKey);
	const [groupResult, setGroupResult] = useState<Array<GroupResult>>([]);
	const [userResult, setUserResult] = useState<Array<UserResult>>([]);
	const [name, setName] = useState<string>('');
	const [userIndex, setUserIndex] = useState<number>(-1);
	console.log('🚀 ~ SearchBar ~ userIndex:', userIndex);
	const [groupIndex, setGroupIndex] = useState<number>(-1);
	console.log('🚀 ~ SearchBar ~ groupIndex:', groupIndex);
	//根据名字搜索群聊、用户
	const getGroupList = async () => {
		try {
			const res = await searchGroup(name);
			//TODO 只设置成201、200是否不够
			//TODO 集中错误管理
			if (res.status === 201 || res.status === 200) {
				setGroupResult(res.data);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};
	const getUserList = async () => {
		try {
			const res = await searchUser(name);

			if (res.status === 201 || res.status === 200) {
				setUserResult(res.data);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};

	useEffect(() => {
		if (name === '') return;
		getUserList();
		getGroupList();
	}, [name]);

	useEffect(() => {
		if (curKey === '1') {
			if (groupIndex !== -1) setGroupIndex(-1);
		} else {
			if (userIndex !== -1) setUserIndex(-1);
		}
	}, [curKey]);

	useEffect(() => {
		setCardOnClick();
	}, [userIndex, groupIndex]);

	function setCardOnClick() {
		if (curKey === '1') {
			if (userIndex === -1) return;
			const info: UserResult = userResult[userIndex];
			setCard(
				<div className="card bg-success  w-66" id="contactList-card">
					<div className="card-body items-center text-center">
						<div className="avatar">
							<div className="w-24 rounded">
								<img src={info?.avatar_url!} />
							</div>
						</div>
						<h2 className="card-title">{info?.nickName}</h2>
						<p>邮箱: {info?.email}</p>
					</div>
				</div>
			);
		} else {
			if (groupIndex === -1) return;
			const info: GroupResult = groupResult[groupIndex];
			setCard(
				<div className="card bg-success  w-66" id="contactList-card">
					<div className="card-body items-center text-center">
						<div className=" bg-neutral text-neutral-content w-24 h-24 rounded-full">
							<span className="text-3xl">{info?.name.substring(0, 1)}</span>
						</div>
						<h2 className="card-title">{info?.name}</h2>
						<p>群号: {info?.id}</p>
						<p>成立时间: {new Date(info?.create_at).toLocaleDateString()}</p>
					</div>
				</div>
			);
		}
	}
	let list: ReactNode =
		curKey === '1' ? (
			<>
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide" key={-1}>
					用户查询结果
				</li>
				{userResult.map((user, index) => (
					<li className="list-row" key={user.id} onClick={e => setUserIndex(index)}>
						<div className="avatar">
							<div className="w-10 h-10 rounded">
								<img src={user?.avatar_url!} />
							</div>
						</div>
						<div className="ml-3">{user.nickName}</div>
						<button
							className="btn btn-square btn-secondary"
							onClick={async () => {
								try {
									const res = await friendAdd({
										reason: '想添加你为好友',
										username: user.username
									});

									if (res.status === 201 || res.status === 200) {
										message.success('好友申请已发送');
									}
								} catch (e: any) {
									message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
								}
							}}
						>
							添加
						</button>
					</li>
				))}
			</>
		) : (
			<>
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide" key={-1}>
					群聊查询结果
				</li>
				{groupResult.map((group, index) => (
					<li className="list-row" key={group.id} onClick={e => setGroupIndex(index)}>
						<div className=" bg-neutral text-neutral-content w-10">
							<span className="text-xl">{group.name.substring(0, 1)}</span>
						</div>
						<div className="ml-3">{group.name}</div>
						<button
							className="btn btn-square btn-secondary"
							onClick={async () => {
								try {
									const res = await addMember(group.id, wei_ls.getFromLS('userInfo')?.username);
									if (res.status === 201 || res.status === 200) {
										message.success('加入群聊成功');
									}
								} catch (e: any) {
									message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
								}
							}}
						>
							加入
						</button>
					</li>
				))}
			</>
		);

	return (
		<>
			<label className="input mb-1">
				<svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						strokeLinejoin="round"
						strokeLinecap="round"
						strokeWidth="2.5"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</g>
				</svg>
				<input
					type="search"
					className="grow"
					placeholder="搜索"
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</label>

			<ul className="list bg-base-100 shadow-md">{list}</ul>
		</>
	);
}
export default SearchBar;
