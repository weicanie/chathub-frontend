import axiosInstance from '..';
import { AddFriend } from '../../components/Friendship/AddFriendModal';

export async function friendshipList() {
	return axiosInstance.get(`/friendship/list`);
}
export async function getfriend(name: string) {
	return axiosInstance.get(`/friendship/one?name=${name}`);
}

export async function friendAdd(data: AddFriend) {
	return axiosInstance.post('/friendship/add', data);
}

export async function friendDel(id: number) {
	return axiosInstance.post(`/friendship/remove/${id}`);
}

export async function friendRequestList() {
	return axiosInstance.get('/friendship/request_list');
}

export async function agreeFriendRequest(id: number) {
	return axiosInstance.get(`/friendship/agree/${id}`);
}

export async function rejectFriendRequest(id: number) {
	return axiosInstance.get(`/friendship/reject/${id}`);
}

export async function chatroomList(name?: string) {
	//不传name（''）：查询用户所有聊天房间
	//传name：限制名字中带有name
	return axiosInstance.get(`/chatroom/list?name=${name ? name : ''}`);
}

export async function findChatroom(userId1: number, userId2: number) {
	return axiosInstance.get(`/chatroom/findChatroom`, {
		params: {
			userId1,
			userId2
		}
	});
}
export async function groupMembers(chatroomId: number) {
	return axiosInstance.get(`/chatroom/members`, {
		params: {
			chatroomId
		}
	});
}

export async function addMember(chatroomId: number, joinUsername: string) {
	return axiosInstance.get(`/chatroom/join/${chatroomId}`, {
		params: {
			joinUsername
		}
	});
}

export async function createOneToOne(friendId: number) {
	return axiosInstance.get(`/chatroom/create-one-to-one`, {
		params: {
			friendId
		}
	});
}

export async function createGroup(name: string) {
	return axiosInstance.get(`/chatroom/create-group`, {
		params: {
			name
		}
	});
}
