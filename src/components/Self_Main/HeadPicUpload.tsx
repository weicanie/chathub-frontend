import { FileAddFilled } from '@ant-design/icons';
import { message } from 'antd';
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger';
import axios from 'axios';
import { presignedUrl } from '../../services/file';
import wei_ls from '../../utils/wei_ls';

interface HeadPicUploadProps {
	value?: string;
	onChange?: Function;
}

let onChange: Function;
let userId: string = wei_ls.getFromLS('userInfo')?.id;
/* 
	利用用antd的Dragger组件API实现前端直传OSS
*/
//TODO 用户取消上传时通知OSS删除图片，最好用户点击修改再上传！
const props: DraggerProps = {
	name: 'file',
	action: async file => {
		// 获取目的地URL（服务器预签名）
		const res = await presignedUrl(userId + file.name);
		return res.data;
	},
	async customRequest(options) {
		const { onSuccess, file, action } = options;

		const res = await axios.put(action, file); // 文件上传OSS

		onSuccess!(res.data);
	},
	// 文件开始上传、成功/失败，都会调用这个回调（前后调用两次）
	onChange(info) {
		const { status } = info.file;
		if (status === 'done') {
			onChange('http://localhost:9000/chat/' + userId + info.file.name); //onChange默认值：文件上传成功后展示（通过讲文件url设置为formItem的props.value）
			message.success(`${info.file.name} 文件上传成功`);
		} else if (status === 'error') {
			message.error(`${info.file.name} 文件上传失败`);
		}
	}
};

const dragger = (
	<Dragger {...props}>
		<p className="ant-upload-drag-icon">
			<FileAddFilled style={{ color: 'gray' }} />
		</p>
		<p className="ant-upload-text"></p>
	</Dragger>
);

export function HeadPicUpload(props: HeadPicUploadProps) {
	onChange = props.onChange!; //没传的话会应用antd默认的
	userId = wei_ls.getFromLS('userInfo')?.id;
	return props?.value ? (
		<div>
			<img src={props.value} alt="头像" width="100" height="100" />
			{dragger}
		</div>
	) : (
		<div>{dragger}</div>
	);
}
