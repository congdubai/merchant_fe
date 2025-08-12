import React, { useState, useEffect } from 'react';
import {
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    ScheduleOutlined,
    SkinOutlined,
    ShoppingOutlined,
    FormatPainterOutlined,
    TagsOutlined,
    HomeOutlined,
    ClusterOutlined,
    BarsOutlined,
    ReconciliationOutlined,
    HeartTwoTone,
} from '@ant-design/icons';
import { Layout, Menu,  Button } from 'antd';
import { Outlet, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { Footer } from 'antd/es/layout/layout';
;

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);


    useEffect(() => {

        const fixedMenu = [
            { label: <Link to='/admin'>Trang chủ</Link>, key: '/admin', icon: <HomeOutlined /> },
            { label: <Link to='/admin/user'>Quản lý người dùng</Link>, key: '/admin/user', icon: <UserOutlined /> },
            { label: <Link to='/admin/role'>Quản lý vai trò</Link>, key: '/admin/role', icon: <ClusterOutlined /> },
            { label: <Link to='/admin/category'>Quản lý danh mục</Link>, key: '/admin/category', icon: <BarsOutlined /> },
            { label: <Link to='/admin/product'>Quản lý sản phẩm</Link>, key: '/admin/product', icon: <SkinOutlined /> },
            { label: <Link to='/admin/productDetail'>Quản lý chi tiết sản phẩm</Link>, key: '/admin/productDetail', icon: <ReconciliationOutlined /> },
            { label: <Link to='/admin/color'>Quản lý màu sắc</Link>, key: '/admin/color', icon: <FormatPainterOutlined /> },
            { label: <Link to='/admin/size'>Quản lý kích thước</Link>, key: '/admin/size', icon: <ApiOutlined /> },
            { label: <Link to='/admin/discount'>Quản lý giảm giá</Link>, key: '/admin/discount', icon: <TagsOutlined /> },
            { label: <Link to='/admin/order'>Quản lý đơn hàng</Link>, key: '/admin/order', icon: <ShoppingOutlined /> },
            { label: <Link to='/admin/chat'>Nhắn tin</Link>, key: '/admin/chat', icon: <AliwangwangOutlined /> },
            { label: <Link to='/admin/export'>Thống kê</Link>, key: '/admin/export', icon: <ScheduleOutlined /> },


        ];
        setMenuItems(fixedMenu);
    }, []);

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location]);


    return (
        <>
            <Layout style={{ marginLeft: !isMobile ? (collapsed ? 80 : 200) : 0, transition: 'all 0.2s' }}
                className="layout-admin"
            >
                {!isMobile ? (
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                        width={200} // bạn có thể thay đổi width tùy theo thiết kế
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100vh',
                            zIndex: 1000,
                            overflow: 'auto',
                            background: '#fff',
                            boxShadow: '2px 0 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div
                            style={{
                                height: 64,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: 18,
                                borderBottom: '1px solid #f0f0f0',
                            }}
                        >
                            <BankOutlined style={{ marginRight: 8 }} />
                            {!collapsed && 'ADMIN'}
                        </div>

                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                            style={{ borderRight: 0 }}
                        />
                    </Sider>
                ) : (
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                )}


                <Layout>
                    {!isMobile &&
                        <div className='admin-header' style={{ display: "flex", justifyContent: "space-between", marginRight: 20 }}>
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 10, textAlign: 'center' }}>
                        React Typescript series Nest.JS &copy; Congdubai - Made with <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;