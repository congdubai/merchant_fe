import { Button, message, notification, Popconfirm, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DataTable from "@/components/share/data-table";
import { sfLike } from "spring-filter-query-builder";
import queryString from "query-string";
import { IMcc } from "../types/backend";
import { fetchMcc } from "../redux/slice/mccSlice";
import ModalMcc from "@/components/admin/mcc/modal.mcc";
import { callDeleteMcc } from "@/config/api";

const MccPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IMcc | null>(null);
    const tableRef = useRef<ActionType | null>(null);

    const isFetching = useAppSelector(state => state.mcc.isFetching);
    const meta = useAppSelector(state => state.mcc.meta);
    const mccList = useAppSelector(state => state.mcc.result);

    const dispatch = useAppDispatch();

    const reloadTable = () => {
        tableRef?.current?.reload();
    };
    
    const handleDeleteMcc = async (code: string | undefined) => {
        if (code) {
            try {
                const res = await callDeleteMcc(code);
                // Backend trả về chuỗi, kiểm tra xem có phải là string không
                if (typeof res.data === 'string') {
                    message.success(res.data); // Hiển thị thông báo từ backend
                    reloadTable();
                } else {
                    // Fallback nếu API trả về cái gì đó khác
                    message.success("Xóa thành công!");
                    reloadTable();
                }
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message ?? "Có lỗi không xác định";
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: errorMessage
                });
            }
        }
    }
    const columns: ProColumns<IMcc>[] = [
        {
            title: "Mã MCC",
            dataIndex: "code",
            sorter: true,
            width: 100,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
        },
        {
            title: "Mô tả (EN)",
            dataIndex: "descriptionEn",
            hideInSearch: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            hideInSearch: true,
            render: (value) => value ? "Hoạt động" : "Ngừng",
            width: 120,
        },
        {
            title: "Chức năng",
            hideInSearch: true, 
            width: 100,
            render: (_value, entity) => (
                <Space>
                    <EditOutlined
                        style={{ fontSize: 20, color: "#ffa500", cursor: "pointer" }}
                        onClick={() => {
                            setDataInit(entity);
                            setOpenModal(true);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title="Xác nhận xóa MCC"
                        description="Bạn có chắc chắn muốn xóa MCC này?"
                        onConfirm={() => handleDeleteMcc(entity.code)} // <<< Đã có hàm để gọi
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer" }}>
                            <DeleteOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
                        </span>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (clone.code) q.filter += `${sfLike("code", clone.code)}`;
        if (clone.description) {
            if (q.filter) q.filter += " and ";
            q.filter += `${sfLike("description", clone.description)}`;
        }
        
        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort?.code) sortBy = `sort=code,${sort.code === 'ascend' ? 'asc' : 'desc'}`;
        if (sort?.description) sortBy = `sort=description,${sort.description === 'ascend' ? 'asc' : 'desc'}`;
        
        if (sortBy) temp += `&${sortBy}`;
        
        return temp;
    };

    return (
        <div>
            <DataTable<IMcc>
                actionRef={tableRef}
                headerTitle="Danh sách MCC"
                rowKey="code"
                loading={isFetching}
                columns={columns}
                dataSource={mccList}
                request={async (params, sort): Promise<any> => {
                    const query = buildQuery(params, sort);
                    dispatch(fetchMcc({ query }));
                    return {
                        data: mccList,
                        success: true,
                        total: meta.total
                    }
                }}
                scroll={{ x: true }}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total, 
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} mục`,
                }}
                rowSelection={false}
                toolBarRender={() => [
                    <Button 
                        icon={<PlusOutlined />} 
                        type="primary" 
                        onClick={() => {
                            setDataInit(null);
                            setOpenModal(true);
                        }}
                    >
                        Thêm mới
                    </Button>
                ]}
            />
            <ModalMcc
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default MccPage;