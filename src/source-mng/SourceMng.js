import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {
    Button,
    Descriptions,
    Divider,
    Form,
    Input, InputNumber,
    List,
    Modal,
    notification,
    Select, Space,
    Switch,
    Table, TimePicker,
    Tooltip, TreeDataNode, TreeSelect
} from "antd";
import {
    CloseCircleOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    LockOutlined, MinusOutlined, PlayCircleOutlined,
    PlusOutlined,
    ReloadOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import UserService from "../service/UserService";
import Search from "antd/es/input/Search";
import SourceService from "../service/SourceService";
import {Option} from "antd/es/mentions";
import {CustomModeData} from "./CustomModeData";
import moment from "moment";
import {connect} from "react-redux";
import TopicService from "../service/TopicService";

export function SourceMng(props) {
    const {sourceCustomData, changeSourceCustomData} = props
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState()
    const [total, setTotal] = useState()
    const [visibleSourceInfo, setVisibleSourceInfo] = useState(false)
    const [visibleEditSourceInfo, setVisibleEditSourceInfo] = useState(false)
    const [visibleAddSourceInfo, setVisibleAddSourceInfo] = useState(false)
    const [currentSourceInfo, setCurrentSourceInfo] = useState({})
    const [frequencyFormItemHidden, setFrequencyFormItemHidden] = useState(false)
    const [frequencyAddFormItemHidden, setFrequencyAddFormItemHidden] = useState(true)
    const [customFormItemHidden, setCustomFormItemHidden] = useState(false)
    const [customAddFormItemHidden, setCustomAddFormItemHidden] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const {confirm} = Modal;
    const [dataDisplay, setDataDisplay] = useState([])
    const [dataDisplayAdd, setDataDisplayAdd] = useState([])
    const [dataToCallApi, setDataToCallApi] = useState([])
    const [treeData, setTreeData] = useState([])
    const customData = []
    const [disabledMinutes, setDisabledMinutes] = useState([])
    const [disabledMinutesAddForm, setDisabledMinutesAddForm] = useState([])

    const onLoadTreeData = () => {
        console.log("on tree loading")
        TopicService.getTopicDisplay().then(
            response => {
                if (response.data.data) {
                    const convertToTree = response.data.data.map((topic) => {
                        return (
                            {
                                title: topic.label,
                                value: topic.key,
                                children: topic.children ? topic.children.map((childLv2) => {
                                        return {
                                            title: childLv2.label,
                                            value: childLv2.key,
                                            children: childLv2.children ? childLv2.children.map((childLv3) => {
                                                    return {
                                                        title: childLv3.label,
                                                        value: childLv3.key
                                                    }
                                                })
                                                : null
                                        }
                                    })
                                    : null
                            }
                        )
                    })
                    setTreeData(convertToTree)
                }
            }
        )
    }
    const sourceCrawlEditColumns = [
        {
            title: 'Chủ đề',
            // dataIndex: 'topicList',
            key: 'topicList',
            render: (text, record, index) => {
                console.log(record)
                const topicList = record.topicCrawls.map(topicCrawl => topicCrawl.topicKey)
                // if (record.topicCrawls.length > 0) {
                if (topicList.length > 0) {
                    return (
                        <List
                            // dataSource={record.topicList}
                            dataSource={topicList}
                            renderItem={(item) => (
                                <List.Item>
                                    <TreeSelect
                                        value={item}
                                        onChange={(value) => {
                                            setDataDisplay(dataDisplay.map((crawl) => {
                                                if (record.crawlTime === crawl.crawlTime) {
                                                    crawl.topicCrawls = crawl.topicCrawls.map((topicCrawl) => {
                                                        if (topicCrawl.topicKey == item) {
                                                            topicCrawl.topicKey = value
                                                        }
                                                        return topicCrawl
                                                    })
                                                }
                                                return crawl
                                            }))
                                        }}
                                        treeData={treeData}
                                    />
                                    {/*: <span>{item}</span>*/}
                                    {/*}*/}
                                    {record.topicCrawls.length > 1 ?
                                        <Button icon={<MinusOutlined/>}
                                                onClick={() => {
                                                    // setDataDisplay(prevState => prevState.map((crawl) => {
                                                    setDataDisplay(dataDisplay.map((crawl) => {
                                                        const topicCrawls = crawl.topicCrawls
                                                        if (topicCrawls.length > 1) {
                                                            crawl.topicList = topicList.filter(topic => topic !== item)
                                                            crawl.topicCrawls = topicCrawls.filter((topicCrawl) => {
                                                                {
                                                                    return topicCrawl.topicKey !== item
                                                                }
                                                            })
                                                        }
                                                        return crawl
                                                    }))
                                                }}
                                        ></Button>
                                        : null
                                    }
                                </List.Item>
                            )}
                        />
                    )
                } else {
                    return (
                        <TreeSelect
                            onSelect={(value) => {
                                setDataDisplay(dataDisplay.map((crawl) => {
                                    if (record.crawlTime === crawl.crawlTime) {
                                        crawl.topicCrawls.push({topicKey: value, crawlUrl: ""})
                                        // crawl.topicList.push(value)
                                    }
                                    return crawl
                                }))
                            }}
                            treeData={treeData}
                        />
                    )
                }
            }
        },
        {
            title: "Đường dẫn",
            render: (text, record, index) => {
                console.log(record)
                const crawlUrls = record.topicCrawls.map(topicCrawl => topicCrawl.crawlUrl)
                if (crawlUrls.length > 0) {
                    return (
                        <List
                            dataSource={crawlUrls}
                            renderItem={(item) => (
                                <List.Item>
                                    <Input defaultValue={item}
                                           onChange={(values) => {
                                               // console.log(values)
                                               // console.log(values.target.value)
                                               setDataDisplay(dataDisplay.map((crawl) => {
                                                   if (crawl.crawlTime === record.crawlTime) {
                                                       const topicCrawls = crawl.topicCrawls
                                                       crawl.topicCrawls = topicCrawls.map((topicCrawl) => {
                                                           if (topicCrawl.crawlUrl === item) {
                                                               topicCrawl.crawlUrl = values.target.value
                                                           }
                                                           return topicCrawl
                                                       })
                                                       console.log(crawl)
                                                       // debugger
                                                   }
                                                   return crawl
                                               }))
                                           }}
                                    />
                                </List.Item>
                            )}
                        />
                    )
                } else {
                    return (
                        <Input
                            onChange={(values) => {
                                // console.log(values)
                                // console.log(values.target.value)
                                setDataDisplay(dataDisplay.map((crawl) => {
                                    if (crawl.crawlTime === record.crawlTime) {
                                        const topicCrawls = crawl.topicCrawls
                                        crawl.topicCrawls = topicCrawls.map((topicCrawl) => {
                                            if (topicCrawl.crawlUrl === '') {
                                                topicCrawl.crawlUrl = values.target.value
                                            }
                                            return topicCrawl
                                        })
                                        console.log(crawl)
                                        debugger
                                        return crawl
                                    }
                                }))
                            }}
                        />
                    )
                }
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'crawlTime',
            key: 'crawlTime',
            render: (text, record, index) => {
                const format = 'HH:mm';
                const value = moment(record.crawlTime, format)
                return (
                    record.crawlTime.includes("new-") ?
                        <TimePicker format={format} style={{width: 80}}
                            // onSelect={(values) => {
                                    onSelect={(value) => {
                                        console.log(value.format("HH"))
                                        console.log(dataDisplay)
                                        const currentHoursDisplay = dataDisplay.map((crawl) => {
                                            if(crawl.crawlTime.includes("new-")) {
                                                return ""
                                            } else {
                                                // return moment(crawl.crawlTime,"HH:mm").format("HH")
                                                return {
                                                    hour: moment(crawl.crawlTime,"HH:mm").format("HH"),
                                                    minute: parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                                }
                                            }
                                        })
                                        const currentMinutesDisplay = dataDisplay.map((crawl) => {
                                            if(crawl.crawlTime.includes("new-")) {
                                                return ""
                                            } else {
                                                return parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                            }
                                        })
                                        console.log(currentHoursDisplay)
                                        console.log(currentMinutesDisplay)
                                        const timesToDisabled = currentHoursDisplay.filter((time) => {
                                           return time.hour == value.format("HH")
                                        })
                                        const minutesToDisabled = timesToDisabled.map((time) => {
                                            return time.minute
                                        })
                                        console.log(timesToDisabled)
                                        console.log(minutesToDisabled)
                                        // if(currentHoursDisplay.includes(value.format("HH"))) {
                                        //     console.log("set disable minute")
                                        //     setDisabledMinutes(currentMinutesDisplay)
                                        // }
                                        setDisabledMinutes(minutesToDisabled)
                                    }}
                                    onChange={(values) => {
                                        // console.log(values.format(format))
                                        const newTime = values.format(format)
                                        // setDataToCallApi(prevState => prevState.map((crawl) => {
                                        const currentCrawlTimeList = dataDisplay.map(crawl => crawl.crawlTime)
                                        console.log(currentCrawlTimeList)
                                        if (currentCrawlTimeList.includes(newTime)) {
                                            notification.error({
                                                message: "Thời gian này đã được chọn"
                                            })
                                        } else {
                                            setDataDisplay(dataDisplay.map((crawl) => {
                                                if (record.crawlTime === crawl.crawlTime) {
                                                    crawl.crawlTime = newTime
                                                }
                                                return crawl
                                            }))
                                        }
                                    }}
                                    disabledTime={
                                        () => {
                                            return {
                                                disabledMinutes: () => {
                                                    console.log(disabledMinutes)
                                                    return disabledMinutes
                                                }
                                            }
                                        }
                                    }
                        />
                        : <TimePicker defaultValue={value} format={format} style={{width: 80}}
                            // onSelect={(values) => {
                                      onSelect={(value) => {
                                          console.log(value.format("HH"))
                                          console.log(dataDisplay)
                                          const currentHoursDisplay = dataDisplay.map((crawl) => {
                                              if(crawl.crawlTime.includes("new-")) {
                                                  return ""
                                              } else {
                                                  // return moment(crawl.crawlTime,"HH:mm").format("HH")
                                                  return {
                                                      hour: moment(crawl.crawlTime,"HH:mm").format("HH"),
                                                      minute: parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                                  }
                                              }
                                          })
                                          const currentMinutesDisplay = dataDisplay.map((crawl) => {
                                              if(crawl.crawlTime.includes("new-")) {
                                                  return ""
                                              } else {
                                                  return parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                              }
                                          })
                                          console.log(currentHoursDisplay)
                                          console.log(currentMinutesDisplay)
                                          const timesToDisabled = currentHoursDisplay.filter((time) => {
                                              return time.hour == value.format("HH")
                                          })
                                          const minutesToDisabled = timesToDisabled.map((time) => {
                                              return time.minute
                                          })
                                          console.log(timesToDisabled)
                                          console.log(minutesToDisabled)
                                          // if(currentHoursDisplay.includes(value.format("HH"))) {
                                          //     console.log("set disable minute")
                                          //     setDisabledMinutes(currentMinutesDisplay)
                                          // }
                                          setDisabledMinutes(minutesToDisabled)
                                      }}
                                      onChange={(values) => {
                                          // console.log(values.format(format))
                                          const newTime = values.format(format)
                                          // setDataToCallApi(prevState => prevState.map((crawl) => {

                                          const currentCrawlTimeList = dataDisplay.map(crawl => crawl.crawlTime)
                                          console.log(currentCrawlTimeList)
                                          if (currentCrawlTimeList.includes(newTime)) {
                                              notification.error({
                                                  message: "Thời gian này đã được chọn"
                                              })
                                              // setDataDisplay(dataDisplay.map((crawl) => {
                                              //     if (record.crawlTime === crawl.crawlTime) {
                                              //         crawl.crawlTime = "new-" + Math.random()
                                              //     }
                                              //     return crawl
                                              // }))
                                          } else {
                                              setDataDisplay(dataDisplay.map((crawl) => {
                                                  if (record.crawlTime === crawl.crawlTime) {
                                                      crawl.crawlTime = newTime
                                                  }
                                                  return crawl
                                              }))
                                          }
                                      }}
                                      disabledTime={
                                          () => {
                                              return {
                                                  disabledMinutes: () => {
                                                      // console.log(disabledMinutes)
                                                      return disabledMinutes
                                                  }
                                              }
                                          }
                                      }
                        />

                )
            }
        },
        {
            key: 'action',
            render: (text, record, index) => {
                console.log(record)
                return (
                    // <div style={{display: 'flex', flexDirection:'column'}}>
                    <Space>
                        <Button icon={<MinusOutlined/>}
                                onClick={() => {
                                    // setDataDisplay(prevState => prevState.filter(item => item.crawlTime !== record.crawlTime))
                                    setDataDisplay(dataDisplay.filter(item => item.crawlTime !== record.crawlTime))
                                    // changeSourceCustomData(sourceCustomData.filter(item => item.crawlTime !== record.crawlTime))
                                    // setDataToCallApi(prevState => prevState.filter(item => item.crawlTime !== record.crawlTime))
                                }}
                        ></Button>
                        {/*{  record.topicList[record.topicList.length - 1] === "" || record.topicList.length == 0 ? null*/}
                        {record.topicCrawls[record.topicCrawls.length - 1] ? (
                            record.topicCrawls[record.topicCrawls.length - 1].topicKey === ''
                            || record.topicCrawls[record.topicCrawls.length - 1].crawlUrl === ''
                            || record.topicCrawls.length == 0 ? null
                                :
                                <Button icon={<PlusOutlined/>}
                                        onClick={() => {
                                            // debugger
                                            setDataDisplay(dataDisplay.map((crawl) => {
                                                if (crawl.crawlTime === record.crawlTime) {
                                                    // const newTopic = "new-topic-" + Math.random()
                                                    // const newTopic = ""
                                                    // crawl.topicList.push(newTopic)
                                                    const newTopicCrawl = {topicKey: "", crawlUrl: ""}
                                                    crawl.topicCrawls.push(newTopicCrawl)
                                                }
                                                return crawl
                                            }))
                                        }}
                                >
                                </Button>
                        ) : null
                        }
                        {/*</div>*/}
                    </Space>
                )
            }
        }
    ]
    const sourceCrawlAddColumns = [
        {
            title: 'Chủ đề',
            // dataIndex: 'topicList',
            key: 'topicList',
            render: (text, record, index) => {
                console.log(record)
                const topicList = record.topicCrawls.map(topicCrawl => topicCrawl.topicKey)
                // if (record.topicCrawls.length > 0) {
                if (topicList.length > 0) {
                    return (
                        <List
                            // dataSource={record.topicList}
                            dataSource={topicList}
                            renderItem={(item) => (
                                <List.Item>
                                    <TreeSelect
                                        value={item}
                                        onChange={(value) => {
                                            setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                                if (record.crawlTime === crawl.crawlTime) {
                                                    crawl.topicCrawls = crawl.topicCrawls.map((topicCrawl) => {
                                                        if (topicCrawl.topicKey == item) {
                                                            topicCrawl.topicKey = value
                                                        }
                                                        return topicCrawl
                                                    })
                                                }
                                                return crawl
                                            }))
                                        }}
                                        treeData={treeData}
                                    />
                                    {/*: <span>{item}</span>*/}
                                    {/*}*/}
                                    {record.topicCrawls.length > 1 ?
                                        <Button icon={<MinusOutlined/>}
                                                onClick={() => {
                                                    // setDataDisplay(prevState => prevState.map((crawl) => {
                                                    setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                                        const topicCrawls = crawl.topicCrawls
                                                        if (topicCrawls.length > 1) {
                                                            crawl.topicList = topicList.filter(topic => topic !== item)
                                                            crawl.topicCrawls = topicCrawls.filter((topicCrawl) => {
                                                                {
                                                                    return topicCrawl.topicKey !== item
                                                                }
                                                            })
                                                        }
                                                        return crawl
                                                    }))
                                                }}
                                        ></Button>
                                        : null
                                    }
                                </List.Item>
                            )}
                        />
                    )
                } else {
                    return (
                        <TreeSelect
                            onSelect={(value) => {
                                setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                    if (record.crawlTime === crawl.crawlTime) {
                                        crawl.topicCrawls.push({topicKey: value, crawlUrl: ""})
                                        // crawl.topicList.push(value)
                                    }
                                    return crawl
                                }))
                            }}
                            treeData={treeData}
                        />
                    )
                }
            }
        },
        {
            title: "Đường dẫn",
            render: (text, record, index) => {
                console.log(record)
                const crawlUrls = record.topicCrawls.map(topicCrawl => topicCrawl.crawlUrl)
                if (crawlUrls.length > 0) {
                    return (
                        <List
                            dataSource={crawlUrls}
                            renderItem={(item) => (
                                <List.Item>
                                    <Input defaultValue={item}
                                           onChange={(values) => {
                                               // console.log(values)
                                               // console.log(values.target.value)
                                               setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                                   if (crawl.crawlTime === record.crawlTime) {
                                                       const topicCrawls = crawl.topicCrawls
                                                       crawl.topicCrawls = topicCrawls.map((topicCrawl) => {
                                                           if (topicCrawl.crawlUrl === item) {
                                                               topicCrawl.crawlUrl = values.target.value
                                                           }
                                                           return topicCrawl
                                                       })
                                                       console.log(crawl)
                                                       // debugger
                                                   }
                                                   return crawl
                                               }))
                                           }}
                                    />
                                </List.Item>
                            )}
                        />
                    )
                } else {
                    return (
                        <Input
                            onChange={(values) => {
                                // console.log(values)
                                // console.log(values.target.value)
                                setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                    if (crawl.crawlTime === record.crawlTime) {
                                        const topicCrawls = crawl.topicCrawls
                                        crawl.topicCrawls = topicCrawls.map((topicCrawl) => {
                                            if (topicCrawl.crawlUrl === '') {
                                                topicCrawl.crawlUrl = values.target.value
                                            }
                                            return topicCrawl
                                        })
                                        console.log(crawl)
                                        // debugger
                                        return crawl
                                    }
                                }))
                            }}
                        />
                    )
                }
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'crawlTime',
            key: 'crawlTime',
            render: (text, record, index) => {
                const format = 'HH:mm';
                const value = moment(record.crawlTime, format)
                return (
                    record.crawlTime.includes("new-") ?
                        <TimePicker format={format} style={{width: 80}}
                            // onSelect={(values) => {
                                    onSelect={(value) => {
                                        console.log(value.format("HH"))
                                        console.log(dataDisplay)
                                        const currentHoursDisplay = dataDisplayAdd.map((crawl) => {
                                            if(crawl.crawlTime.includes("new-")) {
                                                return ""
                                            } else {
                                                // return moment(crawl.crawlTime,"HH:mm").format("HH")
                                                return {
                                                    hour: moment(crawl.crawlTime,"HH:mm").format("HH"),
                                                    minute: parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                                }
                                            }
                                        })
                                        const currentMinutesDisplay = dataDisplayAdd.map((crawl) => {
                                            if(crawl.crawlTime.includes("new-")) {
                                                return ""
                                            } else {
                                                return parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                            }
                                        })
                                        console.log(currentHoursDisplay)
                                        console.log(currentMinutesDisplay)
                                        const timesToDisabled = currentHoursDisplay.filter((time) => {
                                            return time.hour == value.format("HH")
                                        })
                                        const minutesToDisabled = timesToDisabled.map((time) => {
                                            return time.minute
                                        })
                                        console.log(timesToDisabled)
                                        console.log(minutesToDisabled)
                                        setDisabledMinutesAddForm(minutesToDisabled)
                                    }}
                                    onChange={(values) => {
                                        // console.log(values.format(format))
                                        const newTime = values.format(format)
                                        // setDataToCallApi(prevState => prevState.map((crawl) => {
                                        const currentCrawlTimeList = dataDisplayAdd.map(crawl => crawl.crawlTime)
                                        console.log(currentCrawlTimeList)
                                        if (currentCrawlTimeList.includes(newTime)) {
                                            notification.error({
                                                message: "Thời gian này đã được chọn"
                                            })
                                        } else {
                                            setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                                if (record.crawlTime === crawl.crawlTime) {
                                                    crawl.crawlTime = newTime
                                                }
                                                return crawl
                                            }))
                                        }
                                    }}
                                    disabledTime={
                                        () => {
                                            return {
                                                disabledMinutes: () => {
                                                    console.log(disabledMinutesAddForm)
                                                    return disabledMinutesAddForm
                                                }
                                            }
                                        }
                                    }
                        />
                        : <TimePicker defaultValue={value} format={format} style={{width: 80}}
                            // onSelect={(values) => {
                                      onSelect={(value) => {
                                          console.log(value.format("HH"))
                                          console.log(dataDisplay)
                                          const currentHoursDisplay = dataDisplayAdd.map((crawl) => {
                                              if(crawl.crawlTime.includes("new-")) {
                                                  return ""
                                              } else {
                                                  // return moment(crawl.crawlTime,"HH:mm").format("HH")
                                                  return {
                                                      hour: moment(crawl.crawlTime,"HH:mm").format("HH"),
                                                      minute: parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                                  }
                                              }
                                          })
                                          const currentMinutesDisplay = dataDisplayAdd.map((crawl) => {
                                              if(crawl.crawlTime.includes("new-")) {
                                                  return ""
                                              } else {
                                                  return parseInt(moment(crawl.crawlTime,"HH:mm").format("mm"))
                                              }
                                          })
                                          console.log(currentHoursDisplay)
                                          console.log(currentMinutesDisplay)
                                          const timesToDisabled = currentHoursDisplay.filter((time) => {
                                              return time.hour == value.format("HH")
                                          })
                                          const minutesToDisabled = timesToDisabled.map((time) => {
                                              return time.minute
                                          })
                                          console.log(timesToDisabled)
                                          console.log(minutesToDisabled)
                                          // if(currentHoursDisplay.includes(value.format("HH"))) {
                                          //     console.log("set disable minute")
                                          //     setDisabledMinutes(currentMinutesDisplay)
                                          // }
                                          setDisabledMinutes(minutesToDisabled)
                                      }}
                                      onChange={(values) => {
                                          // console.log(values.format(format))
                                          const newTime = values.format(format)
                                          // setDataToCallApi(prevState => prevState.map((crawl) => {

                                          const currentCrawlTimeList = dataDisplayAdd.map(crawl => crawl.crawlTime)
                                          console.log(currentCrawlTimeList)
                                          if (currentCrawlTimeList.includes(newTime)) {
                                              notification.error({
                                                  message: "Thời gian này đã được chọn"
                                              })
                                              // setDataDisplay(dataDisplay.map((crawl) => {
                                              //     if (record.crawlTime === crawl.crawlTime) {
                                              //         crawl.crawlTime = "new-" + Math.random()
                                              //     }
                                              //     return crawl
                                              // }))
                                          } else {
                                              setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                                  if (record.crawlTime === crawl.crawlTime) {
                                                      crawl.crawlTime = newTime
                                                  }
                                                  return crawl
                                              }))
                                          }
                                      }}
                                      disabledTime={
                                          () => {
                                              return {
                                                  disabledMinutes: () => {
                                                      // console.log(disabledMinutes)
                                                      return disabledMinutesAddForm
                                                  }
                                              }
                                          }
                                      }
                        />

                )
            }
        },
        {
            key: 'action',
            render: (text, record, index) => {
                console.log(record)
                return (
                    // <div style={{display: 'flex', flexDirection:'column'}}>
                    <Space>
                        <Button icon={<MinusOutlined/>}
                                onClick={() => {
                                    // setDataDisplay(prevState => prevState.filter(item => item.crawlTime !== record.crawlTime))
                                    setDataDisplayAdd(dataDisplayAdd.filter(item => item.crawlTime !== record.crawlTime))
                                    // changeSourceCustomData(sourceCustomData.filter(item => item.crawlTime !== record.crawlTime))
                                    // setDataToCallApi(prevState => prevState.filter(item => item.crawlTime !== record.crawlTime))
                                }}
                        ></Button>
                        {/*{  record.topicList[record.topicList.length - 1] === "" || record.topicList.length == 0 ? null*/}
                        {record.topicCrawls[record.topicCrawls.length - 1] ? (
                            record.topicCrawls[record.topicCrawls.length - 1].topicKey === ''
                            || record.topicCrawls[record.topicCrawls.length - 1].crawlUrl === ''
                            || record.topicCrawls.length == 0 ? null
                                :
                                <Button icon={<PlusOutlined/>}
                                        onClick={() => {
                                            // debugger
                                            setDataDisplayAdd(dataDisplayAdd.map((crawl) => {
                                                if (crawl.crawlTime === record.crawlTime) {
                                                    // const newTopic = "new-topic-" + Math.random()
                                                    // const newTopic = ""
                                                    // crawl.topicList.push(newTopic)
                                                    const newTopicCrawl = {topicKey: "", crawlUrl: ""}
                                                    crawl.topicCrawls.push(newTopicCrawl)
                                                }
                                                return crawl
                                            }))
                                        }}
                                >
                                </Button>
                        ) : null
                        }
                        {/*</div>*/}
                    </Space>
                )
            }
        }
    ]
    const sourceCrawlsColumns = [
        {
            title: 'Chủ đề',
            // dataIndex: 'topicList',
            key: 'topicList',
            render: (text, record, index) => {
                console.log(record)
                const topicList = record.topicCrawls.map((topicCrawl) => {
                    return topicCrawl.topicKey
                })
                return (
                    <List
                        // dataSource={record.topicList}
                        dataSource={topicList}
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
            title: "Đường dẫn",
            key: "crawlUrl",
            render: (text, record, index) => {
                const crawlUrls = record.topicCrawls.map((topicCrawl) => {
                    return topicCrawl.crawlUrl
                })
                return (
                    <List
                        dataSource={crawlUrls}
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
                                if (record.mode === 1) {
                                    setDataDisplay([])
                                    setFrequencyFormItemHidden(false)
                                    setCustomFormItemHidden(true)
                                    form.setFieldsValue({
                                        id: record.id,
                                        name: record.name,
                                        // mode: "Tần suất",
                                        mode: "1",
                                        frequency: record.frequency,
                                        status: record.status === 1
                                    })
                                } else {
                                    setFrequencyFormItemHidden(true)
                                    setCustomFormItemHidden(false)
                                    setDataDisplay(record.sourceCrawls)
                                    setDataToCallApi(record.sourceCrawls)
                                    changeSourceCustomData(record.sourceCrawls)
                                    // customData=record.sourceCrawls
                                    // console.log(customData)
                                    form.setFieldsValue({
                                        id: record.id,
                                        name: record.name,
                                        // mode: "Tùy chỉnh",
                                        mode: "2",
                                        // custom: record.sourceCrawls,
                                        status: record.status === 1
                                    })
                                }
                                setVisibleEditSourceInfo(true)
                            }}>
                                <EditOutlined/>
                            </Button>
                        </Tooltip>
                        {
                            record.status === 1 ?
                            <Tooltip title="Dừng hoạt động">
                                <Button
                                    style={{marginLeft: '5px', color: 'red'}}
                                    onClick={() => {
                                        confirm({
                                            title: "Bạn có chắc muốn dừng hoạt động nguồn tin " + record.name,
                                            icon: <ExclamationCircleOutlined/>,
                                            onOk() {
                                                SourceService.stop(record.id).then(
                                                    response => {
                                                        notification.success({
                                                            message: 'Dừng hoạt động thành công',
                                                            // description: 'Tên đăng nhập hoặc mật khẩu không đúng'
                                                        })
                                                        window.location.reload()
                                                    }
                                                ).catch(
                                                    error => {
                                                        console.log(error)
                                                        notification.error({
                                                            message: 'Dừng hoạt động thất bại',
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
                                >
                                    <CloseCircleOutlined/>
                                </Button>
                            </Tooltip>
                                :
                                <Tooltip title="Mở hoạt động">
                                    <Button
                                        style={{marginLeft: '5px', color: '#3acf6b'}}
                                        onClick={() => {
                                            confirm({
                                                title: "Bạn có chắc muốn mở hoạt động nguồn tin " + record.name,
                                                icon: <ExclamationCircleOutlined/>,
                                                onOk() {
                                                    SourceService.start(record.id).then(
                                                        response => {
                                                            notification.success({
                                                                message: 'Mở hoạt động thành công',
                                                                // description: 'Tên đăng nhập hoặc mật khẩu không đúng'
                                                            })
                                                            window.location.reload()
                                                        }
                                                    ).catch(
                                                        error => {
                                                            console.log(error)
                                                            notification.error({
                                                                message: 'Mở hoạt động thất bại',
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
                                    >
                                        <PlayCircleOutlined />
                                    </Button>
                                </Tooltip>
                        }
                    </div>
                )
            }
        }

    ]
    const onAddFormFinish = (values) => {
        const allValue = addForm.getFieldsValue(true)
        console.log("all values ", allValue)
        if (values.mode === "1") {
            values.sourceCrawls = null
            values.custom = null
        } else {
            values.sourceCrawls = dataDisplayAdd
            values.frequency = null
            values.custom = null
        }
        console.log(values.mode)
        // if(values.mode === 'Tần suất') {
        //     values.mode = 1
        // } else {
        //     values.mode = 2
        // }
        if (values.status) {
            values.status = 1
        } else {
            values.status = 0
        }
        console.log(values)
        // const user = values
        // debugger
        // console.log(user)
        SourceService.create(values).then(
            response => {
                window.location.reload()
            }
        ).catch(
            error => {
                console.log(error.response.data.status)
                notification.error({
                    message: 'Sửa thông tin nguồn tin thất bại',
                    description: error.response? error.response.data.status.message : ""
                })
            }
        )
    }
    const onLoginFormFinish = (values) => {
        const allValue = form.getFieldsValue(true)
        console.log("all values ", allValue)
        if (currentSourceInfo.mode === "1") {
            values.custom=null
        } else {
            values.sourceCrawls = dataDisplay
            values.custom = null
        }
        console.log(values.mode)
        if (values.status) {
            values.status = 1
        } else {
            values.status = 0
        }
        console.log(values)
        // const user = values
        // debugger
        // console.log(user)
        SourceService.update(values).then(
            response => {
                window.location.reload()
            }
        ).catch(
            error => {
                notification.error({
                    message: 'Sửa thông tin nguồn tin thất bại',
                    description: error.response? error.response.data.status.message: ""
                })
            }
        )
    }
    const onLoginFormFinishFailed = (values) => {
        console.log(values)
    }

    const onAddFormFinishFailed = (values) => {
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
        console.log(data)
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

        TopicService.getTopicDisplay().then(
            response => {
                if (response.data.data) {
                    const convertToTree = response.data.data.map((topic) => {
                        return (
                            {
                                title: topic.label,
                                value: topic.key,
                                children: topic.children ? topic.children.map((childLv2) => {
                                        return {
                                            title: childLv2.label,
                                            value: childLv2.key,
                                            children: childLv2.children ? childLv2.children.map((childLv3) => {
                                                    return {
                                                        title: childLv3.label,
                                                        value: childLv3.key
                                                    }
                                                })
                                                : null
                                        }
                                    })
                                    : null
                            }
                        )
                    })
                    setTreeData(convertToTree)
                }
            }
        )
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
            <Tooltip title="Thêm nguồn tin mới">
                <Button icon={<PlusOutlined/>}
                        onClick={() => {
                            setVisibleAddSourceInfo(true)
                        }}
                >
                </Button>
            </Tooltip>
            <div>
                <Modal
                    width={900}
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
                                    if (currentSourceInfo.mode === 1) {
                                        setFrequencyFormItemHidden(false)
                                        setCustomFormItemHidden(true)
                                        form.setFieldsValue({
                                            id: currentSourceInfo.id,
                                            name: currentSourceInfo.name,
                                            // mode: "Tần suất",
                                            mode: "1",
                                            frequency: currentSourceInfo.frequency,
                                            status: currentSourceInfo.status === 1
                                        })
                                    } else {
                                        setFrequencyFormItemHidden(true)
                                        setCustomFormItemHidden(false)
                                        setDataDisplay(currentSourceInfo.sourceCrawls)
                                        setDataToCallApi(currentSourceInfo.sourceCrawls)
                                        changeSourceCustomData(currentSourceInfo.sourceCrawls)
                                        console.log(customData)
                                        form.setFieldsValue({
                                            id: currentSourceInfo.id,
                                            name: currentSourceInfo.name,
                                            // mode: "Tùy chỉnh",
                                            mode: "2",
                                            status: currentSourceInfo.status === 1,
                                            // custom: currentSourceInfo.sourceCrawls
                                        })
                                    }
                                    setVisibleSourceInfo(false)
                                    setVisibleEditSourceInfo(true)
                                }}
                        >
                            Sửa
                        </Button>
                    ]}
                >
                    <Descriptions
                        bordered
                        // size="middle"
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
                                {/*<CustomModeData data={currentSourceInfo.sourceCrawls}/>*/}
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
                    width={900}
                    title="Cấu hình chi tiết nguồn tin"
                    visible={visibleEditSourceInfo}
                    destroyOnClose={true}
                    onCancel={() => {
                        setVisibleEditSourceInfo(false)
                        setCurrentSourceInfo({})
                        // console.log("on close")
                    }}
                    footer={[
                        // <Button onClick={() => {
                        //     setVisibleEditUserInfo(false)
                        // }}>Hủy</Button>
                    ]}
                >
                    <Form
                        preserve={false}
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
                            name="name"
                            label="Tên nguồn tin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên nguồn tin không được đẻ trống!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="mode"
                            label="Chế độ"
                            valuePropName="value"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chế độ không được để trống!',
                                },
                            ]}
                        >
                            <Select style={{
                                width: 150
                            }}
                                //:todo handle on select
                                    onSelect={(value) => {
                                        console.log(value)
                                        if (value === "1") {
                                            console.log("frequency")
                                            setFrequencyFormItemHidden(false)
                                            setCustomFormItemHidden(true)
                                        } else {
                                            console.log("custom")
                                            setFrequencyFormItemHidden(true)
                                            setCustomFormItemHidden(false)
                                        }
                                    }}
                            >
                                <Option value="1">Tần suất</Option>
                                <Option value="2">Tùy chỉnh</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="frequency"
                            label="Tần suất"
                            hidden={frequencyFormItemHidden}
                            valuePropName="value"
                        >
                            <InputNumber addonAfter="giờ / 1 lần" step={2} max={12} min={2} style={{width: 150}}/>
                        </Form.Item>
                        <Form.Item
                            name="custom"
                            label="Tùy chỉnh"
                            hidden={customFormItemHidden}
                            valuePropName="data"
                        >
                            {/*<CustomModeData/>*/}
                            <div>
                                <Table columns={sourceCrawlEditColumns} dataSource={dataDisplay}
                                       pagination={false}
                                />
                                <div style={{marginTop: "10px"}}>
                                    <Button icon={<PlusOutlined/>} style={{marginLeft: 'auto', display: 'block'}}
                                            onClick={() => {
                                                const newCrawlTime = Math.random()
                                                const newEmptyRow = {
                                                    topicCrawls: [{topicKey: '', crawlUrl: ""}],
                                                    crawlTime: "new-" + newCrawlTime,
                                                }
                                                // debugger
                                                setDataDisplay([...dataDisplay, newEmptyRow])
                                                setDataToCallApi(prevState => [...prevState, newEmptyRow])
                                                // setDataToCallApi( [...dataToCallApi, newEmptyRow])
                                            }}
                                    >
                                    </Button>
                                </div>
                            </div>
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
            <div>
                <Modal
                    width={900}
                    title="Thêm nguồn tin"
                    visible={visibleAddSourceInfo}
                    destroyOnClose={true}
                    onCancel={() => {
                        setVisibleAddSourceInfo(false)
                        setCurrentSourceInfo({})
                        setFrequencyAddFormItemHidden(true)
                        setCustomAddFormItemHidden(true)
                        // console.log("on close")
                    }}
                    footer={[
                        // <Button onClick={() => {
                        //     setVisibleEditUserInfo(false)
                        // }}>Hủy</Button>
                    ]}
                >
                    <Form
                        preserve={false}
                        form={addForm}
                        layout="vertical"
                        name="form_in_add_modal"
                        onFinish={onAddFormFinish}
                        onFinishFailed={onAddFormFinishFailed}
                    >
                        {/*<Form.Item*/}
                        {/*    name="id"*/}
                        {/*    label="ID"*/}
                        {/*>*/}
                        {/*    <Input disabled={false}/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item
                            name="name"
                            label="Tên nguồn tin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên nguồn tin không được đẻ trống!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="mode"
                            label="Chế độ"
                            valuePropName="value"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chế độ không được để trống!',
                                },
                            ]}
                        >
                            <Select style={{
                                width: 150
                            }}
                                //:todo handle on select
                                    onSelect={(value) => {
                                        console.log(value)
                                        if (value === "1") {
                                            console.log("frequency")
                                            setFrequencyAddFormItemHidden(false)
                                            setCustomAddFormItemHidden(true)
                                        } else {
                                            console.log("custom")
                                            setFrequencyAddFormItemHidden(true)
                                            setCustomAddFormItemHidden(false)
                                        }
                                    }}
                            >
                                <Option value="1">Tần suất</Option>
                                <Option value="2">Tùy chỉnh</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="frequency"
                            label="Tần suất"
                            hidden={frequencyAddFormItemHidden}
                            valuePropName="value"
                        >
                            <InputNumber addonAfter="giờ / 1 lần" step={2} max={12} min={2} style={{width: 150}}/>
                        </Form.Item>
                        <Form.Item
                            name="custom"
                            label="Tùy chỉnh"
                            hidden={customAddFormItemHidden}
                            valuePropName="data"
                        >
                            {/*<CustomModeData/>*/}
                            <div>
                                <Table columns={sourceCrawlAddColumns} dataSource={dataDisplayAdd}
                                       pagination={false}
                                />
                                <div style={{marginTop: "10px"}}>
                                    <Button icon={<PlusOutlined/>} style={{marginLeft: 'auto', display: 'block'}}
                                            onClick={() => {
                                                const newCrawlTime = Math.random()
                                                const newEmptyRow = {
                                                    topicCrawls: [{topicKey: '', crawlUrl: ""}],
                                                    crawlTime: "new-" + newCrawlTime,
                                                }
                                                // debugger
                                                setDataDisplayAdd([...dataDisplayAdd, newEmptyRow])
                                                setDataToCallApi(prevState => [...prevState, newEmptyRow])
                                                // setDataToCallApi( [...dataToCallApi, newEmptyRow])
                                            }}
                                    >
                                    </Button>
                                </div>
                            </div>
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

const mapStateToProps = (state) => {
    // console.log(state.object.loginStatus)
    // console.log(state.object.userName)
    console.log(state.sourceCustom.data)
    return {
        sourceCustomData: state.sourceCustom.data
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeSourceCustomData: (d) => dispatch({type: "CHANGE", data: d})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SourceMng)