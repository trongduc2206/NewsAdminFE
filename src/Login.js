import {Button, Form, Input, Layout, Menu, notification} from "antd";
import {Content, Footer, Header} from "antd/es/layout/layout";
import 'antd/dist/antd.min.css';
import AuthService from "./service/AuthService";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {LayoutTwoTone} from "@ant-design/icons";
export function Login(props) {
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const onLoginFormFinish = (values) => {
        // console.log(values)
        values.type='SYSTEM'
        AuthService.signin(values).then(
            response => {
                console.log(response.data.data.roles)
                if(response.data.data.roles.includes('ROLE_ADMIN')) {
                    // console.log("login success")
                    localStorage.setItem("user", JSON.stringify(response.data.data));
                    navigate("/user-mng")
                    notification.success({
                        message: 'Đăng nhập thành công',
                        // description: 'Tên đăng nhập hoặc mật khẩu không đúng'
                    })
                } else {
                    notification.error({
                        message: 'Đăng nhập thất bại',
                        description: "Tài khoản hoặc mật khẩu không đúng"
                    })
                }
            }
        ).catch(
            error => {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: error.response.data.status.messages
                })
            }
        )
    }
    useEffect(() => {
        const user = localStorage.getItem('user')
        if(user) {
            navigate("/user-mng")
        }
    },[])
    return (
        <Layout className="layout" style={{height: '100vh'}}>
            <Header style={{backgroundColor: "#096dd9"}} className="header">
                {/*<div className="logo"/>*/}
                {/*/>*/}
                <div style={{display: 'flex'}}>
                    <LayoutTwoTone style={{alignItems:'center', marginTop: '23px', fontSize: '20px'}} twoToneColor='#faf14d'/>
                    <h1 style={{ color:'#faf14d', marginLeft: '3px'}}>News Admin</h1>
                </div>
            </Header>
            <Content
                style={{
                    padding: '0 50px',
                    backgroundColor: "white"
                }}
            >
                <div className="site-layout-content" style={{display: 'flex', paddingLeft: 300, paddingTop: 100}}>
                    <div>
                        <img src="https://img.freepik.com/free-vector/news-concept-illustration_114360-5648.jpg?w=2000"
                             style={{height: '400px'}}/>
                    </div>
                    <div style={{width: '100%', paddingTop: 50}}>
                        <Form
                            form={form}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 8,
                            }}
                            layout="vertical"
                            name="form_in_modal"
                            onFinish={onLoginFormFinish}
                            // onFinishFailed={onLoginFormFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                label="Tên đăng nhập"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tên đăng nhập không được đẻ trống!',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mật khẩu không được đẻ trống!',
                                    },
                                ]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                {/*<div className="site-layout-content">Content</div>*/}
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                    backgroundColor: '#faf14d',
                    fontWeight: 100,
                    color: '#096dd9'
                }}
            >
                Hệ thống quản lý báo điện tử News
            </Footer>
        </Layout>
    )
}