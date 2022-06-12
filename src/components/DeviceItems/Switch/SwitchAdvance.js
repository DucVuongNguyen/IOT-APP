import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './SwitchAdvance.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faTag } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { isOpenAdvanceBox } from '../../../store/action/ControlAction'
import getTimeline from '../../../services/switch-api/getTimeline'
import "react-datepicker/dist/react-datepicker.css";
import io from "socket.io-client";





class Switch extends Component {
    socket
    // hàm tạo: chạy trước khi render
    constructor(props) {


        super(props);
        this.state = {
            NotifyConnect: 'Thiết bị mất kết nối!',
            isPermit: 0,
            Status: 0,
            pre_isError: 1,
            time_Alive: 0,
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
        console.log(`this is Advance`)
        console.log("Switch component render")
        console.log(`Switch ${this.props.Device.NameDevice} join room : ${this.props.Device.NameDevice}${this.props.Device.Key}`)
        this.socket = io.connect("https://iot-server-demo.herokuapp.com");
        this.socket.emit("join_room", { room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        console.log(`TimePick : ${this.state.TimePick}`)
        this.socket.emit("initSwitchSyncReq", { room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("getTimeline", { NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, Date: this.state.Date, Month: this.state.Month, Year: this.state.Year, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });


        this.socket.on("isDeviceConnect", async (data) => {

            this.setState({
                isPermit: Number(data.isDeviceConnect),
                NotifyConnect: data.NotifyConnect,
                time_Alive: data.time_Alive,
            })
            // console.log(`this.state.time_Alive Advance: ${this.state.time_Alive}`)
            // console.log(`this.state.time_Alive Advance: ${Number(data.time_Alive)}`)
            // console.log(`data.isDeviceConnect: ${data.isDeviceConnect}`)

        });

        this.socket.on("updateStatusSwitch", async (data) => {

            console.log(`updateStatusSwitch ${data.DataResult}`);
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

        this.socket.on("updateDataTimeline", async (data) => {
            console.log(`updateDataTimeline`)
            // console.log(`${data.DataResult}`)
            this.setState({
                data: data.DataResult
            })
        });

        this.MyInterval = setInterval(() => {
            if (this.state.time_Alive) {
                this.socket.emit("checkAlive", { room: `${this.props.Device.NameDevice}${this.props.Device.Key}`, time_Alive: this.state.time_Alive });

            }
        }
            , 1000);

    }
    componentWillUnmount() {
        this.socket.disconnect();
        clearInterval(this.MyInterval);
        console.log(`componentWillUnmount`)
    }



    handleSwitch = async (event) => {

        if (this.state.isPermit) {
            let status_pre = this.state.Status;
            this.socket.emit("handleSwitch", { Status: Number(!status_pre), NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
            this.setState({
                Status: Number(!status_pre),
            })
        }
    }

    handleClose_Btn = (event) => {
        let payload = { isOpen: 0 }
        this.props.isOpenAdvanceBox(payload);
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

        let response = await getTimeline(this.props.Device.NameDevice, this.props.Device.Key, Time.getDate(), Time.getMonth()+1, Time.getFullYear());
        console.log(`response.message ${response.message}`)
        if (!response.isError) {
            this.setState({
                data: response.DataResult
            })
        }
        else{
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
                                        <XAxis dataKey="TimeModify" type="category" allowDuplicatedCategory={false} />
                                        <YAxis />
                                        <CartesianGrid strokeDasharray="5 5" />
                                        <Tooltip />
                                        <Legend />
                                        <Line connectNulls type="monotone" dataKey="Status" stroke="#82ca9d" activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='Setting-SwitchAdvance'>
                                <div className='Names-SwitchAdvance'>

                                    <div className='NameDeviceCustom_Name-SwitchAdvance'>{this.props.Device.NameDeviceCustom}</div>
                                    <div className='NameDevice_Name-SwitchAdvance'> {this.props.Device.NameDevice} </div>
                                    <FontAwesomeIcon className='faTag' icon={faTag} />
                                </div>

                                <div className='Control-SwitchAdvance'>
                                    {this.state.Status
                                        ? <Button className='SwitchOn-SwitchAdvance' variant="outline-success" onClick={() => { this.handleSwitch() }}><FontAwesomeIcon className='faPowerOn-SwitchAdvance' icon={faPowerOff} /></Button>
                                        : <Button className='SwitchOff-SwitchAdvance' variant="outline-success" onClick={() => { this.handleSwitch() }}><FontAwesomeIcon className='faPowerOff-SwitchAdvance' icon={faPowerOff} /></Button>}
                                    <DisSwitch isPermit={this.state.isPermit}></DisSwitch>
                                    <NotifyConnectSwitchComponent NotifyConnect={this.state.NotifyConnect} isPermit={this.state.isPermit}></NotifyConnectSwitchComponent>

                                </div>


                                <div className='Key-SwitchAdvance'>

                                    <span className='ChangeKey'> Thay đổi Key

                                    </span>
                                    <span className='UpdateKey'> Cập nhật Key

                                    </span>

                                </div>

                                <div className='Btn-SwitchAdvance'>
                                    <button className='Close_Btn-SwitchAdvance'
                                        onClick={() => { this.handleClose_Btn() }}>Close</button>
                                </div>

                            </div>


                        </div>

                    </div>





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
        isOpenAdvanceBox: (payload) => dispatch(isOpenAdvanceBox(payload)),
    }

}
export default connect(mapStateToProps, mapDispatToProps)(Switch);