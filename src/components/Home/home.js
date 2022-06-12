import React from "react";
import './home.scss';
import AddDevice from '../AddDevice/addDevice'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPlus, faMobileScreen, faMagic, faUser, faArrowRightFromBracket, faList, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { loginUser } from '../../store/action/userAction';
import { isOpenAddBox, isOpenAdvanceBox } from '../../store/action/ControlAction'
import { Navigate } from "react-router-dom";

import SwitchComponent from '../DeviceItems/Switch/SwitchComponent';
import SwitchAdvance from '../DeviceItems/Switch/SwitchAdvance';






class Home extends React.Component {
    // hàm tạo: chạy trước khi render
    constructor(props) {
        super(props);
        this.state = {


        }
    }

    handleLogout = (event) => {
        let logout = { checkLogin: 0 }
        // console.log(`username: ${this.state.username}`);
        // console.log(`password: ${this.state.password}`);
        this.props.User(logout)
        let payload = { isOpen: 0 }
        this.props.isOpenAdvanceBox(payload);

    }

    handleAddDevice = (event) => {
        let payload = 1
        this.props.isOpenAddBox(payload)
        // console.log(`this.props.Device_Redux.isOpenAddBox: ${this.props.Device_Redux.isOpenAddBox}`)

    }


    render() {

        if (this.props.User_Redux.checkLogin === 1) {
            console.log(`Home component re-render`)

            return (
                <React.Fragment>
                    <AddDevice></AddDevice>

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
                                    < SwitchAdvance Device={this.props.ControlAction_Redux.AdvanceBox.Device}></SwitchAdvance>
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
            return (
                <React.Fragment>
                    <Logout></Logout>
                </React.Fragment>

            )

        }

    }

}

const Logout = (props) => {
    //Kiểm tra giá trị của props
    if (!props.checkLogin) {
        //Trả về JSX để hiển thị
        return (
            <Navigate to="/Login" replace={true} />
        )
    }
}


const ShowDevices = (props) => {
    let Device = props.Device
    if (Device.Type === 'Switch') {
        //Trả về JSX để hiển thị
        return (
            <SwitchComponent Device={Device}></SwitchComponent>
        )
    } else {
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
        User: (payload) => dispatch(loginUser(payload)),
        isOpenAddBox: (payload) => dispatch(isOpenAddBox(payload)),
        isOpenAdvanceBox: (payload) => dispatch(isOpenAdvanceBox(payload)),

    }

}

export default connect(mapStateToProps, mapDispatToProps)(Home);