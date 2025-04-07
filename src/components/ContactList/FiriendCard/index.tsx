import { message } from 'antd';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfosFromKey } from '..';
import { createOneToOne, findChatroom } from '../../../services/contact';
type Props = PropsWithChildren<{
	info: InfosFromKey;
}>;
function FiriendCard(props: Props) {
	const { info } = props;
	const navigate = useNavigate();
	async function goToChat(friendId: number) {
		const userId = JSON.parse(localStorage.getItem('userInfo')!)?.id;
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
	console.log('info', info);
	return (
		<div className="card bg-accent  w-66" id="contactList-card">
			<div className="card-body items-center text-center">
				<div className="avatar">
					<div className="w-24 rounded">
						<img src={info?.avatar_url} />
					</div>
				</div>
				<h2 className="card-title">{info?.nickName}</h2>
				<p>邮箱: {info?.email}</p>
				<div className="card-actions justify-end">
					<button className="btn btn-ghost">分享</button>
					<button
						className="btn btn-primary"
						onClick={() => {
							goToChat(info?.id);
						}}
					>
						聊天
					</button>
				</div>
			</div>
		</div>
	);
}
export default FiriendCard;
