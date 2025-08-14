import { IMerchantByYear, ITransaction, ITransactionSummary } from '@/types/backend';
import { ColumnsType } from 'antd/lib/table/interface';


export const MERCHANT_COLUMNS: ColumnsType<IMerchantByYear> = [
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Tháng 1",
        dataIndex: "thang01",
        key: "thang01",
    },
    {
        title: "Tháng 2",
        dataIndex: "thang02",
        key: "thang02",
    },
    {
        title: "Tháng 3",
        dataIndex: "thang03",
        key: "thang03",
    },
    {
        title: "Tháng 4",
        dataIndex: "thang04",
        key: "thang04",
    },
    {
        title: "Tháng 5",
        dataIndex: "thang05",
        key: "thang05",
    },
    {
        title: "Tháng 6",
        dataIndex: "thang06",
        key: "thang06",
    },
    {
        title: "Tháng 7",
        dataIndex: "thang07",
        key: "thang07",
    },
    {
        title: "Tháng 8",
        dataIndex: "thang08",
        key: "thang08",
    },
    {
        title: "Tháng 9",
        dataIndex: "thang09",
        key: "thang09",
    },
    {
        title: "Tháng 10",
        dataIndex: "thang10",
        key: "thang10",
    },
    {
        title: "Tháng 11",
        dataIndex: "thang11",
        key: "thang11",
    },
    {
        title: "Tháng 12",
        dataIndex: "thang12",
        key: "thang12",
    }
];

export const TRANSACTION_SUMMAY_COLUMNS: ColumnsType<ITransactionSummary> = [
    {
        title: "số tài khoản",
        dataIndex: "accountNo",
        key: "accountNo",
    },
    {
        title: "merchant_Id",
        dataIndex: "merchantId",
        key: "merchantId",
    },
    {
        title: "Viết tắt",
        dataIndex: "shortName",
        key: "shortName",
    },
    {
        title: "Thành công",
        dataIndex: "successCount",
        key: "successCount",
    },
    {
        title: "Thất bại",
        dataIndex: "failedCount",
        key: "failedCount",
    },
    {
        title: "Time out",
        dataIndex: "timeoutCount",
        key: "timeoutCount",
    },
    {
        title: "Tổng cộng",
        dataIndex: "totalCount",
        key: "totalCount",
    }
];
export const TRANSACTION_COLUMNS: ColumnsType<ITransaction> = [
    {
        title: "coreRef",
        dataIndex: "coreRef",
        key: "coreRef",
    },
    {
        title: "transactionRef",
        dataIndex: "transactionRef",
        key: "transactionRef",
    },
    {
        title: "traceNo",
        dataIndex: "traceNo",
        key: "traceNo",
    },
    {
        title: "transactionDate",
        dataIndex: "transactionDate",
        key: "transactionDate",
    },
    {
        title: "status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "senderAccount",
        dataIndex: "senderAccount",
        key: "senderAccount",
    },
    {
        title: "senderBank",
        dataIndex: "senderBank",
        key: "senderBank",
    },
    {
        title: "receiverAccount",
        dataIndex: "receiverAccount",
        key: "receiverAccount",
    }
];