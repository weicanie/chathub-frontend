import { FileAddFilled } from '@ant-design/icons';
import { message } from 'antd';
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger';
import axios from 'axios';
import { presignedUrl } from '../../services/file';
import wei_ls from '../../utils/wei_ls';

interface FileUploadProps {
	value?: string;
	onChange?: Function;
	type: 'image' | 'file';
}

let onChange: Function;
let userId: string = wei_ls.getFromLS('userInfo')?.id;
const props: DraggerProps = {
	name: 'file',
	action: async file => {
		const res = await presignedUrl(userId + file.name);
		return res.data;
	},
	async customRequest(options) {
		const { onSuccess, file, action } = options;

		const res = await axios.put(action, file);

		onSuccess!(res.data);
	},
	onChange(info) {
		const { status } = info.file;
		if (status === 'done') {
			onChange('http://localhost:9000/chat/' + userId + info.file.name);
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

export function FileUpload(props: FileUploadProps) {
	onChange = props.onChange!;

	return props?.value ? (
		<div>
			{props.type === 'image' ? (
				<img src={props.value} alt="图片" width="100" height="100" />
			) : (
				props.value
			)}
			{dragger}
		</div>
	) : (
		<div>{dragger}</div>
	);
}
