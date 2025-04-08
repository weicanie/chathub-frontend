import { Group } from '@/components/Group';
import { Navigate } from 'react-router-dom';
import { Friendship } from '../components/Friendship';
import Add from '../views/add';
import Chat from '../views/chat';
import Contact from '../views/contact';
import MoreApps from '../views/more_apps';
import Notification from '../views/notification';
import Self from '../views/self';
const routes = [
	{
		path: '/',
		element: <Navigate to="chat" />
	},
	{
		path: 'chat',
		element: <Chat />
	},
	{
		path: 'contact',
		element: <Contact />,
		children: [
			{
				path: 'contact/friend', //FIXME URL显示 http://localhost:5174/contact/contact/group
				element: <Friendship />
			},
			{
				path: 'contact/group',
				element: <Group />
			}
		]
	},
	{
		path: 'self',
		element: <Self />
	},
	{
		path: 'notification',
		element: <Notification />
	},
	{
		path: 'moreapps',
		element: <MoreApps />
	},
	{
		path: 'add',
		element: <Add />
	}
	// {
	// 	path: 'register',
	// 	element: <Regist />
	// },
	// {
	// 	path: 'login',
	// 	element: <Login />
	// },
	// {
	// 	path: 'update_password',
	// 	element: <UpdatePassword />
	// }
];
export default routes;
