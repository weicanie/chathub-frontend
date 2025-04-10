import { message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { chatroomList } from '../../services/contact';
import GroupList from './GroupList';
import './index.css';

interface SearchGroup {
	name: string;
}

interface GroupSearchResult {
	id: number;
	name: string;
	type: boolean;
	userCount: number;
	userIds: Array<number>;
	create_at: Date;
}

export function Group() {
	const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([]);

	const searchGroup = async (values: SearchGroup) => {
		try {
			const res = await chatroomList(values.name || '');

			if (res.status === 201 || res.status === 200) {
				setGroupResult(
					res.data
						.filter((item: GroupSearchResult) => {
							return item.type === true;
						})
						.map((item: GroupSearchResult) => {
							return {
								...item,
								key: item.id
							};
						})
				);
			}
		} catch (e: any) {
			message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
		}
	};

	const [form] = useForm();

	useEffect(() => {
		searchGroup({
			name: form.getFieldValue('name')
		});
	}, []);

	return <GroupList></GroupList>;
}
