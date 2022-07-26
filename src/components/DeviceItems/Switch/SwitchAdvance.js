import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import './SwitchAdvance.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { isOpenBox } from '../../../store/action/ControlAction'
import getTimeline from '../../../services/switch-api/getTimeline'
import checkDevice from '../../../services/checkDevice';
import Rename from '../../ReName/rename';
import ChangeKey from '../../ChangeKey/changeKey';
import UpdateKey from '../../UpdateKey/updateKey';
import "react-datepicker/dist/react-datepicker.css";
import io from "socket.io-client";





class Switch extends Component {
    socket
    // hàm tạo: chạy trước khi render
    constructor(props) {


        super(props);
        this.state = {
            NotifyConnect: 'Đang kết nối với thiết bị!',
            isPermit: 0,
            Status: 0,
            pre_isError: 1,
            time_Alive: 0,
            room: `${this.props.Device.NameDevice}${this.props.Device.Key}`,
            data: [
                { Status: 0, TimeModify: 0 },

            ],
            TimePick: new Date(),
            Date: new Date().getDate(),
            Month: new Date().getMonth() + 1,
            Year: new Date().getFullYear(),
        };




    }



    componentDidMount() {
        this.socket = io.connect("https://iot-server-demo.herokuapp.com");
        console.log("Switch Advance component render")
        console.log(`Switch ${this.props.Device.NameDevice} join room : ${this.props.Device.NameDevice}${this.props.Device.Key}`)
        this.socket.emit("Switch", { function: 'join_room', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("Switch", { function: 'GetInitStatus', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("Switch", { function: 'getTimeline', NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, Date: this.state.Date, Month: this.state.Month, Year: this.state.Year, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.on("isDeviceConnect", async (data) => {

            this.setState({
                isPermit: Number(data.isDeviceConnect),
                NotifyConnect: `Cường độ tín hiệu: ${data.RSSI}`,
                time_Alive: data.time_Alive,
            })
            // console.log(`this.state.time_Alive Advance: ${this.state.time_Alive}`)
            // console.log(`this.state.time_Alive Advance: ${Number(data.time_Alive)}`)
            // console.log(`data.isDeviceConnect: ${data.isDeviceConnect}`)

        });
        this.socket.on("SyncStatus", async (data) => {
            console.log(`SyncStatus`);
            console.log(`this.props.Device.NameDevice ${this.props.Device.NameDevice}`);
            console.log(`SyncStatus ${data.DataResult}`);
            console.log(`data.isError ${data.isError}`);
            if (!Number(data.isError)) {
                this.setState({
                    Status: Number(data.DataResult),
                })
                let response = await getTimeline(this.props.Device.NameDevice, this.props.Device.Key, this.state.Date, this.state.Month, this.state.Year);
                console.log(`response.message ${response.message}`)
                if (!response.isError) {
                    this.setState({
                        data: response.DataResult
                    })
                }
            }
            else {
                this.setState({
                    NotifyConnect: data.message,
                })
                console.log(data.message)
            }

        });

        this.socket.on("InitStatusValue", async (data) => {
            console.log(`InitStatusValue`);
            console.log(`data.DataResult ${data.DataResult}`);
            console.log(`data.isError ${data.isError}`);
            if (!Number(data.isError)) {
                this.setState({
                    Status: Number(data.DataResult),
                })
            }
        });

        this.socket.on("updateDataTimeline", async (data) => {
            console.log(`updateDataTimeline`)
            // console.log(`${data.DataResult}`)
            this.setState({
                data: data.DataResult
            })
        });

        this.MyInterval = setInterval(async () => {
            let time_ = new Date().getTime();
            let timer = (Number(time_) - Number(this.state.time_Alive)) / 1000
            // console.log(`timer: ${timer}`)
            if (timer > 3) {
                this.setState({
                    isPermit: 0,
                    NotifyConnect: 'Đang kết nối với thiết bị!',
                })
                let response = await checkDevice(this.props.Device.NameDevice, this.props.Device.Key);
                if (!response.isError) {
                    this.socket.emit("Switch", { function: 'leave_room', room: this.state.room });
                    this.socket.emit("Switch", { function: 'join_room', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
                    this.socket.emit("Switch", { function: 'GetInitStatus', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
                    this.socket.emit("Switch", { function: 'getTimeline', NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, Date: this.state.Date, Month: this.state.Month, Year: this.state.Year, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });

                    this.setState({
                        room: `${this.props.Device.NameDevice}${this.props.Device.Key}`
                    })
    
                }
                else {
                    this.setState({
                        NotifyConnect: 'Key thiết bị đã được thay đổi!',
                    })
                }

            }
        }, 1000)
    }
    componentWillUnmount() {
        this.socket.disconnect();
        clearInterval(this.MyInterval);
        console.log(`componentWillUnmount`)
    }



    handleSwitch = async (event) => {
        console.log(`handleSwitch`)

        if (this.state.isPermit) {
            let status_pre = this.state.Status;
            this.socket.emit("Switch", { function: 'AppToDevice', Status: Number(!status_pre), NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
            this.setState({
                Status: Number(!status_pre),
            })
        }
    }

    handleClose_Btn = (event) => {
        this.socket.disconnect();
        let payload = { ...this.props.ControlAction_Redux }
        payload.AdvanceBox.isOpen = 0
        console.log(payload)
        this.props.isOpenBox(payload);
    }

    handleRename = (event) => {
        console.log(`handleRename`)
        let payload = { ...this.props.ControlAction_Redux }
        payload.isOpenRenameBox = 1
        console.log(payload)
        this.props.isOpenBox(payload);
    }
    handleChangeKey = (event) => {
        console.log(`handleChangeKey`)
        let payload = { ...this.props.ControlAction_Redux }
        payload.isOpenChangeKeyBox = 1
        console.log(payload)
        this.props.isOpenBox(payload);
    }
    handleUpdateKey = (event) => {
        console.log(`handleUpdateKey`)
        let payload = { ...this.props.ControlAction_Redux }
        payload.isOpenUpdateKeyBox = 1
        console.log(payload)
        this.props.isOpenBox(payload);
    }

    PickTime = async (event) => {
        console.log(`PickTime handle ${event.target.value}`);
        let Time = new Date(event.target.value);
        console.log(Time)
        this.setState({
            Date: Time.getDate(),
            Month: Time.getMonth() + 1,
            Year: Time.getFullYear()
        })

        let response = await getTimeline(this.props.Device.NameDevice, this.props.Device.Key, Time.getDate(), Time.getMonth() + 1, Time.getFullYear());
        console.log(`response.message ${response.message}`)
        if (!response.isError) {
            this.setState({
                data: response.DataResult
            })
        }
        else {
            this.setState({
                data: 0
            })
        }



    }


    render() {
        if (Number(this.props.ControlAction_Redux.AdvanceBox.isOpen) === 1) {
            const { data } = this.state;
            return (
                <React.Fragment>


                    <div className='Background-SwitchAdvance'>
                        <div className='Box-SwitchAdvance'>
                            <div className='Chart-SwitchAdvance'>

                                <input className='DatePicker' type="date" onChange={(event) => this.PickTime(event)}></input>
                                <ResponsiveContainer className="chart">
                                    <LineChart data={data}
                                        className='LineChart'
                                    >
                                        <XAxis dataKey="TimeModify" type="category" />
                                        <YAxis />
                                        <CartesianGrid strokeDasharray="1 1" />
                                        <Tooltip />
                                        <Legend />
                                        <Line connectNulls dataKey="Status" stroke="#82ca9d" fill="#82ca9d" dot={false} activeDot={{ r: 5 }} />
                                        <Brush
                                            width={800}
                                            height={10} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='Setting-SwitchAdvance'>
                                <div className='Names-SwitchAdvance'>

                                    <div className='NameDeviceCustom_Name-SwitchAdvance' onClick={() => { this.handleRename() }}>{this.props.Device.NameDeviceCustom}</div>
                                    <div className='NameDevice_Name-SwitchAdvance' > {this.props.Device.NameDevice} </div>
                                </div>

                                <div className='Control-SwitchAdvance'>
                                    {this.state.Status
                                        ? <Button className='SwitchOn-SwitchAdvance' variant="outline-success" onClick={() => { this.handleSwitch() }}><FontAwesomeIcon className='faPowerOn-SwitchAdvance' icon={faPowerOff} /></Button>
                                        : <Button className='SwitchOff-SwitchAdvance' variant="outline-success" onClick={() => { this.handleSwitch() }}><FontAwesomeIcon className='faPowerOff-SwitchAdvance' icon={faPowerOff} /></Button>}
                                    <DisSwitch isPermit={this.state.isPermit}></DisSwitch>
                                    <NotifyConnectSwitchComponent NotifyConnect={this.state.NotifyConnect} isPermit={this.state.isPermit}></NotifyConnectSwitchComponent>

                                </div>


                                <div className='Key-SwitchAdvance'>

                                    <span className='ChangeKey' onClick={() => { this.handleChangeKey() }}> Thay đổi Key

                                    </span>
                                    <span className='UpdateKey' onClick={() => { this.handleUpdateKey() }}> Cập nhật Key

                                    </span>

                                </div>

                                <div className='Btn-SwitchAdvance'>
                                    <button className='Close_Btn-SwitchAdvance'
                                        onClick={() => { this.handleClose_Btn() }}>Đóng</button>
                                </div>

                            </div>


                        </div>

                    </div>
                    <Rename Device={this.props.Device}></Rename>
                    <ChangeKey Device={this.props.Device}></ChangeKey>
                    <UpdateKey Device={this.props.Device}></UpdateKey>

                </React.Fragment >


            )

        }


    }
}


const NotifyConnectSwitchComponent = (props) => {
    //Kiểm tra giá trị của props
    //Trả về JSX để hiển thị
    if (props.isPermit) {
        return (
            <span className='NotifyConnect-SwitchAdvance'>{props.NotifyConnect}</span>
        )
    }
    else {
        return (
            <span className='NotifyDisconnect-SwitchAdvance'>{props.NotifyConnect}</span>
        )
    }


}


const DisSwitch = (props) => {
    //Kiểm tra giá trị của props
    //Trả về JSX để hiển thị
    if (!props.isPermit) {

        return (
            <Button className='Discontrol-SwitchAdvance' variant="outline-success"><FontAwesomeIcon className='faPowerDiscontrol-SwitchAdvance' icon={faPowerOff} /></Button>
        )
    }
    else {
        return null;
    }


}

const mapStateToProps = (state) => {
    return {
        User_Redux: state.User,
        ControlAction_Redux: state.ControlAction
    }
}

const mapDispatToProps = (dispatch) => {
    return {
        isOpenBox: (payload) => dispatch(isOpenBox(payload)),
    }

}
export default connect(mapStateToProps, mapDispatToProps)(Switch);