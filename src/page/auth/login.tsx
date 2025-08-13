import { loginAPI, registerAPI, sendOTP } from '@/config/api';
import {
    AlipayCircleOutlined,
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormInstance,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, message, theme, Typography, notification } from 'antd';
import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

type LoginType = 'login' | 'register';

const { Title } = Typography;

const LoginPage = () => {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('login');
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [otp, setOtp] = useState("");
    const [passWord, setPassWord] = useState("");
    const [confirmPassWord, setConfirmPassword] = useState("");
    const [counting, setCounting] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassWord, setLoginPassWord] = useState("");
    const navigate = useNavigate();
    const iconStyles: CSSProperties = {
        marginInlineStart: '8px',
        color: setAlpha(token.colorTextBase, 0.3),
        fontSize: '22px',
        verticalAlign: 'middle',
        cursor: 'pointer',
        transition: 'all 0.3s',
    };
    const sendOtp = async (email: string) => {
        if (!email) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng nhập email trước khi lấy mã OTP',
            });
            return;
        }
        try {
            const res = await sendOTP(email);
            if (res?.data) {
                message.success(`Gửi email thành công đến ${email}`);
            } else {
                notification.error({
                    message: 'Đăng ký thất bại',
                    description: res.errorDesc || 'Lỗi không xác định 2',
                });
                setCounting(false);
            }
        } catch (error) {
            message.error("Gửi OTP thất bại, vui lòng thử lại");
        }
    };

    const handleLogin = async (values: { username: string; password: string }) => {
        try {
            const { username, password } = values;
            const res = await loginAPI(username, password);
            if (res?.data?.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
                setLoginPassWord("")
                setLoginEmail("")
                message.success('Đăng nhập thành công!');
                navigate('/admin');
            } else {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: res.errorDesc || 'Lỗi không xác định',
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
            });
        }
    };

    // Hàm xử lý đăng ký
    const handleRegister = async (values: { fullname: string; email: string; password: string; confirmPassword: string; otp: string }) => {
        if (values.password !== values.confirmPassword) {
            notification.error({
                message: 'Lỗi',
                description: 'Mật khẩu và xác nhận mật khẩu không khớp',
            });
            return;
        }
        const { fullname, email, password, otp, confirmPassword } = values;

        const res = await registerAPI(fullname, email, password, otp, confirmPassword);
        if (res?.data) {
            message.success('Đăng ký thành công! Vui lòng đăng nhập');
        } else {
            notification.error({
                message: 'Đăng ký thất bại',
                description: res.errorDesc || 'Lỗi không xác định 2',
            });
        }
    };


    return (
        <ProConfigProvider hashed={false}>
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f0f5ff, #e6f7ff)',
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        background: '#fff',
                        padding: '32px',
                        borderRadius: 16,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    }}
                >
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                        Hệ thống Quản lý
                    </Title>
                    <LoginForm
                        logo="https://github.githubassets.com/favicons/favicon.png"
                        title="Github"
                        subTitle="Nền tảng lưu trữ mã nguồn lớn nhất thế giới"

                        submitter={{
                            searchConfig: {
                                submitText: loginType === 'login' ? 'Đăng nhập' : 'Đăng ký',
                            },
                            submitButtonProps: {
                                size: 'large',
                                style: {
                                    width: '100%',
                                    borderRadius: 8,
                                },
                            },
                        }}
                        onFinish={async (values) => {
                            if (loginType === 'login') {
                                await handleLogin({
                                    username: loginEmail,
                                    password: loginPassWord
                                });
                            } else {
                                await handleRegister({
                                    fullname: fullName,
                                    email: email,
                                    password: passWord,
                                    confirmPassword: confirmPassWord,
                                    otp: otp,
                                });
                            }
                        }}

                    >
                        <Tabs
                            centered
                            activeKey={loginType}
                            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                            items={[
                                { key: 'login', label: '🔑 Đăng nhập' },
                                { key: 'register', label: '📝 Đăng ký' },
                            ]}
                        />

                        {loginType === 'login' && (
                            <>
                                <ProFormText
                                    name="username"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <UserOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setLoginEmail(e.target.value)
                                    }}
                                    placeholder={'Tên đăng nhập'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                    ]}
                                />
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setLoginPassWord(e.target.value)
                                    }}
                                    placeholder={'Mật khẩu'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    ]}
                                />
                            </>
                        )}

                        {loginType === 'register' && (
                            <>
                                <ProFormText
                                    name="fullname"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <UserOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setFullName(e.target.value)
                                    }}
                                    placeholder={'Họ và tên'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                                    ]}
                                />
                                <ProFormText

                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MailOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setEmail(e.target.value)
                                    }}
                                    name="Email"
                                    placeholder={'Email'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                />
                                <ProFormCaptcha
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setOtp(e.target.value)
                                    }}
                                    captchaProps={{
                                        size: 'large',
                                    }}
                                    placeholder={'Nhập mã OTP'}
                                    captchaTextRender={(timing, count) => {
                                        if (timing) {
                                            return `${count} giây`;
                                        }
                                        return 'Lấy mã OTP';
                                    }}
                                    name="captcha"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã OTP!' },
                                    ]}
                                    onGetCaptcha={async () => {
                                        await sendOtp(email);
                                    }}

                                />
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setPassWord(e.target.value)
                                    }}
                                    placeholder={'Mật khẩu'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    ]}
                                />
                                <ProFormText.Password
                                    name="confirmPassword"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                        onChange: (e) => setConfirmPassword(e.target.value)
                                    }}
                                    placeholder={'Xác nhận mật khẩu'}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ]}
                                />
                            </>
                        )}

                        <div style={{ marginBlockEnd: 24 }}>
                            <ProFormCheckbox noStyle name="autoLogin">
                                Ghi nhớ đăng nhập
                            </ProFormCheckbox>
                            <a style={{ float: 'right' }}>Quên mật khẩu?</a>
                        </div>
                    </LoginForm>
                </div>
            </div>
        </ProConfigProvider>
    );
};

export default LoginPage;
