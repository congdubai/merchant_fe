import { IMerchant, IMerchantByYear } from "@/types/backend";
import { CSSProperties, useEffect, useState } from 'react';
import { Alert, Col, ConfigProvider, DatePicker, Flex, Image, Popover, Row, Space, Table, Tag, TagProps, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import { Card } from "./report/Card/Cart";
import { callReportMerchantByYear } from "@/config/api";
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
                const res = await callReportMerchantByYear(year.toString())
                setExportByYear(res.data!);
            } catch (err: any) {
                setExportByYearError(err.message || 'Đã có lỗi xảy ra');
            } finally {
                setExportByYearLoading(false);
            }
        };
    })

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