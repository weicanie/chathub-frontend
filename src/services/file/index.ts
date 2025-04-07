import axiosInstance from '..';

export async function presignedUrl(fileName: string, bucketName = 'chat') {
	return axiosInstance.get(`/oss/presignedUrl?name=${fileName}&bucketName=${bucketName}`);
}
