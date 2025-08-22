import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchRole, callUpdateUser } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [roles, setRoles] = useState<ICompanySelect[]>([]);

    const [form] = Form.useForm();

    // Sửa đổi useEffect để xử lý việc set/reset form data khi modal mở hoặc dataInit thay đổi
    useEffect(() => {
        if (openModal) { // Chỉ thực hiện khi modal đang mở
            if (dataInit) {
                // Trường hợp cập nhật: set giá trị cũ vào form
                setRoles([{ label: dataInit.role?.name!, value: dataInit.role?.id! }]);
                form.setFieldsValue({
                    ...dataInit,
                    role: { label: dataInit.role?.name!, value: dataInit.role?.id },
                });
            } else {
                // Trường hợp tạo mới: đảm bảo form hoàn toàn trống
                form.resetFields();
                setRoles([]);
            }
        }
        // else { // Logic này không cần thiết vì handleReset đã làm sạch khi đóng modal
        //     form.resetFields();
        //     setRoles([]);
        // }
    }, [dataInit, openModal]); // Thêm openModal vào dependency array

    const handleReset = async () => {
        form.resetFields(); // Đảm bảo form được reset
        setDataInit(null); // Rất quan trọng để xóa dữ liệu cũ trong state của component cha
        setRoles([]); // Đảm bảo state của DebounceSelect cũng được reset
        setOpenModal(false); // Đóng modal
    }

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role } = valuesForm;
        if (dataInit?.id) {
            //update
            const user = {
                id: dataInit.id,
                name,
                email,
                // Không gửi password nếu không thay đổi để tránh lỗi backend
                password: password || undefined, // Gửi password chỉ khi có giá trị mới
                age,
                gender,
                address,
                role: { id: role.value, name: "" },
            }

            const res = await callUpdateUser(user);
            if (res.data) {
                message.success("Cập nhật user thành công");
                handleReset(); // Gọi handleReset để làm sạch form và đóng modal
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.errorDesc
                });
            }
        } else {
            //create
            const user = {
                email,
                name,
                password,
                address,
                age,
                gender,
                role: { id: role.value, name: "" },
            }
            const res = await callCreateUser(user);
            if (res.data) {
                message.success("Thêm mới user thành công");
                handleReset(); // Gọi handleReset để làm sạch form và đóng modal
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.errorDesc
                });
            }
        }
    }

    async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật User" : "Tạo mới User"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(), // afterClose đảm bảo cleanup sau khi modal đã đóng hoàn toàn
                    destroyOnClose: true, // Rất quan trọng để component được unmount và remount
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
            // XÓA initialValues ở đây, logic set giá trị sẽ được xử lý trong useEffect
            // initialValues={dataInit?.id ? { ...dataInit, role: { label: dataInit.role?.name!, value: dataInit.role?.id } } : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder="Nhập email"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?.id ? true : false}
                            label="Password"
                            name="password"
                            rules={[{ required: dataInit?.id ? false : true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập nhập tuổi"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label="Giới Tính"
                            valueEnum={{
                                MALE: 'Nam',
                                FEMALE: 'Nữ',
                                OTHER: 'Khác',
                            }}
                            placeholder="Chọn giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn công vai trò"
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                                    if (newValue?.length === 0 || newValue?.length === 1) {
                                        setRoles(newValue as ICompanySelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập địa chỉ"
                        />
                    </Col>
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalUser;