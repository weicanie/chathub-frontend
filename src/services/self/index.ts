import axiosInstance from '..';
import wei_ls from '../../utils/wei_ls';
import { UpdatePasswordInfo, UserInfo } from '../types';

export async function updatePasswordCaptcha(email: string) {
	return await axiosInstance.get('/user/update_password/captcha', {
		params: {
			address: email
		}
	});
}

export async function updatePassword(data: UpdatePasswordInfo) {
	return await axiosInstance.post('/user/update_password', data);
}

export async function getUserInfo() {
	const userId = wei_ls.getFromLS('userInfo')?.id;
	return await axiosInstance.get(`/user/${userId}`);
}

export async function updateInfo(data: UserInfo) {
	const tData = { ...data, avatar_url: data.headPic };
	return await axiosInstance.post('/user/update', tData);
}

export async function updateUserInfoCaptcha() {
	return await axiosInstance.get('/user/update/captcha');
}
