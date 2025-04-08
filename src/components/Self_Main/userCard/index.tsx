import { PropsWithChildren } from 'react';
import { User } from '../../Chat_Main';

type Props = PropsWithChildren<{
	info: User;
	onClick: () => void; //转换成编辑卡片
}>;

function UserCard(props: Props) {
	const { info, onClick } = props;
	return (
		<div className="card bg-accent  w-66" id="contactList-card">
			<div className="card-body items-center text-center">
				<div className="avatar">
					<div className="w-24 rounded">
						<img src={info?.avatar_url ?? info?.headPic} />
					</div>
				</div>
				<h2 className="card-title">{info?.nickName}</h2>
				<p>邮箱: {info?.email}</p>
				<div className="card-actions justify-end">
					<button className="btn btn-ghost">退出登录</button>
					<button className="btn btn-primary" onClick={onClick}>
						修改信息
					</button>
				</div>
			</div>
		</div>
	);
}
export default UserCard;
