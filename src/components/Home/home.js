import React from "react";
import './home.scss';
import AddDevice from '../AddDevice/addDevice'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPlus, faMobileScreen, faMagic, faUser, faArrowRightFromBracket, faList, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { loginUser } from '../../store/action/userAction';
import { isOpenBox } from '../../store/action/ControlAction'
import { Navigate } from "react-router-dom";

import SwitchComponent from '../DeviceItems/Switch/SwitchComponent';
import SwitchAdvance from '../DeviceItems/Switch/SwitchAdvance';
import TemperatureHumiditySensorComponent from "../DeviceItems/Temperature-Humidity-Sensor/Temperature-Humidity-Sensor-Component";
import TemperatureHumiditySensorAdvance from "../DeviceItems/Temperature-Humidity-Sensor/Temperature-Humidity-Sensor-Advance";

import toast from 'react-hot-toast';






class Home extends React.Component {
    // hàm tạo: chạy trước khi render
    constructor(props) {
        super(props);
        this.state = {


        }
        toast.remove();

    }

    handleLogout = (event) => {
        let logout = { checkLogin: 0 }
        // console.log(`username: ${this.state.username}`);
        // console.log(`password: ${this.state.password}`);
        this.props.User(logout)

    }

    handleAddDevice = (event) => {
        let payload = { ...this.props.ControlAction_Redux }
        payload.isOpenAddBox = 1
        console.log(payload)
        this.props.isOpenBox(payload)

    }


    render() {

        if (this.props.User_Redux.checkLogin === 1) {
            console.log(`Home component re-render`)
            return (
                <React.Fragment>
                    <AddDevice></AddDevice>
                    {toast.remove()}


                    <div className="Background">
                        {/* header */}
                        <div className="Header">
                            <div className="Header-start">
                                <span className="NameAccount-header">{this.props.User_Redux.user.UserName}</span>
                                <FontAwesomeIcon className="faCaretDown" icon={faCaretDown} />
                            </div>

                            <div className="Header-end">
                                <div className="Add-div">
                                    <FontAwesomeIcon className="FaBell-header" icon={faBell} />
                                    <FontAwesomeIcon className="FaFlus-header" icon={faPlus} onClick={() => { this.handleAddDevice() }} />

                                </div>
                                <div className="Logout-div">
                                    <FontAwesomeIcon className="FaArrowRightFromBracket-header" icon={faArrowRightFromBracket} onClick={() => { this.handleLogout() }} />
                                </div>
                            </div>

                        </div>
                        {/* Tabs */}

                        <div className="Tabs">

                            <div className="Tab-top">
                                <FontAwesomeIcon className="faList" icon={faList} />
                                <span className="Tab-name">Quản lý thiết bị của bạn</span>
                            </div>

                            <div className="DeviceItem">

                                {
                                    this.props.User_Redux.user.Devices.length > 0 &&
                                    this.props.User_Redux.user.Devices.map((device, index) => {
                                    console.log(`${device.NameDevice}`)
                                        return (
                                <React.Fragment>
                                    <ShowDevices key={device.NameDevice} Device={device}></ShowDevices>
                                </React.Fragment>
                                )

                                    }
                                )


                                }

                                {Number(this.props.ControlAction_Redux.AdvanceBox.isOpen) === 1 &&
                                    <ShowAdvance Device={this.props.ControlAction_Redux.AdvanceBox.Device}></ShowAdvance>
                                }

                            </div>
                        </div>
                        {/* footer */}
                        <div className="Footer">
                            <div className="Footer-items">
                                <div className="Footer-item">
                                    <FontAwesomeIcon className="Footer-icon" icon={faMobileScreen} />
                                    <span className="Footer-name">Thiết bị</span>
                                </div>
                                <div className="Footer-item">
                                    <FontAwesomeIcon className="Footer-icon" icon={faMagic} />
                                    <span className="Footer-name">Tự động</span>
                                </div>
                                <div className="Footer-item">
                                    <FontAwesomeIcon className="Footer-icon" icon={faUser} />
                                    <span className="Footer-name">Hồ sơ</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </React.Fragment >

            )
        }
        else {
            toast.remove();
            return (
                <React.Fragment>
                    <Logout></Logout>
                </React.Fragment>

            )

        }

    }

}

const Logout = (props) => {
    return (
        <Navigate to="/Login" replace={true} />
    )
}


const ShowDevices = (props) => {
    let Device = props.Device
    switch (Device.Type) {
        case 'Switch': {
            return (
                <SwitchComponent Device={Device}></SwitchComponent>
            )
        }
        case 'TemperatureHumiditySensor': {
            return (
                <TemperatureHumiditySensorComponent Device={Device}></TemperatureHumiditySensorComponent>
            )
        }
        default: {
            return null
        }
    }

}

const ShowAdvance = (props) => {
    let Device = props.Device
    switch (Device.Type) {
        case 'Switch': {
            return (
                < SwitchAdvance Device={Device}></SwitchAdvance>
            )
        }
        case 'TemperatureHumiditySensor': {
            return (
                <TemperatureHumiditySensorAdvance Device={Device}></TemperatureHumiditySensorAdvance>
            )
        }
        default: {
            return null
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
        User: (payload) => dispatch(loginUser(payload)),
        isOpenBox: (payload) => dispatch(isOpenBox(payload))
    }

}

export default connect(mapStateToProps, mapDispatToProps)(Home);