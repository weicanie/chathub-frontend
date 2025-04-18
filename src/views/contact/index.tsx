import { MenuProps } from 'antd';
import cs from 'classnames';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const items: MenuProps['items'] = [
	{
		key: '1',
		label: '好友'
	},
	{
		key: '2',
		label: '群聊'
	}
];
const ContactWrapper = styled.div`
	display: flex;
	width: 1000px;
	height: 900px;
	.menu-contact {
		display: flex;
		flex-direction: column;
		width: 256px;
		overflow: visible;
		background-color: rgb(255, 255, 255);
	}
	.show-contact {
		width: ${1000 - 256}px;
		background-color: rgb(245, 246, 247);
	}
`;
function Contact() {
	const [curKey, setCurkey] = useState('1');
	const navigate = useNavigate();

	useEffect(() => {
		let path = '';
		switch (curKey) {
			case '1':
				path = 'contact/friend';
				break;
			case '2':
				path = 'contact/group';
				break;
		}
		navigate(path);
	}, [curKey]);

	useEffect(() => {
		if (location.pathname === '/contact') navigate('contact/friend');
	}, []);
	return (
		<ContactWrapper>
			<div className="menu-contact">
				<div role="tablist" className="tabs tabs-border pl-12">
					<a
						role="tab"
						className={cs('w-20', 'tab', { ['tab-active']: curKey === '1' })}
						onClick={() => setCurkey('1')}
					>
						好友
					</a>
					<a
						role="tab"
						className={cs('w-20', 'tab', { ['tab-active']: curKey === '2' })}
						onClick={() => setCurkey('2')}
					>
						群聊
					</a>
				</div>
				{/* 嵌套路由 */}
				<Outlet></Outlet>
			</div>
			<div className="show-contact"></div>
		</ContactWrapper>
	);
}
export default Contact;
