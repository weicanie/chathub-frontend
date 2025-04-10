import data from '@emoji-mart/data';
import EmojiPicker from '@emoji-mart/react';
import { Button, message, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import { UserInfo } from '@/services/types';
import { FileAddOutlined, FileImageOutlined, SmileOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { chatHistoryList } from '../../services/chat';
import { chatroomList } from '../../services/contact';
import { favoriteAdd } from '../../services/favor';
import Wrapper from './style';
import { UploadModal } from './UploadModal';

interface JoinRoomPayload {
	chatroomId: number;
	userId: number;
}

interface SendMessagePayload {
	sendUserId: number;
	chatroomId: number;
	message: Message;
}

type MessageType = 'image' | 'text' | 'file';

interface Message {
	type: MessageType;
	content: string;
}

type Reply =
	| {
			type: 'sendMessage';
			userId: number;
			message: ChatHistory;
	  }
	| {
			type: 'joinRoom';
			userId: number;
	  };

interface ChatHistory {
	id: number;
	content: string;
	type: number;
	chatroomId: number;
	senderId: number;
	create_at: Date;
	sender: UserInfo;
}

interface Chatroom {
	id: number;
	name: string;
	create_at: Date;
	lastMessage: ChatHistory;
	type: boolean; //是否是群聊
}

export interface User {
	id: number;
	email: string;
	headPic: string;
	nickName: string;
	username: string;
	create_at: Date;
	avatar_url: string;
}

function getUserInfo(): User {
	return JSON.parse(localStorage.getItem('userInfo')!);
}

export function ChatMain() {
	//@ts-ignore
	const socketRef = useRef<Socket>();
	const [roomId, setChatroomId] = useState<number>();
	const [isUploadModalOpen, setUploadModalOpen] = useState(false);
	const userInfo = getUserInfo();

	const [roomList, setRoomList] = useState<Array<Chatroom>>([]);

	const [chatHistory, setChatHistory] = useState<Array<ChatHistory>>();

	useEffect(() => {
		if (!roomId) {
			return;
		}
		const socket = (socketRef.current = io('http://localhost:3001'));
		socket.on('connect', function () {
			const payload: JoinRoomPayload = {
				chatroomId: roomId,
				userId: userInfo.id
			};

			socket.emit('joinRoom', payload);
			//* 消息发送到房间： 客户端 -'sendMessage'>服务器  服务器 -'message'>客户端
			socket.on('message', (reply: Reply) => {
				if (reply.type === 'sendMessage') {
					setChatHistory(chatHistory => {
						return chatHistory ? [...chatHistory, reply.message] : [reply.message];
					});
					setTimeout(() => {
						document.getElementById('bottom-bar')?.scrollIntoView({ block: 'end' });
					}, 300);
				}
			});
		});
		return () => {
			socket.disconnect();
		};
	}, [roomId]);
	//*通过socket发送消息到房间中
	function sendMessage(value: string, type: MessageType = 'text') {
		if (!value) {
			return;
		}
		if (!roomId) {
			return;
		}

		const payload: SendMessagePayload = {
			sendUserId: userInfo.id,
			chatroomId: roomId,
			message: {
				type,
				content: value
			}
		};

		socketRef.current?.emit('sendMessage', payload);
	}

	//获取房间列表
	async function queryChatroomList() {
		try {
			const res = await chatroomList();
			if (res.status === 201 || res.status === 200) {
				setRoomList(
					res.data.map((item: Chatroom) => {
						return {
							...item,
							key: item.id
						};
					})
				);
			}
		} catch (e: any) {
			console.log(e);
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	useEffect(() => {
		queryChatroomList();
	}, []);
	//自动打开第一个房间
	useEffect(() => {
		if (roomList.length > 0) {
			queryChatHistoryList(roomList[0].id);
			setChatroomId(roomList[0].id);
		}
	}, [roomList]);
	//自动滚动到消息列表末尾
	useEffect(() => {
		setTimeout(() => {
			document.getElementById('bottom-bar')?.scrollIntoView({ block: 'end' });
		}, 300);
	}, [roomId]);
	//获取房间内的消息列表
	async function queryChatHistoryList(chatroomId: number) {
		try {
			const res = await chatHistoryList(chatroomId);

			if (res.status === 201 || res.status === 200) {
				setChatHistory(
					res.data.map((item: Chatroom) => {
						return {
							...item,
							key: item.id
						};
					})
				);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	const location = useLocation();
	useEffect(() => {
		if (location.state?.chatroomId) {
			setChatroomId(location.state?.chatroomId);
			queryChatHistoryList(location.state?.chatroomId);
		}
	}, [location.state?.chatroomId]);
	//输入框（受控模式）
	const [inputText, setInputText] = useState('');
	//双击收藏消息
	async function addToFavorite(chatHistoryId: number) {
		try {
			const res = await favoriteAdd(chatHistoryId);

			if (res.status === 201 || res.status === 200) {
				message.success('收藏成功');
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	}

	const [uploadType, setUploadType] = useState<'image' | 'file'>('image');

	return (
		<Wrapper>
			<div id="chat-container">
				{/* 房间列表 */}
				<div className="chat-room-list">
					<ul className="list bg-base-100  shadow-md">
						{roomList?.map(item => {
							return (
								<div className="room-item-container" key={item.id}>
									<div
										className={`chat-room-item ${item.id === roomId ? 'selected' : ''}`}
										data-id={item.id}
										onClick={() => {
											queryChatHistoryList(item.id);
											setChatroomId(item.id);
										}}
									>
										<li className="list-row">
											<div className="avatar avatar-placeholder">
												<div className=" bg-neutral text-neutral-content w-10 rounded-full">
													<span className="text-3xl">{item.name.substring(0, 1)}</span>
												</div>
											</div>
											<div>
												<div>{item.name}</div>
												<div className="text-xs font-semibold opacity-60">
													{`
													${item.type ? (item.lastMessage ? item.lastMessage.sender.nickName + ': ' : '') : ''}
													${
														item.lastMessage
															? item.lastMessage.content.length > 13
																? item.lastMessage.content.slice(0, 7) + '...'
																: item.lastMessage.content
															: '暂无消息'
													}
													`}
												</div>
											</div>
											{/* <button className="btn btn-square btn-ghost">1</button> */}
										</li>
									</div>
								</div>
							);
						})}
					</ul>
				</div>
				{/* 消息列表 */}
				<div className="message-list">
					{chatHistory?.map(item => {
						return (
							<div
								className="message-item-container"
								key={item.id}
								data-id={item.id}
								onDoubleClick={() => {
									addToFavorite(item.id);
								}}
							>
								<div
									className={`chat ${item.senderId === userInfo.id ? 'chat-end ' : 'chat-start'}`}
								>
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img alt="Tailwind CSS chat bubble component" src={item.sender.avatar_url} />
										</div>
									</div>
									<div className="chat-header">
										{item.sender.nickName}
										<time className="text-xs opacity-50">
											{new Date(item.create_at).toLocaleString()}
										</time>
									</div>
									<div
										className={`chat-bubble ${item.senderId === userInfo.id ? 'chat-bubble-accent' : 'chat-bubble-info'}`}
									>
										{' '}
										{/* 三种类型的消息 */}
										<div className="message-content">
											{item.type === 0 ? (
												item.content
											) : item.type === 1 ? (
												<img src={item.content} style={{ maxWidth: 200 }} />
											) : (
												<div>
													<a download href={item.content}>
														{item.content}
													</a>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
					<div id="bottom-bar" key="bottom-bar"></div>
				</div>
				{/* 输入框 */}
				<div className="message-input">
					<div className="message-type">
						<div className="message-type-item" key={1}>
							<Popover
								content={
									<EmojiPicker
										data={data}
										onEmojiSelect={(emoji: any) => {
											setInputText(inputText => inputText + emoji.native);
										}}
									/>
								}
								title="Title"
								trigger="click"
							>
								<SmileOutlined style={{ height: '', width: '' }}></SmileOutlined>
							</Popover>
						</div>
						<div
							className="message-type-item"
							key={2}
							onClick={() => {
								setUploadType('image');
								setUploadModalOpen(true);
							}}
						>
							<FileImageOutlined />
						</div>
						<div
							className="message-type-item"
							key={3}
							onClick={() => {
								setUploadType('file');
								setUploadModalOpen(true);
							}}
						>
							<FileAddOutlined />
						</div>
					</div>
					<div className="message-input-area">
						<TextArea
							className="message-input-box"
							value={inputText}
							onChange={e => {
								setInputText(e.target.value);
							}}
							autoSize={{ minRows: 2, maxRows: 5 }}
							allowClear
							variant="borderless"
						/>
						<Button
							className="message-send-btn"
							type="primary"
							onClick={() => {
								sendMessage(inputText);
								setInputText('');
							}}
						>
							发送
						</Button>
					</div>
				</div>
				<UploadModal
					isOpen={isUploadModalOpen}
					type={uploadType}
					handleClose={fileUrl => {
						setUploadModalOpen(false);

						if (fileUrl) {
							sendMessage(fileUrl, uploadType);
						}
					}}
				/>
			</div>
		</Wrapper>
	);
}
