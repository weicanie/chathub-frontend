import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupSearchResult } from '../..';

type Props = PropsWithChildren<{
	info: GroupSearchResult;
}>;
function GroupCard(props: Props) {
	const { info } = props;
	const navigate = useNavigate();

	console.log('info', info);
	//TODO 跳转聊天时同步侧边栏状态,redux
	//FIXME create_at字段定义成Date类型, 但其是string,需要new Date()
	return (
		<div className="card bg-accent  w-66" id="contactList-card">
			<div className="card-body items-center text-center">
				<div className=" bg-indigo-900 text-neutral-content w-10 rounded-full">
					<span className="text-3xl">{info?.name.substring(0, 1)}</span>
				</div>
				<h2 className="card-title">{info?.name}</h2>
				<p>成员数: {info?.userCount}</p>
				<p>成立时间: {new Date(info?.create_at).toLocaleDateString()}</p>
				<div className="card-actions justify-end">
					<button className="btn btn-ghost">分享</button>
					<button
						className="btn btn-primary"
						onClick={() => {
							navigate('/chat', {
								state: {
									chatroomId: info?.id
								}
							});
						}}
					>
						聊天
					</button>
				</div>
			</div>
		</div>
	);
}
export default GroupCard;
