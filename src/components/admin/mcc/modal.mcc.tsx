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
        let res: any; // res sẽ là toàn bộ phản hồi từ Axios

        if (dataInit?.code) {
            // Chế độ UPDATE
            const { description, descriptionEn, active } = valuesForm;
            const mccUpdateData = { description, descriptionEn, active };
            res = await callUpdateMcc(mccUpdateData, dataInit.code);
        } else {
            // Chế độ CREATE
            res = await callCreateMcc(valuesForm);
        }

        // ==========================================================
        // <<< LOGIC XỬ LÝ THÀNH CÔNG CHUNG CHO CẢ CREATE VÀ UPDATE
        // Giả định rằng cả hai API đều trả về đối tượng Mcc trực tiếp khi thành công
        // ==========================================================
        const resultData = res.data; // Đây là đối tượng IMcc

        if (resultData && resultData.code) {
            notification.success({
                message: dataInit?.code ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
            });
            handleReset();
            reloadTable();
        } else {
            // Xảy ra khi API trả về 200 OK nhưng body rỗng hoặc không đúng định dạng
            notification.error({
                message: 'Thao tác thất bại',
                description: "API không trả về dữ liệu mong đợi."
            });
        }

    } catch (error: any) {
        // Xử lý chung cho lỗi HTTP (status 4xx, 5xx)
        const errorMessage =
            error?.response?.data?.errorDesc ?? // Tìm 'errorDesc' trước
            error?.response?.data?.message ??   // Nếu không có thì tìm 'message'
            "Có lỗi không xác định";

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
                        name="active" 
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