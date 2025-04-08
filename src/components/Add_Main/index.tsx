import cs from 'classnames';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import Create from '../TopBar/Create';
import SearchBar from '../TopBar/searchBar';

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
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;
function AddMain() {
	const [curKey, setCurkey] = useState('1');
	const [card, setCard] = useState<ReactNode>('');
	return (
		<Wrapper>
			<div className="menu-contact">
				<div role="tablist" className="tabs tabs-border pl-12">
					<a
						role="tab"
						className={cs('w-20', 'tab', { ['tab-active']: curKey === '1' })}
						onClick={() => setCurkey('1')}
					>
						好友
					</a>
					<a
						role="tab"
						className={cs('w-20', 'tab', { ['tab-active']: curKey === '2' })}
						onClick={() => setCurkey('2')}
					>
						群聊
					</a>
				</div>
				<Create></Create>
				<SearchBar curKey={curKey} setCard={setCard}></SearchBar>
			</div>

			<div className="show-contact">{card}</div>
		</Wrapper>
	);
}
export default AddMain;
