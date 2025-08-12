import { Button, Popconfirm, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { IMerchant } from "../types/backend";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DataTable from "../components/share/data-table";
import { sfLike } from "spring-filter-query-builder";
import queryString from "query-string";
import dayjs from "dayjs";
import { fetchMerchant } from "../redux/slice/merchantSlide";


const MerchantPage = () => {
    const [openModal, setOpenModnpm] = useState<boolean>(false);
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

    const columns: ProColumns<IMerchant>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
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
            hideInSearch: true,
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
            title: 'Ngày mở',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.openDate ? dayjs(record.openDate).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
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

        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;

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
                headerTitle="Danh sách kích thước"
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={merchants}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchMerchant({ query }))
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
                toolBarRender={(_action, _rows): any => {
                    return (
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                        >
                            Thêm mới
                        </Button>
                    );
                }}
            />

        </div>
    )

}

export default MerchantPage;
