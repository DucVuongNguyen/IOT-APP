import React, { Component } from 'react';
import './SwitchComponent.scss';
import img from '../../../assets/img/Switch.png'
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import deleteDevice from '../../../services/deleteDevice';
import checkDevice from '../../../services/checkDevice';
import { updateUser } from '../../../store/action/userAction'
import { connect } from 'react-redux';
import { isOpenBox } from '../../../store/action/ControlAction';
import toast, { Toaster } from 'react-hot-toast';

import io from "socket.io-client";


class SwitchComponent extends Component {
    socket
    constructor(props) {
        super(props);
        this.state = {
            NotifyConnect: 'Đang kết nối với thiết bị!',
            isPermit: 0,
            Status: 0,
            time_Alive: 0,
            room: `${this.props.Device.NameDevice}${this.props.Device.Key}`
        };

    }
    componentDidMount() {
        toast.remove();
        this.socket = io.connect("https://iot-server-demo.herokuapp.com");
        console.log("Switch component render")
        console.log(`Switch ${this.props.Device.NameDevice} join room : ${this.props.Device.NameDevice}${this.props.Device.Key}`)
        this.socket.emit("Switch", { function: 'join_room', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
        this.socket.emit("Switch", { function: 'GetInitStatus', room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });

        this.socket.on("isDeviceConnect", async (data) => {
            this.setState({
                isPermit: 1,
                NotifyConnect: `Cường độ tín hiệu: ${data.RSSI}`,
                time_Alive: Number(data.time_Alive),
            })
            console.log(`data.room ${data.room}`);
            // console.log(`${this.props.Device.NameDevice}${this.props.Device.Key}-time_Alive Server ${data.time_Alive}`);

        });

        this.socket.on("SyncStatus", async (data) => {
            // console.log(`this.props.Device.NameDevice ${this.props.Device.NameDevice}`);
            // console.log(`SyncStatus ${data.DataResult}`);
            // console.log(`data.isError ${data.room}`);
            if (!Number(data.isError)) {
                this.setState({
                    Status: Number(data.DataResult),
                })

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

        this.MyInterval = setInterval(async () => {
            let time_ = new Date().getTime();
            let timer = (Number(time_) - Number(this.state.time_Alive)) / 1000
            // console.log(`${this.props.Device.NameDevice}${this.props.Device.Key}-this.state.time_Alive ${this.state.time_Alive}`);
            // console.log(`${this.props.Device.NameDevice}${this.props.Device.Key}-time_Alive Server ${this.state.time_Alive}`)
            console.log(`${this.props.Device.NameDevice}${this.props.Device.Key}-timer: ${timer}`)
            // console.log(`this.state.time_Alive: ${this.state.time_Alive}`)
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


    handleSwitch = async (event) => {

        // this.socket.connect()
        if (this.state.isPermit) {
            let status_pre = this.state.Status;
            this.socket.emit("Switch", { function: 'AppToDevice', Status: Number(!status_pre), NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
            this.setState({
                Status: Number(!status_pre),
            })
        }



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
        // let payload = { isOpen: 1, Device: this.props.Device }
        this.props.isOpenBox(payload);
    }
    render() {
        // console.log(`this.props.Device.NameDevice: ${this.props.Device.NameDevice}`)
        // console.log(`this.state.Status: ${this.state.Status}`)
        // console.log(`Thời gian nhận đã cập nhật ${this.state.time_Alive}`)

        return (
            <React.Fragment>
                <Toaster className="Toaster"
                    position="top-center"
                    reverseOrder={false}
                />
                <div className='SwitchComponent-Box'>
                    <div className='SwitchComponent-Left' onClick={() => { this.handleOpenAdvance() }}>
                        <img className='SwitchComponent-img' src={img} alt={"img"} />
                        <div className='SwitchComponent-NameCustom'>{this.props.Device.NameDeviceCustom}</div>
                        <div className='SwitchComponent-NameDevice'> {this.props.Device.NameDevice} </div>

                    </div>
                    <hr className='rule'></hr>
                    <div className='SwitchComponent-Right'>
                        {this.state.Status ? <Button className='SwitchComponent-SwitchOn' variant="outline-success" onClick={() => { this.handleSwitch() }}><FontAwesomeIcon className='SwitchComponent-faPowerOn' icon={faPowerOff} /></Button> : <Button className='SwitchComponent-SwitchOff' variant="outline-success" onClick={() => { this.handleSwitch() }}><FontAwesomeIcon className='SwitchComponent-faPowerOff' icon={faPowerOff} /></Button>}
                        <DisSwitch isPermit={this.state.isPermit}></DisSwitch>


                        <NotifyConnectSwitchComponent NotifyConnect={this.state.NotifyConnect} isPermit={this.state.isPermit}></NotifyConnectSwitchComponent>

                    </div>
                    <FontAwesomeIcon className='faXmark' icon={faXmark} onClick={() => { this.handle_deleteDevice() }} />
                </div>


            </React.Fragment>
        )
    }
}



const NotifyConnectSwitchComponent = (props) => {
    //Kiểm tra giá trị của props
    //Trả về JSX để hiển thị
    if (props.isPermit) {
        return (
            <span className='NotifyConnect-SwitchComponent'>{props.NotifyConnect}</span>
        )
    }
    else {
        return (
            <span className='NotifyDisconnect-SwitchComponent'>{props.NotifyConnect}</span>
        )
    }


}

const DisSwitch = (props) => {
    //Kiểm tra giá trị của props
    //Trả về JSX để hiển thị
    if (!props.isPermit) {

        return (
            <Button className='SwitchComponent-Discontrol' variant="outline-success"><FontAwesomeIcon className='SwitchComponent-faPowerDiscontrol' icon={faPowerOff} /></Button>
        )
    }
    else {
        return null;
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

export default connect(mapStateToProps, mapDispatToProps)(SwitchComponent);