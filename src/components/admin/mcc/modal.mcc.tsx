import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, notification } from "antd";
import { useEffect } from 'react';
import { IMcc } from "@/types/backend";
import { callCreateMcc, callUpdateMcc } from "@/config/api";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit?: IMcc | null;
    setDataInit: (v: any) => void;
}

const ModalMcc = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.code) {
            form.setFieldsValue({
                ...dataInit,
            });
        }
    }, [dataInit]);

    const submitMcc = async (valuesForm: IMcc) => { // <<< Gán kiểu IMcc cho valuesForm
        if (dataInit?.code) {
            // Chế độ UPDATE
            const { description, descriptionEn, isActive } = valuesForm;
            const mccUpdateData = { description, descriptionEn, isActive };
            const res = await callUpdateMcc(mccUpdateData, dataInit.code); // <<< Cách gọi đã khớp với API mới
            if (res.data) {
                notification.success({ message: 'Cập nhật MCC thành công!' });
                handleReset();
                reloadTable();
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res.message });
            }
        } else {
            // Chế độ CREATE
            const res = await callCreateMcc(valuesForm); // <<< Gửi thẳng valuesForm vì nó đã có đúng kiểu IMcc
            if (res.data) {
                notification.success({ message: 'Thêm mới MCC thành công!' });
                handleReset();
                reloadTable();
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res.message });
            }
        }
    }

    const handleReset = () => {
        form.resetFields();
        setOpenModal(false);
        setDataInit(null);
    }

    return (
        <ModalForm
            title={<>{dataInit?.code ? "Cập nhật MCC" : "Tạo mới MCC"}</>}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                keyboard: false,
                maskClosable: false,
            }}
            form={form}
            onFinish={submitMcc}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label="Mã MCC"
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập mã MCC"
                        disabled={!!dataInit?.code}
                    />
                </Col>
                <Col span={24}>
                    <ProFormTextArea
                        label="Mô tả (Tiếng Việt)"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        placeholder="Nhập mô tả bằng tiếng Việt"
                    />
                </Col>
                <Col span={24}>
                    <ProFormTextArea
                        label="Mô tả (Tiếng Anh)"
                        name="descriptionEn"
                        placeholder="Nhập mô tả bằng tiếng Anh"
                    />
                </Col>
                <Col span={24}>
                    <ProFormSelect
                        name="isActive" // <<< Đã khớp với 'isActive' trong IMcc
                        label="Trạng thái"
                        initialValue={true}
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        options={[
                            { value: true, label: 'Hoạt động' },
                            { value: false, label: 'Ngừng' },
                        ]}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
}

export default ModalMcc;