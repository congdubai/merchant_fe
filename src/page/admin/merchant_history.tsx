import { Button, notification, Popconfirm, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { IMerchant, IMerchantHistory } from "../../types/backend";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DataTable from "@/components/share/data-table";
import { sfLike } from "spring-filter-query-builder";
import queryString from "query-string";
import dayjs from "dayjs";
import { fetchMerchant, searchhMerchant } from "../../redux/slice/merchantSlide";
import { callFetchMerchantsHistory, callSearchMerchants } from "@/config/api";
import ModalUpdateMerchant from "@/components/merchant/ModalUpdateMerchant";
import { fetchMerchantHistory, searchhMerchantHistory } from "@/redux/slice/merchanthistorySlide";

const MerchantHistory = () => {
    const [openModal, setOpenModnpm] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IMerchantHistory | null>(null);
    const tableRef = useRef<ActionType | null>(null);
    const isFetching = useAppSelector(state => state.merchantHistory.isFetching);
    const meta = useAppSelector(state => state.merchantHistory.meta);
    const merchants = useAppSelector(state => state.merchantHistory.result);

    const dispatch = useAppDispatch();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const reloadTable = () => {
        tableRef?.current?.reload();
    }


    const columns: ProColumns<IMerchantHistory>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            width: 100,
            hideInSearch: true,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record.id}
                    </a>
                )
            },
        },
        {
            title: 'MerchantId',
            dataIndex: 'merchantId',
            sorter: true,
        },
        {
            title: 'Số TK',
            dataIndex: 'accountNo',
            sorter: true,
        },

        {
            title: 'Thời gian thay đổi',
            dataIndex: 'changedAt',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.changedAt ? dayjs(record.changedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Người thay đổi',
            dataIndex: 'changedBy',
            hideInSearch: true,
        },
        {
            title: 'Nội dung thay đổi',
            dataIndex: 'changeContent',
            hideInSearch: true,
        },
        {
            title: 'Lí do',
            dataIndex: 'reason',
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
                            setIsUpdateModalOpen(true);
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
        console.log("params", params);
        console.log("sort", sort);
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
            <DataTable<IMerchantHistory>
                actionRef={tableRef}
                headerTitle="Danh sách lịch sử merchant"
                rowKey="id" 
                loading={isFetching}
                columns={columns}
                dataSource={merchants}
                request={async (params, sort, filter): Promise<any> => {
                    const hasSearch =
                        (params.merchantId && params.merchantId.trim()) ||
                        (params.accountNo && params.accountNo.trim());

                    if (hasSearch) {
                        const querySearch = buildQuerySearch(params, sort, filter);
                        await dispatch(searchhMerchantHistory({ query: querySearch }));
                    } else {
                        const queryAll = buildQuery(params, sort, filter);
                        await dispatch(fetchMerchantHistory({ query: queryAll }));
                    }
                }}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} rows</div>
                    ),
                }}
                rowSelection={false}
            />
            {/* <ModalUpdateMerchant
                open={isUpdateModalOpen}
                onCancel={() => {
                    setIsUpdateModalOpen(false);
                    setDataInit(null);
                }}
                dataInit={dataInit}
                reloadTable={reloadTable}
            /> */}
        </div>
    )

}

export default MerchantHistory;
