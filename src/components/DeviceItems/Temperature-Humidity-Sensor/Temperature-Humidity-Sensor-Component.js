import React, { Component } from 'react';
import './Temperature-Humidity-Sensor-Component.scss';
import img from '../../../assets/img/Temperature-Humidity-Sensor.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTemperature4, faDroplet } from '@fortawesome/free-solid-svg-icons';
import deleteDevice from '../../../services/deleteDevice';
import checkDevice from '../../../services/checkDevice';
import { updateUser } from '../../../store/action/userAction'
import { connect } from 'react-redux';
import { isOpenBox } from '../../../store/action/ControlAction';
import toast, { Toaster } from 'react-hot-toast';


import io from "socket.io-client";


class TemperatureHumiditySensorComponent extends Component {
    socket
    constructor(props) {
        super(props);
        this.state = {
            NotifyConnect: 'Đang kết nối với thiết bị!',
            isPermit: 0,
            Humidity: NaN,
            Temperature: NaN,
            time_Alive: 0,
            room: `${this.props.Device.NameDevice}${this.props.Device.Key}`
        };

    }

    componentDidMount() {
        toast.remove();
        this.socket = io.connect("https://iot-server-demo.herokuapp.com");
        console.log("TemperatureHumiditySensor component render")
        console.log(`TemperatureHumiditySensor ${this.props.Device.NameDevice} join room : ${this.props.Device.NameDevice}${this.props.Device.Key}`)
        this.socket.emit("TemperatureHumiditySensor", { function: 'join_room', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("TemperatureHumiditySensor", { function: 'GetInitStatus', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });

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

            }
            else {
                this.setState({
                    NotifyConnect: data.message,
                })
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


        this.MyInterval = setInterval(async () => {
            let time_ = new Date().getTime();
            let timer = (Number(time_) - Number(this.state.time_Alive)) / 1000
            // console.log(`timer: ${timer} `)
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

    handle_deleteDevice = async (event) => {
        this.socket.disconnect();
        toast.loading('Loading...');
        let response = await deleteDevice(this.props.User_Redux.user.UserName, this.props.User_Redux.user.Password, this.props.Device.NameDevice);

        if (!response.isError) {
            let payload = { ...this.props.User_Redux }
            delete response.isError;
            payload.message = response.message;
            payload.user = response.user;
            this.props.updateUser(payload);
        }
        toast.remove();
    }

    handleOpenAdvance = (event) => {
        let payload = { ...this.props.ControlAction_Redux }
        payload.AdvanceBox.isOpen = 1
        payload.AdvanceBox.Device = this.props.Device
        console.log(payload)
        this.props.isOpenBox(payload);
    }

    render() {

        return (
            <React.Fragment>
                <Toaster className="Toaster"
                    position="top-center"
                    reverseOrder={false}
                />

                <div className='TemperatureHumiditySensorComponent-Box'>
                    <div className='Left' onClick={() => { this.handleOpenAdvance() }}>
                        <img className='img' src={img} alt={"img"} />
                        <div className='NameCustom'>{this.props.Device.NameDeviceCustom}</div>
                        <div className='NameDevice'>{this.props.Device.NameDevice}</div>

                    </div>
                    <hr className='rule'></hr>
                    <div className='Right'>
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
                    <FontAwesomeIcon className='faXmark' icon={faXmark} onClick={() => { this.handle_deleteDevice() }} />
                </div>


            </React.Fragment>
        )

    }
}
const mapStateToProps = (state) => {
    return {
        ControlAction_Redux: state.ControlAction,
        User_Redux: state.User,


    }
}

const mapDispatToProps = (dispatch) => {
    return {
        isOpenBox: (payload) => dispatch(isOpenBox(payload)),
        updateUser: (payload) => dispatch(updateUser(payload))
    }

}

export default connect(mapStateToProps, mapDispatToProps)(TemperatureHumiditySensorComponent);