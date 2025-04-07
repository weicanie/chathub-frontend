import { Menu as AntdMenu, MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import routes from '../router';
import './APP.css';

const AppWrapper = styled.div`
	width: 80%;
	min-width: 1088px;
	max-width: 1088px;
	height: 80%;
	min-height: 900px;
	max-height: 900px;

	margin-top: 100px;

	border: 2px solid #8e3f3f;
	position: relative;
	left: 50%;
	transform: translate(-50%);

	.window-container {
		/* background-color: #8e3f3f; */
		#menu-container {
			display: flex;
		}
		#menu-container .menu-area {
			width: 90px;
		}
	}
`;

function APP() {
	const [headPic, setHeadPic] = useState();

	useEffect(() => {
		const userInfo = localStorage.getItem('userInfo');
		if (userInfo) {
			const info = JSON.parse(userInfo);
			setHeadPic(info.headPic);
		}
	}, []);
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: '',
			icon: (
				<div className="avatar">
					<div className="w-9 rounded-full">
						<img src={headPic} />
					</div>
				</div>
			)
		},
		{
			key: '2',
			label: '聊天'
		},
		{
			key: '3',
			label: '联系人'
		},
		{
			key: '4',
			label: '通知'
		},
		{
			key: '5',
			label: '收藏'
		}
	];
	const navigate = useNavigate();
	const handleMenuItemClick = (info: { key: string }) => {
		let path = '';
		switch (info.key) {
			case '1':
				path = 'self';
				break;
			case '2':
				path = 'chat';
				break;
			case '3':
				path = 'contact';
				break;
			case '4':
				path = 'notification';
				break;
			case '5':
				path = 'moreapps';
				break;
		}
		navigate(path);
	};
	function getSelectedKeys() {
		if (location.pathname.startsWith('/self')) {
			return ['1'];
		} else if (location.pathname.startsWith('/chat')) {
			return ['2'];
		} else if (location.pathname.startsWith('/contact')) {
			return ['3'];
		} else if (location.pathname.startsWith('/notification')) {
			return ['4'];
		} else if (location.pathname.startsWith('/moreapps')) {
			return ['5'];
		} else {
			return ['2']; // '/'
		}
	}
	return (
		<AppWrapper>
			<div className="window-container">
				<div id="menu-container">
					<div className="menu-area">
						<AntdMenu
							defaultSelectedKeys={getSelectedKeys()}
							items={items}
							onClick={handleMenuItemClick}
						/>
					</div>
					{/* 第一层路由 */}
					<div className="content-area">{useRoutes(routes)}</div>
				</div>
			</div>
		</AppWrapper>
	);
}
export default APP;
