import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, notification } from "antd";
import { IMerchant } from "@/types/backend";
import { callCreateMerchant } from "@/config/api";
import dayjs from "dayjs";

// Props mà component này cần từ component cha (MerchantPage)
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
}

const ModalCreateMerchant = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable } = props;
    const [form] = Form.useForm();

    // Hàm này được gọi khi người dùng nhấn nút "Submit" trên form
    const submitMerchant = async (valuesForm: any) => {
        // Chuyển đổi định dạng ngày tháng cho khớp với request backend
        const formattedValues = {
            ...valuesForm,
            openDate: dayjs(valuesForm.openDate).format("DD/MM/YYYY")
        };

        try {
            const res = await callCreateMerchant(formattedValues);
            
            // res.data chính là đối tượng { errorCode, errorDesc, data }
            const backendResponse = res.data;

            // Kiểm tra logic thành công dựa trên errorCode
            if (backendResponse && res.errorCode === 200) { 
                notification.success({
                    message: res.message || 'Thêm mới thành công!', 
                }); 
                handleReset(); // Đóng và xóa trắng modal
                reloadTable(); // Yêu cầu bảng tải lại dữ liệu
            } else {
                // Xử lý trường hợp API trả về 200 OK nhưng có mã lỗi logic
                notification.error({
                    message: 'Thao tác thất bại',
                    description: res?.message || "Lỗi không xác định từ API."
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

    // Hàm dọn dẹp khi modal bị hủy hoặc đóng
    const handleReset = () => {
        form.resetFields();
        setOpenModal(false);
    }

    return (
        <ModalForm
            title="Tạo mới Merchant"
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                keyboard: false,
                maskClosable: false,
            }}
            form={form}
            onFinish={submitMerchant}
        >
            <Row gutter={16}>
                <Col span={12}><ProFormText label="Merchant ID" name="merchantId" rules={[{ required: true }]} /></Col>
                <Col span={12}><ProFormText label="Số tài khoản" name="accountNo" rules={[{ required: true }]} /></Col>
                <Col span={12}><ProFormText label="Tên đầy đủ" name="fullName" rules={[{ required: true }]} /></Col>
                <Col span={12}><ProFormText label="Tên viết tắt" name="shortName" /></Col>
                <Col span={12}><ProFormText label="Mã MCC" name="mcc" rules={[{ required: true }]} /></Col>
                <Col span={12}><ProFormText label="Thành phố" name="city" /></Col>
                <Col span={24}><ProFormText label="Địa chỉ" name="location" /></Col>
                <Col span={12}><ProFormText label="Số điện thoại" name="phoneNo" /></Col>
                <Col span={12}><ProFormText label="Email" name="email" rules={[{ type: 'email' }]} /></Col>
                <Col span={12}>
                    <ProFormSelect
                        name="status"
                        label="Trạng thái"
                        initialValue={"Active"}
                        rules={[{ required: true }]}
                        options={[
                            { label: 'Hoạt động', value: 'Active' },
                            { label: 'Ngừng', value: 'Close' }
                        ]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormDatePicker name="openDate" label="Ngày mở" rules={[{ required: true }]} />
                </Col>
                <Col span={12}><ProFormText label="Mã chi nhánh" name="branchCode" /></Col>
            </Row>
        </ModalForm>
    );
}

export default ModalCreateMerchant;