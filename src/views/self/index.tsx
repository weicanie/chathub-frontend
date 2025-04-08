import { useState } from 'react';
import styled from 'styled-components';
import { UpdateInfo } from '../../components/Self_Main/UpdateInfo';
import UserCard from '../../components/Self_Main/userCard';
import wei_ls from '../../utils/wei_ls';
const Wrapper = styled.div`
	display: flex;
	width: 1000px;
	height: 900px;
	.menu-contact {
		display: flex;
		flex-direction: column;
		width: 264px;
		overflow: visible;
		background-color: rgb(255, 255, 255);
	}
	.show-contact {
		width: ${1000 - 256}px;
		background-color: rgb(245, 246, 247);
	}
`;
function Self() {
	const [isEdit, setIsEdist] = useState(false);
	return (
		<Wrapper>
			<div className="menu-contact">
				<UserCard
					info={wei_ls.getFromLS('userInfo')}
					onClick={() => {
						setIsEdist(isEdit => !isEdit);
					}}
				></UserCard>
			</div>
			<div className="show-contact">{isEdit && <UpdateInfo></UpdateInfo>}</div>
		</Wrapper>
	);
}
export default Self;
