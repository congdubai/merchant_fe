import { IMerchant, IMerchantByYear, ITransaction, ITransactionSummary } from "@/types/backend";
import { CSSProperties, useEffect, useState } from 'react';
import { Alert, Button, Col, ConfigProvider, DatePicker, Flex, Image, Input, notification, Popover, Row, Space, Table, Tag, TagProps, Typography } from 'antd';
import { FileExcelOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Card } from "./report/Card/Cart";
import { callExportMerchantByYear, callExportTransactionByMerchant, callExportTransactionSummary, callReportMerchantByYear, callTransactionByMerchant, callTransactionSummary } from "@/config/api";
import { MERCHANT_COLUMNS, TRANSACTION_COLUMNS, TRANSACTION_SUMMAY_COLUMNS } from "./report/Column"
const { RangePicker } = DatePicker;

export const COLOR = {
    50: '#e0f1ff',
    100: '#b0d2ff',
    200: '#7fb0ff',
    300: '#4d8bff',
    400: '#1e79fe',
    500: '#076ee5',
    600: '#0062b3',
    700: '#004f81',
    800: '#003650',
    900: '#001620',
    borderColor: '#E7EAF3B2',
};

const cardStyles: CSSProperties = {
    height: '100%',
};

const ReportPage = () => {
    const [exportByYear, setExportByYear] = useState<IMerchantByYear[]>([]);
    const [exportByYearLoading, setExportByYearLoading] = useState(false);
    const [exportByYearError, setExportByYearError] = useState<any>(null);

    const [transactionSummary, setTransactionSummary] = useState<ITransactionSummary[]>([]);
    const [transactionSummaryLoading, setTransactionSummaryLoading] = useState(false);
    const [transactionSummaryError, setTransactionSummaryError] = useState<any>(null);

    const [transaction, setTransaction] = useState<ITransaction[]>([]);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [transactionError, setTransactionError] = useState<any>(null);

    const [year, setYear] = useState<dayjs.Dayjs>(dayjs());

    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);

    const [dateRange1, setDateRange1] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [merchantSearch, setMerchantSearch] = useState("");
    const [merchantId, setMerchantId] = useState("");

    useEffect(() => {
        const reportMerchantByYear = async () => {
            try {
                setExportByYearLoading(true);
                const res = await callReportMerchantByYear(year.format("YYYY"));
                setExportByYear(res.data!);
            } catch (err: any) {
                setExportByYearError(err.message || 'Đã có lỗi xảy ra');
            } finally {
                setExportByYearLoading(false);
            }
        };
        reportMerchantByYear();
    }, [year])



    useEffect(() => {
        const fetchTransactionSummary = async () => {
            try {
                setTransactionSummaryLoading(true);

                const [start, end] = dateRange;

                const res = await callTransactionSummary(
                    start.startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                    end.endOf('day').format("YYYY-MM-DDTHH:mm:ss")
                );

                setTransactionSummary(res.data!);

            } catch (err: any) {
                setTransactionSummaryError(err.message || 'Đã có lỗi xảy ra');
            } finally {
                setTransactionSummaryLoading(false);
            }
        };
        fetchTransactionSummary();
    }, [dateRange])

    useEffect(() => {
        const fetchTransactionbyMerchant = async () => {
            if (!merchantId) return;
            try {
                setTransactionLoading(true);
                const [start, end] = dateRange1;

                const res = await callTransactionByMerchant(
                    merchantId,
                    start.startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                    end.endOf('day').format("YYYY-MM-DDTHH:mm:ss")
                );
                if (res.errorCode != 200) {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.errorDesc
                    });
                }
                setTransaction(res.data!);
            } catch (err: any) {
                setTransactionError(err.message || 'Đã có lỗi xảy ra');

            } finally {
                setTransactionLoading(false);
            }
        };

        fetchTransactionbyMerchant();
    }, [merchantId, dateRange1]);

    const exportMerchantByYear = async () => {
        try {
            const response = await callExportMerchantByYear(year.format("YYYY"));
            // Tạo URL từ file blob
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "merchant_year_" + year.format("YYYY") + ".xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
        }
    };


    const exportTransactionSummary = async () => {
        try {
            const [start, end] = dateRange;

            const response = await callExportTransactionSummary(start.startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                end.endOf('day').format("YYYY-MM-DDTHH:mm:ss"));

            // Tạo URL từ file blob
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "TransactionSummary_date_" + start.startOf('day').format("YYYY-MM-DDTHH:mm:ss") + "To" +
                end.endOf('day').format("YYYY-MM-DDTHH:mm:ss") + ".xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
        }
    };

    const exportTransactionByMerchant = async () => {
        const key = 'exportNotification';
        try {
            notification.info({
                key,
                message: 'Đang xử lý',
                description: 'Hệ thống đang xuất báo cáo, vui lòng chờ...',
                placement: 'topRight',
                duration: null
            });

            const [start, end] = dateRange1;

            const res = await callExportTransactionByMerchant(
                merchantId,
                start.startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                end.endOf('day').format("YYYY-MM-DDTHH:mm:ss")
            );

            // Đóng thông báo "Đang xử lý"
            notification.destroy(key);

            // Tải file
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Transaction_date_${start.format("YYYY-MM-DD_HH-mm-ss")}_To_${end.format("YYYY-MM-DD_HH-mm-ss")}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            // Đóng thông báo "Đang xử lý"
            notification.destroy(key);

            notification.error({
                message: 'Lỗi',
                description: 'Xuất báo cáo thất bại!',
                placement: 'topRight',
            });
            console.error("Lỗi khi xuất Excel:", error);
        }
    };




    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: COLOR['500'],
                        borderRadius: 6,
                        fontFamily: 'Lato, sans-serif',
                    },
                    components: {
                        Button: {
                            colorLink: COLOR['500'],
                            colorLinkActive: COLOR['700'],
                            colorLinkHover: COLOR['300'],
                        },
                        Card: {
                            colorBorderSecondary: COLOR['borderColor'],
                        },
                        Table: {
                            borderColor: COLOR['100'],
                            colorBgContainer: 'none',
                            headerBg: 'none',
                            rowHoverBg: COLOR['50'],

                        },
                    },
                }}
            >
                <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
                    <Row
                        gutter={[
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                        ]}
                        style={{
                            borderRadius: 6,
                            fontFamily: 'Lato, sans-serif',
                        }}
                    >
                        <>
                            <Col lg={24}>
                                <Card title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Báo cáo merchant theo năm</span>
                                        <Button style={{ marginLeft: 700, color: "white", background: "#1D6F42" }} onClick={() => { exportMerchantByYear() }}>Xuất Excel<FileExcelOutlined /></Button>
                                        <DatePicker
                                            value={year}
                                            onChange={(date) => {
                                                if (date) setYear(date);
                                            }}
                                            picker="year"
                                            format="YYYY"
                                            allowClear={false}
                                        />

                                    </div>
                                } style={cardStyles}>
                                    {exportByYearError ? (
                                        <Alert
                                            message="Error"
                                            description={exportByYearError.toString()}
                                            type="error"
                                            showIcon
                                        />
                                    ) : (
                                        <Table
                                            columns={MERCHANT_COLUMNS}
                                            dataSource={exportByYear}
                                            loading={exportByYearLoading}
                                            rowKey="id"
                                            className="overflow-scroll"
                                            summary={(pageData) => {
                                                let totals: Record<string, number> = {
                                                    thang01: 0, thang02: 0, thang03: 0, thang04: 0, thang05: 0, thang06: 0,
                                                    thang07: 0, thang08: 0, thang09: 0, thang10: 0, thang11: 0, thang12: 0
                                                };

                                                pageData.forEach(item => {
                                                    totals.thang01 += item.thang01 || 0;
                                                    totals.thang02 += item.thang02 || 0;
                                                    totals.thang03 += item.thang03 || 0;
                                                    totals.thang04 += item.thang04 || 0;
                                                    totals.thang05 += item.thang05 || 0;
                                                    totals.thang06 += item.thang06 || 0;
                                                    totals.thang07 += item.thang07 || 0;
                                                    totals.thang08 += item.thang08 || 0;
                                                    totals.thang09 += item.thang09 || 0;
                                                    totals.thang10 += item.thang10 || 0;
                                                    totals.thang11 += item.thang11 || 0;
                                                    totals.thang12 += item.thang12 || 0;
                                                });

                                                return (
                                                    <Table.Summary.Row>
                                                        <Table.Summary.Cell index={0}><b>Tổng cộng</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={1}><b>{totals.thang01}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={2}><b>{totals.thang02}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={3}><b>{totals.thang03}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={4}><b>{totals.thang04}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={5}><b>{totals.thang05}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={6}><b>{totals.thang06}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={7}><b>{totals.thang07}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={8}><b>{totals.thang08}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={9}><b>{totals.thang09}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={10}><b>{totals.thang10}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={11}><b>{totals.thang11}</b></Table.Summary.Cell>
                                                        <Table.Summary.Cell index={12}><b>{totals.thang12}</b></Table.Summary.Cell>
                                                    </Table.Summary.Row>
                                                );
                                            }}
                                        />
                                    )}
                                </Card>
                            </Col>

                            <Col lg={24}>
                                <Card title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Báo cáo số lượng giao dịch</span>
                                        <Button style={{ marginLeft: 540, color: "white", background: "#1D6F42" }} onClick={() => { exportTransactionSummary() }}>Xuất Excel<FileExcelOutlined /></Button>
                                        <RangePicker
                                            value={dateRange}
                                            onChange={(dates) => {
                                                if (dates) setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                            }}
                                            format="YYYY/MM/DD"
                                            allowClear={false}
                                        />

                                    </div>
                                } style={cardStyles}>
                                    {transactionSummaryError ? (
                                        <Alert
                                            message="Error"
                                            description={transactionSummaryError.toString()}
                                            type="error"
                                            showIcon
                                        />
                                    ) : (
                                        <Table
                                            columns={TRANSACTION_SUMMAY_COLUMNS}
                                            dataSource={transactionSummary}
                                            loading={transactionSummaryLoading}
                                            rowKey="id"
                                            className="overflow-scroll"
                                        />
                                    )}
                                </Card>
                            </Col>

                            <Col lg={24}>
                                <Card title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Báo cáo giao dịch theo merchant</span>
                                        <Button style={{ marginLeft: 150, color: "white", background: "#1D6F42" }} onClick={() => { exportTransactionByMerchant() }}>Xuất Excel<FileExcelOutlined /></Button>
                                        <Input
                                            placeholder="Nhập mã merchant"
                                            value={merchantSearch}
                                            onChange={(e) => setMerchantSearch(e.target.value)}
                                            style={{ width: 240 }}
                                        />

                                        <Button
                                            style={{ marginLeft: -15, background: "yellow", fontWeight: 500 }}
                                            onClick={() => setMerchantId(merchantSearch)}
                                        >
                                            Tìm kiếm
                                        </Button>

                                        <RangePicker
                                            value={dateRange1}
                                            onChange={(dates) => {
                                                if (dates) setDateRange1(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                            }}
                                            format="YYYY/MM/DD"
                                            allowClear={false}
                                        />

                                    </div>
                                } style={cardStyles}>
                                    {transactionError ? (
                                        <Alert
                                            message="Error"
                                            description={transactionError.toString()}
                                            type="error"
                                            showIcon
                                        />
                                    ) : (
                                        <Table
                                            columns={TRANSACTION_COLUMNS}
                                            dataSource={transaction}
                                            loading={transactionLoading}
                                            rowKey="id"
                                            className="overflow-scroll"
                                        />
                                    )}
                                </Card>
                            </Col>
                        </>

                    </Row>
                </div>
            </ConfigProvider >

        </>
    );
};

export default ReportPage;