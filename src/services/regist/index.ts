import axiosInstance from '..';
import { RegisterUser } from '../../components/Register_Main';

export async function registerCaptcha(email: string) {
	return await axiosInstance.get('/user/register-captcha', {
		params: {
			address: email
		}
	});
}

export async function register(registerUser: RegisterUser) {
	return await axiosInstance.post('/user/regist', registerUser);
}
