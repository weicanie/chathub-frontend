import { AxiosResponse } from 'axios';
import axiosInstance from '..';

export type UserResult = {
	username: string;
	id: number;
	avatar_url: string | null;
	online_status: string | null;
	create_at: Date | null;
	update_at: Date | null;
	sign: string | null;
	nickName: string;
	email: string;
};

export type GroupResult = {
	id: number;
	create_at: Date;
	update_at: Date;
	name: string;
	type: boolean;
};

export async function searchUser(name: string): Promise<AxiosResponse<UserResult[]>> {
	return await axiosInstance.get(`/user/search-user?name=${name}`);
}

export async function searchGroup(name: string): Promise<AxiosResponse<GroupResult[]>> {
	return await axiosInstance.get(`/chatroom/search-chatroom?name=${name}`);
}
