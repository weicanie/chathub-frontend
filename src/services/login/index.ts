import axiosInstance from '..';

export async function login(username: string, password: string) {
	return await axiosInstance.post('/user/login', {
		username,
		password
	});
}
