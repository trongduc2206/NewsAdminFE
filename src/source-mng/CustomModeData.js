import {Button, InputNumber, List, Select, Space, Table, TimePicker} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import moment from "moment";
import {useEffect, useState} from "react";
import {Option} from "antd/es/mentions";

export function CustomModeData(props) {
    const {data} = props
    const [dataDisplay, setDataDisplay] = useState(data)
    const [visibleMinusButton, setVisibleMinusButton] = useState(false)
    const [topicsDisplay, setTopicsDisplay] = useState([])
    const columns = [
        {
            title: 'Chủ đề',
            // dataIndex: 'topicList',
            key: 'topicList',
            render: (text, record, index) => {
                console.log(record)
                if (record.topicList.length > 0) {

                    return (
                        <List
                            dataSource={record.topicList}
                            renderItem={(item) => (
                                <List.Item>
                                    <span>{item}</span>
                                    {record.topicList.length > 1 ?
                                        <Button icon={<MinusOutlined/>}
                                        onClick={() => {
                                            setDataDisplay(prevState => prevState.map((crawl) => {
                                                const topicList = crawl.topicList
                                                if(topicList.length > 1) {
                                                    crawl.topicList = topicList.filter(topic => topic !== item )
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
                        <Select>
                            <Option value="1">Test1</Option>
                            <Option value="2"></Option>
                        </Select>
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
                        <TimePicker format={format} style={{width: 80}}/>
                        : <TimePicker value={value} format={format} style={{width: 80}}/>

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
                                    setDataDisplay(prevState => prevState.filter(item => item.crawlTime !== record.crawlTime))
                                }}
                        ></Button>
                        {/*</div>*/}
                    </Space>
                )
            }
        }
    ]
    useEffect(() => {
        console.log(data)
        console.log(dataDisplay)
        const allTopic = []
        const crawlEntries = dataDisplay.entries()
        for (let x of crawlEntries) {
            const crawlData = x[1]
            const topicListDisplay = crawlData.topicList
            for(let y of topicListDisplay) {
                allTopic.push(y)
            }
        }
        console.log("all topic are displaying ", allTopic)
        setTopicsDisplay(allTopic)
    }, [])
    const onAdd = () => {
        // console.log("on add ", dataDisplay)
        // const newData = dataDisplay
        // const newEmptyRow = {
        //     topicList: [],
        //     crawlTime: "",
        // }
        // newData.push(newEmptyRow)
        // setDataDisplay(newData)
    }
    return (
        <div>
            <Table columns={columns} dataSource={dataDisplay}
                   pagination={false}
            />
            <div style={{marginTop: "10px"}}>
                <Button icon={<PlusOutlined/>} style={{marginLeft: 'auto', display: 'block'}}
                        onClick={() => {
                            const newCrawlTime = Math.random()
                            const newEmptyRow = {
                                topicList: [],
                                crawlTime: "new-" + newCrawlTime,
                            }
                            setDataDisplay(prevState => [...prevState, newEmptyRow])
                        }}
                >
                </Button>
            </div>
        </div>
    )
}