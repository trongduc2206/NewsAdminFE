import {Button, Descriptions, Divider, Form, Input, Modal, notification, Switch, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import UserService from "../service/UserService";
import {useSearchParams} from "react-router-dom";
import Search from "antd/es/input/Search";
import {EditOutlined, ExclamationCircleOutlined, LockOutlined, ReloadOutlined, UnlockOutlined} from "@ant-design/icons";

export function UserMng(props) {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState()
    const [total, setTotal] = useState()
    const [visibleUserInfo, setVisibleUserInfo] = useState(false)
    const [visibleEditUserInfo, setVisibleEditUserInfo] = useState(false)
    const [currentUserInfo, setCurrentUserInfo] = useState({})
    const [searchParams, setSearchParams] = useSearchParams()
    const [form] = Form.useForm();
    const {confirm} = Modal;
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            render: (text, record, index) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentUserInfo(record)
                            setVisibleUserInfo(true)
                        }}
                    >
                        {text}
                    </a>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (userStatus) => {
                if (userStatus === 1) {
                    return (
                        <span style={{color: "#3acf6b"}}>Mở</span>
                    )
                } else {
                    return (
                        <span style={{color: "red"}}>Khóa</span>
                    )
                }
            }
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record, index) => {
                // console.log(record)
                return (
                    <div>
                        <Tooltip title="Sửa">
                            <Button onClick={() => {
                                setCurrentUserInfo(record)
                                form.setFieldsValue({
                                    id: record.id,
                                    username: record.username,
                                    email: record.email,
                                    status: record.status === 1
                                })
                                setVisibleEditUserInfo(true)
                            }}>
                                <EditOutlined/>
                            </Button>
                        </Tooltip>
                        {
                            record.status === 0 ?
                                <Tooltip title="Mở khóa">
                                    <Button onClick={() => {
                                        confirm({
                                            title: "Bạn có chắc muốn mở khóa tài khoản " + record.username,
                                            icon: <ExclamationCircleOutlined/>,
                                            onOk() {
                                                const newRecord = record
                                                newRecord.status = 1
                                                console.log(newRecord)
                                                UserService.update(newRecord).then(
                                                    response => {
                                                        notification.success({
                                                            message: 'Mở khóa thành công',
                                                            // description: 'Tên đăng nhập hoặc mật khẩu không đúng'
                                                        })
                                                        window.location.reload()
                                                    }
                                                ).catch(
                                                    error => {
                                                        console.log(error)
                                                        notification.error({
                                                            message: 'Mở khóa tài khoản thất bại',
                                                            description: error.response.data.status.messages
                                                        })
                                                    }
                                                )
                                            },
                                            onCancel() {
                                                // console.log('Cancel');
                                            }
                                        })
                                    }}
                                            style={{marginLeft: '5px', color: "#3acf6b"}}
                                    >
                                        <UnlockOutlined/>
                                    </Button>
                                </Tooltip>
                                :
                                <Tooltip title="Khóa">
                                    <Button onClick={() => {
                                        confirm({
                                            title: "Bạn có chắc muốn khóa tài khoản " + record.username,
                                            icon: <ExclamationCircleOutlined/>,
                                            onOk() {
                                                const newRecord = record
                                                newRecord.status = 0
                                                console.log(newRecord)
                                                UserService.update(newRecord).then(
                                                    response => {
                                                        notification.success({
                                                            message: 'Khóa thành công',
                                                            // description: 'Tên đăng nhập hoặc mật khẩu không đúng'
                                                        })
                                                        window.location.reload()
                                                    }
                                                ).catch(
                                                    error => {
                                                        console.log(error)
                                                        notification.error({
                                                            message: 'Khóa tài khoản thất bại',
                                                            description: error.response.data.status.messages
                                                        })
                                                    }
                                                )
                                            },
                                            onCancel() {
                                                // console.log('Cancel');
                                            }
                                        })
                                    }}
                                            style={{marginLeft: '5px', color: "red"}}
                                    >
                                        <LockOutlined/>
                                    </Button>
                                </Tooltip>
                        }
                    </div>
                )
            }
        }

    ]
    const onLoginFormFinish = (values) => {
        console.log(values)
        const user = values
        if(values.status) {
            user.status = 1
        } else {
            user.status = 0
        }
        console.log(user)
        UserService.update(user).then(
            response => {
                window.location.reload()
            }
        ).catch(
            error => {
                notification.error({
                    message: 'Sửa thông tin tài khoản thất bại',
                    description: error.response.data.status.messages
                })
            }
        )
    }
    const onLoginFormFinishFailed = (values) => {
        console.log(values)
    }
    const onChangePageHandle = (page) => {
        console.log(page)
        const path = window.location.pathname
        console.log(window.location.search)
        if (window.location.search !== null) {
            let newUrl = ''
            if (searchParams.get('page') === null) {
                // newUrl = window.location.href + "&page=" + page
                searchParams.append('page', page)
                setSearchParams(searchParams)
                window.location.reload()
                // window.location.href = newUrl
            } else {
                console.log(searchParams)
                searchParams.set('page', page)
                setSearchParams(searchParams)
                window.location.reload()
            }
        } else {
            setSearchParams(searchParams.append('page', page))
            // const newUrl = window.location.href + "?page=" + page
            // window.location.href = newUrl
        }
        // navigate(path + "?page=" + page)
        // window.location.reload();
        // navigate("/")
        // console.log(topicKey)
    }
    const onSearch = (values) => {
        console.log(values)
        // const searchPageUrl = '/search?q=' + values
        if (searchParams.get('page') !== null) {
            searchParams.set('page', 1)
        }
        if (searchParams.get('q') === null) {
            searchParams.append('q', values)
            setSearchParams(searchParams);
            window.location.reload()

        } else {
            console.log("q existed")
            searchParams.set('q', values);
            setSearchParams(searchParams);
            window.location.reload()
        }

    }
    // const onReload = ()
    useEffect(() => {
        const page = searchParams.get('page')
        console.log(page)
        if (page) {
            setCurrentPage(parseInt(page))
        }
        const pageToCallApi = page ? parseInt(page) - 1 : 0
        if (searchParams.get('q') === null) {
            UserService.getAll(pageToCallApi, 3).then(
                response => {
                    if (response.data.data) {
                        setData(response.data.data.content)
                        setTotal(response.data.data.totalElements)
                    }
                }
            )
        } else {
            const value = searchParams.get('q')
            UserService.searchByUsername(value, pageToCallApi, 3).then(
                response => {
                    if (response.data.data) {
                        setData(response.data.data.content)
                        setTotal(response.data.data.totalElements)
                    }
                }
            )
        }
    }, [])
    return (
        <div>
            <h1 style={{textAlign: 'left'}}>Quản lý tài khoản</h1>
            <div>
                <Search defaultValue={searchParams.get('q')}
                        style={{width: 200, marginTop: "5px", marginBottom: "15px"}} onSearch={onSearch}/>
                <Button type="primary" style={{marginLeft: 'auto', display: "block"}}
                        onClick={() => {
                            if (searchParams.get('q')) {
                                searchParams.delete('q')
                            }
                            searchParams.set('page', 1)
                            setSearchParams(searchParams)
                            window.location.reload()
                        }}>
                    <ReloadOutlined/>
                </Button>
            </div>
            <Divider orientation="left">
                Danh sách tài khoản
            </Divider>
            <Table columns={columns} dataSource={data}
                   pagination={{
                       position: "bottom",
                       pageSize: 3,
                       // total: {total},
                       defaultCurrent: 1,
                       total: total,
                       current: currentPage ? currentPage : 1,
                       onChange: onChangePageHandle,
                       showSizeChanger: false
                   }}
                   onRow={(record, rowIndex) => {
                       return {
                           onDoubleClick: event => {
                               console.log(record)
                               setCurrentUserInfo(record)
                               setVisibleUserInfo(true)
                           }
                       }
                   }}
            />
            <div>
                <Modal
                    title="Thông tin tài khoản"
                    visible={visibleUserInfo}
                    onCancel={() => {
                        setVisibleUserInfo(false)
                    }}
                    footer={[
                        <Button onClick={() => {
                            setVisibleUserInfo(false)
                        }}>Đóng</Button>,
                        <Button type="primary"
                            onClick={() => {
                                form.setFieldsValue({
                                    id: currentUserInfo.id,
                                    username: currentUserInfo.username,
                                    email: currentUserInfo.email,
                                    status: currentUserInfo.status === 1
                                })
                                setVisibleUserInfo(false)
                                setVisibleEditUserInfo(true)
                            }}
                        >
                            Sửa
                        </Button>
                    ]}
                >
                    <Descriptions
                        bordered
                        column={{
                            xxl: 2,
                            xl: 1,
                            lg: 1,
                            md: 1,
                            sm: 1,
                            xs: 1,
                        }}
                        // layout="vertical"
                    >
                        <Descriptions.Item label="ID">{currentUserInfo.id}</Descriptions.Item>
                        <Descriptions.Item label="Email">{currentUserInfo.email}</Descriptions.Item>
                        <Descriptions.Item label="Tên đăng nhập">{currentUserInfo.username}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{currentUserInfo.createTime}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{currentUserInfo.updateTime}</Descriptions.Item>
                        <Descriptions.Item
                            label="Trạng thái">{currentUserInfo.status === 1 ? "Mở" : "Khóa"}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            </div>
            <div>
                <Modal
                    title="Sửa thông tin tài khoản"
                    visible={visibleEditUserInfo}
                    onCancel={() => {
                        setVisibleEditUserInfo(false)
                    }}
                    footer={[
                        // <Button onClick={() => {
                        //     setVisibleEditUserInfo(false)
                        // }}>Hủy</Button>
                    ]}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_in_modal"
                        onFinish={onLoginFormFinish}
                        onFinishFailed={onLoginFormFinishFailed}
                    >
                        <Form.Item
                            name="id"
                            label="ID"
                        >
                           <Input disabled={true}/>
                        </Form.Item>
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
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email không được đẻ trống!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            valuePropName="checked"
                        >
                            <Switch></Switch>
                        </Form.Item>
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}