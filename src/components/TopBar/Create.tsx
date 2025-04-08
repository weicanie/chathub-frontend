import { useState } from 'react';
import styled from 'styled-components';
import { AddFriendModal } from '../Friendship/AddFriendModal';
import { CreateGroupModal } from '../Group/CreateGroupModal';
import { JoinGroupModal } from '../Group/JoinGroupModal';
const Wrapper = styled.div`
	position: relative;
	#container {
		position: absolute;
		left: 200px;
		top: -43px;
	}
`;
function Create() {
	const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);
	const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
	const [isJoinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
	return (
		<Wrapper>
			<AddFriendModal
				isOpen={isAddFriendModalOpen}
				handleClose={() => {
					setAddFriendModalOpen(false);
				}}
			/>
			<CreateGroupModal
				isOpen={isCreateGroupModalOpen}
				handleClose={() => {
					setCreateGroupModalOpen(false);
				}}
			/>
			<JoinGroupModal
				isOpen={isJoinGroupModalOpen}
				handleClose={() => {
					setJoinGroupModalOpen(false);
				}}
			/>
			<div id="container">
				<div className="dropdown">
					<div tabIndex={0} role="button" className="btn m-1">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12.0001 3.00488C7.02956 3.00488 3.00012 7.03432 3.00012 12.0049C3.00012 16.9754 7.02956 21.0049 12.0001 21.0049C16.9707 21.0049 21.0001 16.9754 21.0001 12.0049C21.0001 7.03432 16.9707 3.00488 12.0001 3.00488ZM1.00012 12.0049C1.00012 5.92975 5.92499 1.00488 12.0001 1.00488C18.0753 1.00488 23.0001 5.92975 23.0001 12.0049C23.0001 18.08 18.0753 23.0049 12.0001 23.0049C5.92499 23.0049 1.00012 18.08 1.00012 12.0049ZM13.0001 6.50488L13.0001 11.0049H17.5001V13.0049H13.0001L13.0001 17.5049H11.0001L11.0001 13.0049H6.50012V11.0049H11.0001L11.0001 6.50488H13.0001Z"
								fill="black"
							/>
						</svg>
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
					>
						<li>
							<a onClick={() => setCreateGroupModalOpen(true)}>创建群聊</a>
						</li>
						<li>
							<a onClick={() => setJoinGroupModalOpen(true)}>加入群聊</a>
						</li>
						<li>
							<a onClick={() => setAddFriendModalOpen(true)}>添加好友</a>
						</li>
					</ul>
				</div>
			</div>
		</Wrapper>
	);
}
export default Create;
