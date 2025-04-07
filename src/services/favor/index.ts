import axiosInstance from '..';

export async function queryFavoriteList() {
	return axiosInstance.get(`/favorite/list`);
}

export async function favoriteAdd(chatHistoryId: number) {
	return axiosInstance.get(`/favorite/add?chatRecordId=${chatHistoryId}`, {
		params: {
			chatHistoryId
		}
	});
}

export async function favoriteDel(id: number) {
	return axiosInstance.get(`/favorite/del`, {
		params: {
			id
		}
	});
}
