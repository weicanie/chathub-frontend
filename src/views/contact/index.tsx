import { MenuProps } from 'antd';
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
	height: 800px;
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
				<ul className="menu menu-vertical lg:menu-horizontal bg-base-100 rounded-box">
					<li onClick={() => setCurkey('1')}>
						<a className={curKey === '1' ? 'menu-active w-20' : 'w-20'}>好友</a>
					</li>
					<li onClick={() => setCurkey('2')}>
						<a className={curKey === '2' ? 'menu-active w-20' : 'w-20'}>群聊</a>
					</li>
				</ul>
				{/* 嵌套路由 */}
				<Outlet></Outlet>
			</div>
			<div className="show-contact"></div>
		</ContactWrapper>
	);
}
export default Contact;
