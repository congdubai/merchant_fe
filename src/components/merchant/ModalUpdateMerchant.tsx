import { Modal, Form, Input, Select, DatePicker, notification } from 'antd';
import { useEffect, useState } from 'react';
import type { IMerchant } from '@/types/backend';
import dayjs from 'dayjs';
import { ProForm } from '@ant-design/pro-components';
import AddressSelector from './location.merchant';
import { callUpdateMerchant } from '@/config/api';

const { Option } = Select;

interface IProps {
    open: boolean;
    onCancel: () => void;
    dataInit: IMerchant | null;
    reloadTable: () => void;
}

const ModalUpdateMerchant = ({ open, onCancel, dataInit, reloadTable }: IProps) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    // MỚI: Tạo state để quản lý giá trị địa chỉ một cách đồng bộ
    const [addressValue, setAddressValue] = useState<[string | null, string | null]>([null, null]);

    // Load dữ liệu mặc định khi modal mở
    useEffect(() => {
        if (open) {
            if (dataInit) {
                form.setFieldsValue({
                    ...dataInit,
                    openDate: dataInit.openDate ? dayjs(dataInit.openDate) : null,
                    closeDate: dataInit.closeDate ? dayjs(dataInit.closeDate) : null
                });
                // MỚI: Cập nhật state địa chỉ cùng lúc với form
                setAddressValue([dataInit.city || null, dataInit.location || null]);
            } else {
                form.resetFields();
                // MỚI: Reset state địa chỉ khi reset form
                setAddressValue([null, null]);
            }
        }
    }, [open, dataInit, form]);

    const onFinish = async (values: any) => {
        console.log("dữ liệu được cập nhật là:" + JSON.stringify(values));
        if (!dataInit?.merchantId) return;
        setIsSubmit(true);

        const payload = {
            ...values,
            openDate: values.openDate ? dayjs(values.openDate).toISOString() : null,
            closeDate: values.closeDate ? dayjs(values.closeDate).toISOString() : null
        };

        try {
            const res = await callUpdateMerchant(values);
            if (res && res.data) {
                notification.success({ message: 'Cập nhật thành công!' });
                onCancel();
                reloadTable();
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res?.errorDesc });
            }
        } catch (error: any) {
            notification.error({
                message: 'Có lỗi xảy ra1',
                description: error?.message ?? 'Không thể kết nối đến server'
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Cập nhật Merchant"
            open={open}
            onOk={() => form.submit()}
            onCancel={onCancel}
            confirmLoading={isSubmit}
            width={600}
            maskClosable={false}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* ... các Form.Item khác giữ nguyên ... */}
                <Form.Item
                    label="Số tài khoản"
                    name="accountNo"
                    rules={[
                        { required: true, message: 'Số tài khoản không được để trống' },
                        { max: 19, message: 'Không vượt quá 19 ký tự' }
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Tên đầy đủ"
                    name="fullName"
                    rules={[
                        { required: true, message: 'Tên không được để trống' },
                        { max: 200, message: 'Không vượt quá 200 ký tự' },
                        { pattern: /^[A-Z0-9\s]+$/, message: 'Tên đầy đủ phải là chữ hoa, không có dấu' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tên viết tắt"
                    name="shortName"
                    rules={[
                        { required: true, message: 'Tên viết tắt không được để trống' },
                        { max: 25, message: 'Không vượt quá 25 ký tự' },
                        { pattern: /^[A-Z0-9\s]+$/, message: 'Tên viết tắt phải là chữ hoa, không có dấu' }
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item
                    label="Mã MCC"
                    name="mcc"
                    rules={[
                        { required: true, message: 'MCC không được để trống' },
                        { len: 4, message: 'Mã loại dịch vụ phải có đúng 4 ký tự' }
                    ]}
                >
                    <Select placeholder="Chọn MCC">
                        <Option value="5812">5812 - Eating Places, Restaurants</Option>
                        <Option value="5411">5411 - Grocery Stores, Supermarkets</Option>
                        <Option value="5912">5912 - Drug Stores, Pharmacies</Option>
                    </Select>
                </Form.Item> */}

                <Form.Item
                    label="Mã MCC"
                    name="mcc"
                    rules={[{ required: true, message: 'MCC không được để trống'}]}
                >
                    <Input />
                </Form.Item>

                {/* SỬA: Phần địa chỉ */}
                <ProForm.Item label="Địa chỉ">
                    <AddressSelector
                        // SỬA: Lấy giá trị từ state thay vì getFieldValue
                        value={addressValue.map(v => v ?? '') as [string, string]} onChange={(value: string[]) => {
                            const newCity = value[0] || null;
                            const newLocation = value[1] || null;
                            // SỬA: Cập nhật cả state và form fields
                            setAddressValue([newCity, newLocation]);
                            form.setFieldsValue({
                                city: newCity,
                                location: newLocation,
                            });
                        }}
                    />
                </ProForm.Item>

                {/* Ẩn city & location nhưng vẫn lưu */}
                <Form.Item name="city" hidden>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item name="location" hidden>
                    <Input type="hidden" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phoneNo"
                    rules={[{ max: 20, message: 'Không vượt quá 20 ký tự' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { type: 'email', message: 'Email không đúng định dạng' },
                        { max: 100, message: 'Không vượt quá 100 ký tự' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Ngày mở" name="openDate">
                    <DatePicker
                        showTime
                        format="DD-MM-YYYY HH:mm:ss"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Ngày đóng" name="closeDate">
                    <DatePicker
                        showTime
                        format="DD-MM-YYYY HH:mm:ss"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="Active">Active</Option>
                        <Option value="Close">Close</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Lí do cập nhật"
                    name="reason"
                    rules={[{ required: true, message: 'Lí do không được để trống' }]}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateMerchant;