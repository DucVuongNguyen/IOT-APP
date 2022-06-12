import React, { Component } from 'react';
import './SwitchComponent.scss';
import img from '../../../assets/img/Switch.png'
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import deleteDevice from '../../../services/deleteDevice';
import { updateUser } from '../../../store/action/userAction'
import { connect } from 'react-redux';
import { isOpenAdvanceBox } from '../../../store/action/ControlAction';

import io from "socket.io-client";


class SwitchComponent extends Component {
    socket
    constructor(props) {
        super(props);
        this.state = {
            NotifyConnect: 'Thiết bị mất kết nối!',
            isPermit: 0,
            Status: 0,
            pre_isError: 0,
            time_Alive: 0,
        };

    }
    componentDidMount() {
        this.socket = io.connect("https://iot-server-demo.herokuapp.com");
        console.log("Switch component render")
        console.log(`Switch ${this.props.Device.NameDevice} join room : ${this.props.Device.NameDevice}${this.props.Device.Key}`)

        this.socket.emit("join_room", { room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });

        this.socket.emit("initSwitchSyncReq", { room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });


        this.socket.on("isDeviceConnect", async (data) => {

            // console.log(`Thời gian nhận từ Server ${data.time_Alive}`);
            // console.log(`this.props.Device.NameDevice ${this.props.Device.NameDevice}`);
            


            this.setState({
                isPermit: Number(data.isDeviceConnect),
                NotifyConnect: data.NotifyConnect,
                time_Alive: Number(data.time_Alive),
            })
            // console.log(`this.state.isPermit ${this.state.isPermit}`);
            // console.log(`Thời gian nhận đã cập nhật ${this.state.time_Alive}`);
        });

        this.socket.on("updateStatusSwitch", async (data) => {
            // console.log(`this.props.Device.NameDevice ${this.props.Device.NameDevice}`);
            // console.log(`updateStatusSwitch ${data.DataResult}`);
            // console.log(`data.isError ${data.isError}`);
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
            // console.log(`this.state.Status ${this.state.Status}`);

        });


        this.MyInterval = setInterval(() => {
            // console.log(`Thời gian gửi lên checkAlive ${this.state.time_Alive} ${this.props.Device.NameDevice}`)
            if (this.props.ControlAction_Redux.AdvanceBox.isOpen === 0) {
                this.socket.emit("checkAlive", { room: `${this.props.Device.NameDevice}${this.props.Device.Key}`, time_Alive: this.state.time_Alive });
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
            this.socket.emit("handleSwitch", { Status: Number(!status_pre), NameDevice: `${this.props.Device.NameDevice}`, Key: `${this.props.Device.Key}`, room: `${this.props.Device.NameDevice}${this.props.Device.Key}` });
            this.setState({
                Status: Number(!status_pre),
            })
        }



    }




    handle_deleteDevice = async (event) => {    
        let isError = 1;
        console.log(`this.props.User_Redux.user.UserName: ${this.props.User_Redux.user.UserName}`);
        console.log(`this.props.User_Redux.user.Password: ${this.props.User_Redux.user.Password}`);
        console.log(`this.props.Device.NameDevice: ${this.props.Device.NameDevice}`);
        let response_;
        while (isError) {
            let response = await deleteDevice(this.props.User_Redux.user.UserName, this.props.User_Redux.user.Password, this.props.Device.NameDevice);
            isError = response.isError;
            console.log(`deleteData`);
            response_ = response;
        }
        if (!isError) {
            delete response_.isError;
            let payload = response_;
            this.props.updateUser(payload);
        }





    }

    handleOpenAdvance = (event) => {
        let payload = { isOpen: 1, Device: this.props.Device }
        this.props.isOpenAdvanceBox(payload);
    }
    render() {
        // console.log(`this.props.Device.NameDevice: ${this.props.Device.NameDevice}`)
        // console.log(`this.state.Status: ${this.state.Status}`)
        // console.log(`Thời gian nhận đã cập nhật ${this.state.time_Alive}`);


        return (
            <React.Fragment>

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
        isOpenAdvanceBox: (payload) => dispatch(isOpenAdvanceBox(payload)),
        updateUser: (payload) => dispatch(updateUser(payload))
    }

}

export default connect(mapStateToProps, mapDispatToProps)(SwitchComponent);