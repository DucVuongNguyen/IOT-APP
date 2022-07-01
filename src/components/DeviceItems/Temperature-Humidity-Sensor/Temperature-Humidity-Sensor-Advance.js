import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import './Temperature-Humidity-Sensor-Advance.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperature4, faDroplet } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { isOpenBox } from '../../../store/action/ControlAction'
import checkDevice from '../../../services/checkDevice';
import getTimeline from '../../../services/TempHum-api/getTimeline'
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
            Humidity: NaN,
            Temperature: NaN,
            time_Alive: 0,
            room: `${this.props.Device.NameDevice}${this.props.Device.Key}`,
            data: [
                { Humidity: 0, Temperature: 0, TimeModify: 0 },

            ],
            TimePick: new Date(),
            Date: new Date().getDate(),
            Month: new Date().getMonth() + 1,
            Year: new Date().getFullYear(),
        };




    }



    componentDidMount() {
        console.log("TemperatureHumiditySensor Advance component render")
        this.socket = io.connect("https://iot-server-demo.herokuapp.com");
        console.log(`TemperatureHumiditySensor Advance ${this.props.Device.NameDevice} join room : ${this.props.Device.NameDevice}${this.props.Device.Key}`)
        this.socket.emit("TemperatureHumiditySensor", { function: 'join_room', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("TemperatureHumiditySensor", { function: 'GetInitStatus', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("TemperatureHumiditySensor", { function: 'getTimeline', NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, Date: this.state.Date, Month: this.state.Month, Year: this.state.Year, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });


        this.socket.on("isDeviceConnect", async (data) => {
            this.setState({
                isPermit: 1,
                NotifyConnect: `Cường độ tín hiệu: ${data.RSSI}`,
                time_Alive: Number(data.time_Alive),
            })
        });

        this.socket.on("SyncStatus", async (data) => {
            // console.log(`this.props.Device.NameDevice ${this.props.Device.NameDevice}`);
            // console.log(`Humidity ${data.Humidity}`);
            // console.log(`Temperature ${data.Temperature}`);
            // console.log(`data.isError ${data.isError}`);
            if (!Number(data.isError)) {
                this.setState({
                    Humidity: Number(data.Humidity).toFixed(2),
                    Temperature: Number(data.Temperature).toFixed(2),
                })
                let response = await getTimeline(this.props.Device.NameDevice, this.props.Device.Key, this.state.Date, this.state.Month, this.state.Year);
                console.log(`response.message ${response.DataResult}`)
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
                    Humidity: Number(data.Humidity).toFixed(2),
                    Temperature: Number(data.Temperature).toFixed(2),
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
                    this.socket.emit("TemperatureHumiditySensor", { function: 'leave_room', room: this.state.room });
                    this.socket.emit("TemperatureHumiditySensor", { function: 'join_room', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
                    this.socket.emit("TemperatureHumiditySensor", { function: 'GetInitStatus', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
                    this.socket.emit("TemperatureHumiditySensor", { function: 'getTimeline', NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, Date: this.state.Date, Month: this.state.Month, Year: this.state.Year, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
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
        console.log(`componentWillUnmount ${this.props.Device.NameDevice}`)
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


                    <div className='Background-TemperatureHumiditySensorAdvance'>
                        <div className='Box'>
                            <div className='Chart'>

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
                                        <Line connectNulls dataKey="Humidity" stroke="#4682B4" fill="#4682B4" dot={false} activeDot={{ r: 5 }} />
                                        <Line connectNulls dataKey="Temperature" stroke="#A00000" fill="#A00000" dot={false} activeDot={{ r: 5 }} />
                                        <Brush
                                            width={800}
                                            height={10} />

                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='Setting'>
                                <div className='Names'>

                                    <div className='NameDeviceCustom_Name' onClick={() => { this.handleRename() }}>{this.props.Device.NameDeviceCustom}</div>
                                    <div className='NameDevice_Name'> {this.props.Device.NameDevice} </div>

                                </div>

                                <div className='Control'>
                                    {
                                        this.state.isPermit === 1 &&

                                        <React.Fragment>
                                            <div className='Temperature'>
                                                <FontAwesomeIcon className='faTemperature4' icon={faTemperature4} />
                                                <span className='Temp-Text'>{this.state.Temperature}°C</span>


                                            </div>
                                            <div className='Humidity'>
                                                <FontAwesomeIcon className='faDroplet' icon={faDroplet} />
                                                <span className='Hum-Text'>{this.state.Humidity}%</span>
                                            </div>
                                            <span className='Notify'>{this.state.NotifyConnect}</span>
                                        </React.Fragment>
                                    }
                                    {
                                        this.state.isPermit === 0 &&

                                        <React.Fragment>
                                            <div className='Temperature-dis'>
                                                <FontAwesomeIcon className='faTemperature4-dis' icon={faTemperature4} />
                                                <span className='Temp-Text-dis'>{this.state.Temperature}°C</span>


                                            </div>
                                            <div className='Humidity-dis'>
                                                <FontAwesomeIcon className='faDroplet-dis' icon={faDroplet} />
                                                <span className='Hum-Text-dis'>{this.state.Humidity}%</span>
                                            </div>
                                            <span className='Notify-dis'>{this.state.NotifyConnect}</span>
                                        </React.Fragment>
                                    }

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