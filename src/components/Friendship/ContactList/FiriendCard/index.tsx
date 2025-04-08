import { message } from 'antd';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { FriendshipSearchResult } from '../..';
import { createOneToOne, findChatroom, friendDel } from '../../../../services/contact';

interface InfosWithKey extends FriendshipSearchResult {
	key: string;
}
type Props = PropsWithChildren<{
	info: InfosWithKey;
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
		<>
			<div className="card bg-success  w-66" id="contactList-card">
				<div className="card-body items-center text-center">
					<div className="avatar">
						<div className="w-24 rounded">
							<img src={info?.avatar_url} />
						</div>
					</div>
					<h2 className="card-title">{info?.nickName}</h2>
					<p>邮箱: {info?.email}</p>
					<div className="card-actions justify-end">
						<button
							className="btn btn-ghost"
							onClick={
								//@ts-ignore
								() => document.getElementById('delFR_1').showModal()
							}
						>
							删除
						</button>
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

			<dialog id="delFR_1" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">确认删除该好友？</h3>
					<button
						className="btn btn-secondary"
						onClick={
							//@ts-ignore
							() => {
								friendDel(info.id);
							}
						}
					>
						删除
					</button>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
export default FiriendCard;
