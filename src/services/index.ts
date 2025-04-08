import { message } from 'antd';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3001/',
	timeout: 3000
});

axiosInstance.interceptors.request.use(function (config) {
	const accessToken = localStorage.getItem('token');

	if (accessToken) {
		config.headers.authorization = 'Bearer ' + accessToken;
	}
	return config;
});

axiosInstance.interceptors.response.use(
	response => {
		const newToken = response.headers['token'];
		//token无感刷新
		if (newToken) {
			localStorage.setItem('token', newToken);
		}
		return response;
	},
	async error => {
		if (!error.response) {
			return Promise.reject(error);
		}
		let { data } = error.response;
		if (data.statusCode === 401) {
			message.error(data.message);
			setTimeout(() => {
				//@ts-ignore
				document.getElementById('login_modal').showModal();
			}, 1500);
		} else {
			return Promise.reject(error);
		}
	}
);

export default axiosInstance;
