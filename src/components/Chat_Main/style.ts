import styled from 'styled-components';
const containerWidth = 1088 - 90;
const roomListWidth = containerWidth / 4;
const messageListWidth = containerWidth - roomListWidth;

const containerHeight = 900;
const rooItemHeight = containerHeight / 10;
const inputBarHeight = containerHeight / 5;

const Wrapper = styled.div`
	#chat-container {
		display: flex;
		width: ${containerWidth}px;
		height: ${containerHeight}px;
		position: relative;

		.chat-room-list {
			width: ${256}px;
			border-left: 1.5px solid rgb(244, 244, 244);
			height: 100%;
			overflow-y: auto;
			background-color: #fff;

			#room-item-container {
				/* display: flex; */
			}
			.chat-room-item {
				/* height: ${rooItemHeight}px; */
				/* line-height: ${rooItemHeight}px; */
				padding-left: 20px;
				cursor: pointer;

				&:hover {
					background: rgb(242, 242, 242);
				}
				&.selected {
					background: rgb(235, 235, 235);
				}
			}
		}

		.message-list {
			background-color: rgb(245, 246, 247);
			flex: 1;
			overflow-y: auto;
			border-bottom: 0;
			height: calc(100% - ${inputBarHeight}px);

			.message-item {
				padding: 20px;

				display: flex;
				flex-wrap: wrap;

				.message-sender {
					width: 100%;

					img {
						width: 20px;
						height: 20px;
						padding-right: 10px;
					}
				}

				.message-content {
					border: 1px solid #000;
					width: max-content;
					padding: 10px 20px;
					border-radius: 4px;
					background: skyblue;
				}

				&.from-me {
					text-align: right;
					justify-content: right;

					.message-content {
						text-align: right;
						justify-content: right;
						background: #fff;
					}
				}
			}
		}

		.message-input {
			background-color: rgb(245, 246, 247);
			width: ${742}px;
			border-top: 1.5px solid rgb(234, 234, 234);

			height: ${inputBarHeight}px;
			position: absolute;
			bottom: 0;
			right: 0;

			.message-type {
				display: flex;

				.message-type-item {
					width: ${messageListWidth / 6}px;
					&:hover {
						font-weight: bold;
						cursor: pointer;
					}
				}
			}

			.message-input-area {
				position: relative;
				width: ${messageListWidth}px;
				display: flex;
				#message-input-box {
					width: 100%;
					height: 100%;
				}
				.message-send-btn {
					position: absolute;
					right: 5px;
					top: ${inputBarHeight / 2}px;
					width: ${messageListWidth / 15}px;
					height: ${inputBarHeight / 5}px;
				}
			}
		}
	}
`;
export default Wrapper;
