import { Form, Input, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { addMember } from '../../services/contact';
import wei_ls from '../../utils/wei_ls';

interface AddMemberModalProps {
	isOpen: boolean;
	handleClose: Function;
}

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
};

export interface AddMember {
	chatroomId: number;
}

export function JoinGroupModal(props: AddMemberModalProps) {
	const [form] = useForm<AddMember>();

	const handleOk = async function () {
		await form.validateFields();

		const values = form.getFieldsValue();

		try {
			const res = await addMember(values.chatroomId, wei_ls.getFromLS('userInfo')?.username);

			if (res.status === 201 || res.status === 200) {
				message.success('成员添加成功');
				form.resetFields();
				props.handleClose();
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};

	return (
		<Modal
			title="加入群聊"
			open={props.isOpen}
			onOk={handleOk}
			onCancel={() => props.handleClose()}
			okText={'加入'}
			cancelText={'取消'}
		>
			<Form form={form} colon={false} {...layout}>
				<Form.Item
					label="群号"
					name="chatroomId"
					rules={[{ required: true, message: '请输入群号!' }]}
				>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
}
