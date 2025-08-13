import { IMerchant, IMerchantByYear } from "@/types/backend";
import { CSSProperties, useEffect, useState } from 'react';
import { Alert, Button, Col, ConfigProvider, DatePicker, Flex, Image, Popover, Row, Space, Table, Tag, TagProps, Typography } from 'antd';
import { FileExcelOutlined, StarFilled } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import { Card } from "./report/Card/Cart";
import { callExportMerchantByYear, callReportMerchantByYear } from "@/config/api";
import Ribbon from "antd/es/badge/Ribbon";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    const [year, setYear] = useState<dayjs.Dayjs>(dayjs());

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



    const PRODUCTS_COLUMNS: ColumnsType<IMerchantByYear> = [
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
                                            columns={PRODUCTS_COLUMNS}
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
                                            columns={PRODUCTS_COLUMNS}
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
                        </>

                    </Row>
                </div>
            </ConfigProvider >

        </>
    );
};

export default ReportPage;