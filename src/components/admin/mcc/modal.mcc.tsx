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

    const submitMcc = async (valuesForm: IMcc) => {
    try {
        const { code, description, descriptionEn, isActive } = valuesForm;
        let res: any; 

        if (dataInit?.code) {
            // Chế độ UPDATE
            const mccUpdateData = { description, descriptionEn, isActive };
            res = await callUpdateMcc(mccUpdateData, dataInit.code);
        } else {
            // Chế độ CREATE
            const mccCreate = { code, description, descriptionEn, isActive };
            res = await callCreateMcc(mccCreate); 
        } 

        const actualResponse = res.data;
        // Xử lý chung cho cả CREATE và UPDATE
        if (actualResponse && actualResponse.errorCode === 0) {
            notification.success({
                 message: actualResponse.errorDesc || (dataInit?.code ? 'Cập nhật thành công!' : 'Thêm mới thành công!'),
            });
            handleReset();
            reloadTable();
        } else {
            // Trường hợp API thành công (status 2xx) nhưng có errorCode khác 0
            notification.error({
                message: 'Thao tác thất bại',
                description: actualResponse?.errorDesc || "Lỗi không xác định từ API."
            });
        }

    } catch (error: any) {
        // Xử lý chung cho lỗi HTTP (status 4xx, 5xx)
        const errorMessage = error?.response?.data?.errorDesc ?? "Có lỗi không xác định";
        notification.error({
            message: 'Thao tác thất bại',
            description: errorMessage
        });
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