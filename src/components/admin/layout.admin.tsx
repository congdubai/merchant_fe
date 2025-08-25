import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    BugOutlined,
    ScheduleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);

    const permissions = useAppSelector(state => state.account.user.role.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        if (permissions?.length || ACL_ENABLE === 'false') {

            const viewMerchant = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.MERCHANT.GET_MERCHANT.apiPath
                && item.method === ALL_PERMISSIONS.MERCHANT.GET_MERCHANT.method
            )
            const viewMerchant_Export = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.MERCHANT_EXPORT.GET_SUMMARY_TRANSACTION_BY_MERCHANT.apiPath
                && item.method === ALL_PERMISSIONS.MERCHANT_EXPORT.GET_SUMMARY_TRANSACTION_BY_MERCHANT.method
            )
            const viewUser = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )
            const viewMERCHANT_HISTORY = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.MERCHANT_HISTORY.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.MERCHANT_HISTORY.GET_PAGINATE.method
            )



            const viewRole = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            )

            const viewPermission = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )
            const viewMCC = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.MCC.GET_ALL.apiPath
                && item.method === ALL_PERMISSIONS.MCC.GET_ALL.method
            )

            // { label: <Link to='/admin'>Quản lý Merchant</Link>, key: '/admin', icon: <HomeOutlined /> },
            // { label: <Link to='/admin/report'>Báo cáo</Link>, key: '/admin/report', icon: <UserOutlined /> },
            // { label: <Link to='/admin/merchant-history'>Merchant History</Link>, key: '/admin/merchant-history', icon: <UserOutlined /> },
            // { label: <Link to='/admin/user'>User</Link>, key: '/admin/user', icon: <UserOutlined /> },
            // { label: <Link to='/admin/role'>Role</Link>, key: '/admin/role', icon: <UserOutlined /> },
            // { label: <Link to='/admin/permisson'>Permission</Link>, key: '/admin/permisson', icon: <UserOutlined /> },
            // { label: <Link to='/admin/mcc'>Quản lý Mcc</Link>, key: '/admin/mcc', icon: <BankOutlined /> },
            const full = [
                // {
                //     label: <Link to='/admin'>Quản lý Merchant</Link>,
                //     key: '/admin',
                //     icon: <AppstoreOutlined />
                // },
                ...(viewMerchant || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin'>Quản lý Merchant</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />,
                }] : []),
                ...(viewMerchant_Export || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/report'>Báo cáo</Link>,
                    key: '/admin/report',
                    icon: <UserOutlined />,
                }] : []),
                ...(viewMERCHANT_HISTORY || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/merchant-history'>Merchant History</Link>,
                    key: '/admin/merchant-history',
                    icon: <UserOutlined />,
                }] : []),

                ...(viewUser || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/user'>User</Link>,
                    key: '/admin/user',
                    icon: <UserOutlined />
                }] : []),
                // ...(viewMERCHANT_HISTORY || ACL_ENABLE === 'false' ? [{
                //     label: <Link to='/admin/merchant-history'>Merchant History</Link>,
                //     key: '/admin/merchant-history',
                //     icon: <ScheduleOutlined />
                // }] : []),


                ...(viewPermission || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/permisson'>Permission</Link>,
                    key: '/admin/permisson',
                    icon: <ApiOutlined />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/role'>Role</Link>,
                    key: '/admin/role',
                    icon: <ExceptionOutlined />
                }] : []),
                ...(viewMCC || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/mcc'>Quản lý Mcc</Link>,
                    key: '/admin/mcc',
                    icon: <ExceptionOutlined />
                }] : []),
            ];

            setMenuItems(full);
        }
    }, [permissions])
    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.errorCode === 200) {
            console.log("đã chạy vô consolog chơi");
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    // if (isMobile) {
    //     items.push({
    //         label: <label
    //             style={{ cursor: 'pointer' }}
    //             onClick={() => handleLogout()}
    //         >Đăng xuất</label>,
    //         key: 'logout',
    //         icon: <LogoutOutlined />
    //     })
    // }

    const itemsDropdown: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: 'Đăng xuất',
            key: 'logout',
            onClick: handleLogout, // <-- gán trực tiếp ở đây
        },
    ];
    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                {!isMobile ?
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            <BugOutlined />  ADMIN
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    :
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                }

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

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    Welcome {user?.name}
                                    <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>

                                </Space>
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    {/* <Footer style={{ padding: 10, textAlign: 'center' }}>
                        React Typescript series Nest.JS &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                    </Footer> */}
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;