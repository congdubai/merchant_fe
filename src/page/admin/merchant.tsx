import { Button, notification, Popconfirm, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { IMerchant } from "../../types/backend";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import DataTable from "@/components/share/data-table";
import { sfLike } from "spring-filter-query-builder";
import queryString from "query-string";
import dayjs from "dayjs";
import { fetchMerchant, searchhMerchant } from "../../redux/slice/merchantSlide";
import ModalCreateMerchant from "@/components/admin/merchant/model.create.merchant";
import ModalImportMerchant from "@/components/admin/merchant/modal.import.merchant";


const MerchantPage = () => {
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IMerchant | null>(null);
    const tableRef = useRef<ActionType | null>(null);
    const isFetching = useAppSelector(state => state.merchant.isFetching);
    const meta = useAppSelector(state => state.merchant.meta);
    const merchants = useAppSelector(state => state.merchant.result);

    const dispatch = useAppDispatch();

    const reloadTable = () => {
        tableRef?.current?.reload();
    } 

    const test = () => {
        notification.error({
            message: 'Có lỗi xảy ra',
            description: "test"
        });
    }

    const columns: ProColumns<IMerchant>[] = [
        {
            title: 'MerchantId',
            dataIndex: 'merchantId',
            width: 100,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record.merchantId}
                    </a>
                )
            },
        },
        {
            title: 'Số TK',
            dataIndex: 'accountNo',
            sorter: true,
        },
        {
            title: 'Tên',
            dataIndex: 'fullName',
            hideInSearch: true,
        },
        {
            title: 'Viết tắt',
            dataIndex: 'shortName',
            hideInSearch: true,
        },
        {
            title: 'Mã MCC',
            dataIndex: 'mcc',
            hideInSearch: true,
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            hideInSearch: true,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'location',
            hideInSearch: true,
        },
        {
            title: 'Điện thoại',
            dataIndex: 'phoneNo',
            hideInSearch: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            hideInSearch: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            valueType: 'select',
            fieldProps: {
                options: [
                    { label: 'Active', value: 'Active' },
                    { label: 'Close', value: 'Close' },
                ],
            },
        },
        {
            title: 'Mã CN',
            dataIndex: 'branchCode',
            hideInSearch: true,
        },
        {
            title: 'Ngày mở',
            dataIndex: 'openDate',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.openDate ? dayjs(record.openDate).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày đóng',
            dataIndex: 'closeDate',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.openDate ? dayjs(record.openDate).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày Sửa',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.openDate ? dayjs(record.openDate).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'createdBy',
            hideInSearch: true,
        },
        {
            title: 'Sửa bởi',
            dataIndex: 'updatedBy',
            hideInSearch: true,
        },
        {

            title: 'Chức năng',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500', 
                        }}
                        type=""
                        onClick={() => {
                            setDataInit(entity);
                            test();
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa size"}
                        description={"Bạn có chắc chắn muốn xóa size này ?"}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }}
                            />
                        </span>
                    </Popconfirm>
                </Space>
            ),

        },
    ];
    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        if (clone.merchantId) q.filter = `${sfLike("merchantId", clone.merchantId)}`;

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        return temp;
    }

    const buildQuerySearch = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        if (clone.merchantId) q.filter = `${sfLike("merchantId", clone.merchantId)}`;

        if (clone.accountNo) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("accountNo", clone.accountNo)}` :
                `${sfLike("accountNo", clone.accountNo)}`;
        }
        if (clone.status) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("status", clone.status)}` :
                `${sfLike("status", clone.status)}`;
        }


        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }


    return (
        <div>
            <DataTable<IMerchant>
                actionRef={tableRef}
                headerTitle="Danh sách Merchant"
                rowKey="merchantId"
                loading={isFetching}
                columns={columns}
                dataSource={merchants}
                request={async (params, sort, filter): Promise<any> => {
                    const hasSearch = params.merchantId && params.merchantId.trim() || params.accountNo && params.accountNo.trim() ||
                        params.status && params.status.trim() !== '';

                    if (hasSearch) {
                        const querySearch = buildQuerySearch(params, sort, filter);
                        await dispatch(searchhMerchant({ query: querySearch }));
                    } else {
                        const queryAll = buildQuery(params, sort, filter);
                        await dispatch(fetchMerchant({ query: queryAll }));
                    }
                }}

                scroll={{ x: true }}
                pagination={
                    {
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                rowSelection={false}
                toolBarRender={() => [
                    <Space key="main-actions">
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => setOpenModalCreate(true)}
                        >
                            Thêm mới
                        </Button>
                        <Button
                            icon={<UploadOutlined />}
                            type="default"
                            onClick={() => setOpenModalImport(true)}
                        >
                            Thêm nhiều
                        </Button>
                    </Space>
                ]}
            />
            
             <ModalCreateMerchant
                openModal={openModalCreate}
                setOpenModal={setOpenModalCreate}
                reloadTable={reloadTable} 
            />
            <ModalImportMerchant
                openModal={openModalImport}
                setOpenModal={setOpenModalImport}
                reloadTable={reloadTable}
            />
        </div>
    )

}

export default MerchantPage;
