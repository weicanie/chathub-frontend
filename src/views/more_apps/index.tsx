import styled from 'styled-components';
import { Collection } from '../../components/Collection';
const Wrapper = styled.div`
	display: flex;
	width: 1000px;
	height: 900px;
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
function MoreApps() {
	return (
		<Wrapper>
			<div className="menu-contact">
				<Collection></Collection>
			</div>
			<div className="show-contact"></div>
		</Wrapper>
	);
}
export default MoreApps;
