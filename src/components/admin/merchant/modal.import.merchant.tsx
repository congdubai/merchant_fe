import { useState } from 'react';
import type { RcFile } from 'antd/es/upload/interface';
import { Button, message, Modal, Upload, Space, Divider, Alert, Tag } from 'antd';
import { CloudUploadOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { callImportMerchants, getSampleFileUrl } from '@/config/api';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
}

const ModalImportMerchant = (props: IProps) => {
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
    const { openModal, setOpenModal, reloadTable } = props;
    const [isLoading, setIsLoading] = useState(false);

    const handleBeforeUpload = (file: RcFile) => {
        // Kiểm tra loại file (tùy chọn nhưng nên có)
        const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXlsx) {
            message.error('Bạn chỉ có thể tải lên file .xlsx!');
            return Upload.LIST_IGNORE; // Bỏ qua file này
        }

        // Lưu file đã chọn vào state
        setSelectedFile(file);
        setUploadError(null);

        return false; // Rất quan trọng: Ngăn antd tự động upload
    };

    const handleConfirmImport = async () => {
        if (!selectedFile) {
            message.error("Vui lòng chọn một file để import!");
            return;
        }
        setUploadError(null);
        const res = await callImportMerchants(selectedFile);
        console.log("check: ", res)
        if (res.errorCode === 200) {
            message.success(res.data?.data!);
            handleCancel();
            reloadTable();
        } else {
            setUploadError(res.errorDesc);
        }
    };

    const handleCancel = () => {
        setOpenModal(false);
        setSelectedFile(null); // Reset file đã chọn khi đóng modal
        setIsLoading(false);
        setUploadError(null);
    };

    return (
        <Modal
            title="Import nhiều Merchant"
            open={openModal}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={handleConfirmImport}
                    disabled={!selectedFile} // Vô hiệu hóa nút nếu chưa chọn file
                >
                    Xác nhận Import
                </Button>
            ]}
            maskClosable={false}
        >
            <Alert
                message="Hướng dẫn"
                description={
                    <ul style={{ paddingLeft: '20px' }}>
                        <li>Bước 1: Tải file mẫu để xem định dạng dữ liệu chuẩn.</li>
                        <li>Bước 2: Điền dữ liệu của các merchant cần tạo vào file mẫu.</li>
                        <li>Bước 3: Lưu file và chọn để tải lên hệ thống.</li>
                    </ul>
                }
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
            />

            <Divider />

            <Space size="large" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <a href={getSampleFileUrl()} download>
                    <Button icon={<DownloadOutlined />} type="default" size="large">
                        Tải file mẫu
                    </Button>
                </a>

                <Upload
                    name="file"
                    beforeUpload={handleBeforeUpload}
                    showUploadList={false}
                    accept=".xlsx"
                    maxCount={1}
                >
                    <Button icon={<CloudUploadOutlined />} loading={isLoading} type="primary" size="large">
                        Chọn file để Import
                    </Button>
                </Upload>
                {selectedFile && (
                    <Tag
                        icon={<FileExcelOutlined />}
                        color="processing"
                        closable
                        onClose={() => setSelectedFile(null)} // Cho phép người dùng xóa file đã chọn
                        style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                        {selectedFile.name}
                    </Tag>
                )}
            </Space>
            {uploadError && (
                <Alert
                    message="Import thất bại"
                    description={uploadError}
                    type="error"
                    showIcon
                    style={{ marginTop: '24px' }}
                />
            )}
        </Modal>
    );
};

export default ModalImportMerchant;