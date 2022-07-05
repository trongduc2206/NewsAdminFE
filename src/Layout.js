import {Breadcrumb, Divider, Layout, Menu, Modal, Popover} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Footer, Header} from "antd/es/layout/layout";
import {useEffect, useState} from "react";
import './Layout.css';
import 'antd/dist/antd.min.css';
import {
    FileOutlined,
    PieChartOutlined,
    UserOutlined,
    TeamOutlined,
    DesktopOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import {UserMng} from "./user-mng/UserMng";


export function MainLayout(props) {
    const {content} = props
    const [collapsed, setCollapsed] = useState(false)
    const [selectedKey, setSelectedKey] = useState()
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const items = [
        {
            label: <a href="/user-mng">Quản lý tài khoản</a>,
            key: 'user-mng',
            icon: <UserOutlined/>
        },
        {
            label: <a href="/source-mng">Quản lý nguồn tin</a>,
            key: 'source-mng',
            icon: <PieChartOutlined/>
        }
    ];
    let navigate = useNavigate();
    const {confirm} = Modal;
    const onLogout = () => {
        confirm({
            title: "Bạn có chắc muốn đăng xuất",
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                localStorage.removeItem("user");
                navigate("/login")
            },
            onCancel() {
            }
        })
    }
    useEffect(() => {
        const location = window.location.pathname.substring(1);
        console.log(location);
        setSelectedKey(location)
    },[])
    return (
        // <BrowserRouter>
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo"/>
                <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" items={items}/>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <Popover
                            placement='bottom'
                            content={
                                <div
                                >
                                    <a href="#" onClick={onLogout}>
                                        <p>Đăng xuất</p>
                                    </a>
                                </div>
                            }
                            overlayStyle={{
                                position: 'fixed'
                            }}
                            title={currentUser.username} trigger="click">
                            <a href="#" style={{marginRight: 40}}>{currentUser.username} </a>
                        </Popover>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    {/*<Breadcrumb*/}
                    {/*    style={{*/}
                    {/*        margin: '16px 0',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}
                    {/*    Bill is a cat.*/}

                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 360,
                            marginTop: 20
                        }}
                    >
                        {/*<Routes>*/}
                        {/*    /!*<Route path='/' element={<HomePage/>}/>*!/*/}
                        {/*    /!*<Route path='/' element={<NewsList/>}/>*!/*/}
                        {/*    /!*<Route path='/news/:id' element={<NewsDetail/>}/>*!/*/}
                        {/*    /!*<Route path='topic' element={<NewsTopics/>}>*!/*/}
                        {/*    /!*    <Route path=':topicKey' element={<NewsTopic/>}/>*!/*/}
                        {/*    /!*</Route>*!/*/}
                        {/*    <Route path='user' element={currentUser?<UserMng/>:null}/>*/}
                        {/*</Routes>*/}
                        {content}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
        // </BrowserRouter>
    );
}