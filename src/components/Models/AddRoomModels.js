import { async } from '@firebase/util';
import { Form, Input, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppProvider';
import { AuthContext } from '../../context/AuthProvider';
import { addDocument } from '../../Firebase/services';

export default function AddRoomModels() {

    const { user : { uid } } = useContext(AuthContext)

    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext)

    const [form] = useForm()

    const handleOk = async () => {
        const { name, description = '' } = form.getFieldsValue()
        if (name) {
            try {
                await addDocument('rooms', {
                    name,
                    description,
                    members: [uid]
                })
            } catch(err) {
                console.log('err in AddRoomModal: ', err.message);
            }
            setIsAddRoomVisible(false)
        }
        form.resetFields()
    }

    const handleCancel = () => {
        setIsAddRoomVisible(false)
    }

    return (
        <Modal
            title="Basic Modal"
            visible={isAddRoomVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
        <Form form={form} layout='vertical'>
            <Form.Item label="Tên phòng" name="name">
                <Input />
            </Form.Item>
            <Form.Item label="Nhập mô tả" name="description">
                <Input.TextArea></Input.TextArea>
            </Form.Item>
        </Form>
        </Modal>
    );
}
