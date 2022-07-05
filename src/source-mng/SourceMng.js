import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Button, Descriptions, Divider, Form, Input, List, Modal, notification, Switch, Table, Tooltip} from "antd";
import {EditOutlined, ExclamationCircleOutlined, LockOutlined, ReloadOutlined, UnlockOutlined} from "@ant-design/icons";
import UserService from "../service/UserService";
import Search from "antd/es/input/Search";
import SourceService from "../service/SourceService";

export function SourceMng(props) {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState()
    const [total, setTotal] = useState()
    const [visibleSourceInfo, setVisibleSourceInfo] = useState(false)
    const [visibleEditUserInfo, setVisibleEditUserInfo] = useState(false)
    const [currentSourceInfo, setCurrentSourceInfo] = useState({})
    const [searchParams, setSearchParams] = useSearchParams()
    const [form] = Form.useForm();
    const {confirm} = Modal;
    const sourceCrawlsColumns = [
        {
            title: 'Chủ đề',
            // dataIndex: 'topicList',
            key: 'topicList',
            render: (text, record, index) => {
                console.log(record)
                return (
                    <List
                        dataSource={record.topicList}
                        renderItem={(item) => (
                            <List.Item>
                                <span>{item}</span>
                            </List.Item>
                        )}
                    />

                )
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'crawlTime',
            key: 'crawlTime',
        }
    ]
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên nguồn tin',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentSourceInfo(record)
                            setVisibleSourceInfo(true)
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
                        <span style={{color: "#3acf6b"}}>Hoạt động</span>
                    )
                } else {
                    return (
                        <span style={{color: "red"}}>Không hoạt động</span>
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
            title: 'Chế độ',
            dataIndex: 'mode',
            key: 'mode',
            render: (text, record, index) => {
                if (record.mode === 1) {
                    return (
                        <span>Theo tần suất</span>
                    )
                } else {
                    return (
                        <span>Tùy chọn</span>
                    )
                }

            }
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
                                setCurrentSourceInfo(record)
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
                        {/*{*/}
                        {/*    record.status === 0 ?*/}
                        {/*        <Tooltip title="Mở khóa">*/}
                        {/*            <Button onClick={() => {*/}
                        {/*                confirm({*/}
                        {/*                    title: "Bạn có chắc muốn mở khóa tài khoản " + record.username,*/}
                        {/*                    icon: <ExclamationCircleOutlined/>,*/}
                        {/*                    onOk() {*/}
                        {/*                        const newRecord = record*/}
                        {/*                        newRecord.status = 1*/}
                        {/*                        console.log(newRecord)*/}
                        {/*                        UserService.update(newRecord).then(*/}
                        {/*                            response => {*/}
                        {/*                                notification.success({*/}
                        {/*                                    message: 'Mở khóa thành công',*/}
                        {/*                                    // description: 'Tên đăng nhập hoặc mật khẩu không đúng'*/}
                        {/*                                })*/}
                        {/*                                window.location.reload()*/}
                        {/*                            }*/}
                        {/*                        ).catch(*/}
                        {/*                            error => {*/}
                        {/*                                console.log(error)*/}
                        {/*                                notification.error({*/}
                        {/*                                    message: 'Mở khóa tài khoản thất bại',*/}
                        {/*                                    description: error.response.data.status.messages*/}
                        {/*                                })*/}
                        {/*                            }*/}
                        {/*                        )*/}
                        {/*                    },*/}
                        {/*                    onCancel() {*/}
                        {/*                        // console.log('Cancel');*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*            }}*/}
                        {/*                    style={{marginLeft: '5px', color: "#3acf6b"}}*/}
                        {/*            >*/}
                        {/*                <UnlockOutlined/>*/}
                        {/*            </Button>*/}
                        {/*        </Tooltip>*/}
                        {/*        :*/}
                        {/*        <Tooltip title="Khóa">*/}
                        {/*            <Button onClick={() => {*/}
                        {/*                confirm({*/}
                        {/*                    title: "Bạn có chắc muốn khóa tài khoản " + record.username,*/}
                        {/*                    icon: <ExclamationCircleOutlined/>,*/}
                        {/*                    onOk() {*/}
                        {/*                        const newRecord = record*/}
                        {/*                        newRecord.status = 0*/}
                        {/*                        console.log(newRecord)*/}
                        {/*                        UserService.update(newRecord).then(*/}
                        {/*                            response => {*/}
                        {/*                                notification.success({*/}
                        {/*                                    message: 'Khóa thành công',*/}
                        {/*                                    // description: 'Tên đăng nhập hoặc mật khẩu không đúng'*/}
                        {/*                                })*/}
                        {/*                                window.location.reload()*/}
                        {/*                            }*/}
                        {/*                        ).catch(*/}
                        {/*                            error => {*/}
                        {/*                                console.log(error)*/}
                        {/*                                notification.error({*/}
                        {/*                                    message: 'Khóa tài khoản thất bại',*/}
                        {/*                                    description: error.response.data.status.messages*/}
                        {/*                                })*/}
                        {/*                            }*/}
                        {/*                        )*/}
                        {/*                    },*/}
                        {/*                    onCancel() {*/}
                        {/*                        // console.log('Cancel');*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*            }}*/}
                        {/*                    style={{marginLeft: '5px', color: "red"}}*/}
                        {/*            >*/}
                        {/*                <LockOutlined/>*/}
                        {/*            </Button>*/}
                        {/*        </Tooltip>*/}
                        {/*}*/}
                    </div>
                )
            }
        }

    ]
    const onLoginFormFinish = (values) => {
        console.log(values)
        const user = values
        if (values.status) {
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
            SourceService.getAll(pageToCallApi, 3).then(
                response => {
                    if (response.data.data) {
                        setData(response.data.data.content)
                        setTotal(response.data.data.totalElements)
                    }
                }
            )
        } else {
            const value = searchParams.get('q')
            SourceService.searchByUsername(value, pageToCallApi, 3).then(
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
            <h1 style={{textAlign: 'left'}}>Quản lý nguồn tin</h1>
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
                Danh sách nguồn tin
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
                               setCurrentSourceInfo(record)
                               setVisibleSourceInfo(true)
                           }
                       }
                   }}
            />
            <div>
                <Modal
                    title="Thông tin nguồn tin"
                    visible={visibleSourceInfo}
                    onCancel={() => {
                        setVisibleSourceInfo(false)
                    }}
                    footer={[
                        <Button onClick={() => {
                            setVisibleSourceInfo(false)
                        }}>Đóng</Button>,
                        <Button type="primary"
                                onClick={() => {
                                    form.setFieldsValue({
                                        id: currentSourceInfo.id,
                                        username: currentSourceInfo.username,
                                        email: currentSourceInfo.email,
                                        status: currentSourceInfo.status === 1
                                    })
                                    setVisibleSourceInfo(false)
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
                        <Descriptions.Item label="ID">{currentSourceInfo.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên nguồn tin">{currentSourceInfo.name}</Descriptions.Item>
                        {currentSourceInfo.mode === 1 ?
                            <Descriptions.Item
                                label="Tần suất">{currentSourceInfo.frequency + " giờ/1 lần"}</Descriptions.Item>
                            :
                            <Descriptions.Item label="Tùy chỉnh">
                                <Table columns={sourceCrawlsColumns} dataSource={currentSourceInfo.sourceCrawls}
                                       pagination={false}/>
                            </Descriptions.Item>
                        }

                        <Descriptions.Item label="Ngày tạo">{currentSourceInfo.createTime}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{currentSourceInfo.updateTime}</Descriptions.Item>
                        <Descriptions.Item
                            label="Trạng thái">{currentSourceInfo.status === 1 ? "Đang hoạt động" : "Không hoạt động"}</Descriptions.Item>
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