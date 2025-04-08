import { Menu as AntdMenu, MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { LoginMain } from '../components/Login_Main';
import { RegisterMain } from '../components/Register_Main';
import { UpdatePassword } from '../components/Register_Main/UpdatePassword';
import routes from '../router';
import './APP.css';
const AppWrapper = styled.div`
	/* 取消antd表单项前的'*' */
	label::before {
		display: none !important;
	}

	width: 80%;
	min-width: 1088px;
	max-width: 1088px;
	height: 80%;
	min-height: 900px;
	max-height: 900px;

	margin-top: 100px;

	position: relative;
	left: 50%;
	transform: translate(-50%);

	.window-container {
		#menu-container {
			display: flex;
		}
		#menu-container .menu-area {
			width: 90px;
			height: 900px;
			background-color: #fff;
		}
	}
`;

function APP() {
	const [headPic, setHeadPic] = useState();

	useEffect(() => {
		const userInfo = localStorage.getItem('userInfo');
		if (userInfo) {
			const info = JSON.parse(userInfo);
			setHeadPic(info.avatar_url ?? info.headPic);
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
			label: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M22.5 2V18H6.87574L1.5 22.7038V2H22.5ZM11 11H13.0039V8.99609H11V11ZM6 11H8.00391L8.00391 8.99609H6L6 11ZM16 11H18.0039V8.99609H16V11Z"
						fill="black"
					/>
				</svg>
			)
		},
		{
			key: '3',
			label: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M23 12C23 15.3454 21.5066 18.3421 19.15 20.3595C17.2272 22.0057 14.7297 23 12 23C9.2703 23 6.77283 22.0057 4.85 20.3595C2.49344 18.3421 1 15.3454 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM16 8.5C16 6.29086 14.2091 4.5 12 4.5C9.79086 4.5 8 6.29086 8 8.5C8 10.7091 9.79086 12.5 12 12.5C14.2091 12.5 16 10.7091 16 8.5ZM18.5 18.225V18C18.5 15.7909 16.7091 14 14.5 14H9.5C7.29086 14 5.5 15.7909 5.5 18V18.225C5.70642 18.4405 5.92348 18.6457 6.15034 18.8399C7.72404 20.1872 9.76583 21 12 21C14.2342 21 16.276 20.1872 17.8497 18.8399C18.0765 18.6457 18.2936 18.4405 18.5 18.225Z"
						fill="black"
					/>
				</svg>
			)
		},
		{
			key: '4',
			label: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 0C7.58172 0 4 3.58172 4 8V12.6972L2 15.6972V20H22V15.6972L20 12.6972V8C20 3.58172 16.4183 0 12 0Z"
						fill="black"
					/>
					<path
						d="M11.9996 23.5C10.4141 23.5 9.07481 22.4457 8.64453 21H15.3547C14.9244 22.4457 13.5851 23.5 11.9996 23.5Z"
						fill="black"
					/>
				</svg>
			)
		},
		{
			key: '5',
			label: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.0008 0.630371L14.9034 8.98093L23.7422 9.16105L16.6973 14.5021L19.2574 22.964L12.0008 17.9144L4.74412 22.964L7.30416 14.5021L0.259277 9.16105L9.0981 8.98093L12.0008 0.630371Z"
						fill="black"
					/>
				</svg>
			)
		},
		{
			key: '6',
			label: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM13 13V17.5H11V13H6.5V11H11V6.5H13V11H17.5V13H13Z"
						fill="black"
					/>
				</svg>
			)
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
			case '6':
				path = 'add';
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
		} else if (location.pathname.startsWith('/add')) {
			return ['6'];
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
			{/* 登录、注册、修改密码弹出的modal */}
			<dialog id="login_modal" className="modal">
				<div className="modal-box">
					<LoginMain></LoginMain>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>

			<dialog id="regist_modal" className="modal">
				<div className="modal-box">
					<RegisterMain></RegisterMain>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>

			<dialog id="updatepw_modal" className="modal">
				<div className="modal-box">
					<UpdatePassword></UpdatePassword>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</AppWrapper>
	);
}
export default APP;
