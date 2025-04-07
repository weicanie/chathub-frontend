import axiosInstance from '..';

export async function chatHistoryList(id: number) {
	return axiosInstance.get(`/chat-history/list?chatroomId=${id}`);
}
