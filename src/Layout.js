import {Breadcrumb, Layout, Menu} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Footer, Header} from "antd/es/layout/layout";
import {useState} from "react";
import './Layout.css';
import 'antd/dist/antd.min.css';
import {FileOutlined, PieChartOutlined, UserOutlined, TeamOutlined, DesktopOutlined} from '@ant-design/icons';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UserMng} from "./user-mng/UserMng";


export function MainLayout(props) {
    const [collapsed, setCollapsed] = useState(false)

    const items = [
        {
            label: <a href="/user">Quản lý tài khoản</a>,
            key: 'user-mng',
            icon: <UserOutlined/>
        },
        {
            label: <a href="/user">Quản lý nguồn tin</a>,
            key: 'source-mng',
            icon: <PieChartOutlined/>
        }
    ];

    return (
        <BrowserRouter>
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['user-mng']} mode="inline" items={items}/>
                </Sider>
                <Layout className="site-layout">
                    <Header
                        className="site-layout-background"
                        style={{
                            padding: 0,
                        }}
                    />
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
                            <Routes>
                                {/*<Route path='/' element={<HomePage/>}/>*/}
                                {/*<Route path='/' element={<NewsList/>}/>*/}
                                {/*<Route path='/news/:id' element={<NewsDetail/>}/>*/}
                                {/*<Route path='topic' element={<NewsTopics/>}>*/}
                                {/*    <Route path=':topicKey' element={<NewsTopic/>}/>*/}
                                {/*</Route>*/}
                                <Route path='user' element={<UserMng/>}/>
                            </Routes>
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
        </BrowserRouter>
    );
}