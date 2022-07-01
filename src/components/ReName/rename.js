import React from "react";
import './rename.scss';
import renameDevice from '../../services/renameDevice';
import { updateUser } from '../../store/action/userAction';
import { isOpenBox } from '../../store/action/ControlAction'
import { connect } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';


class Rename extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            RenameDevice: '',
            Notification: ''
        }
        toast.remove();
    }

    handleOnChangeRename = (event) => {
        console.log(event.target.value);
        this.setState({
            RenameDevice: event.target.value,
            Notification: ''
        })

    }

    handleClose = (event) => {
        let payload = { ...this.props.ControlAction_Redux }
        payload.isOpenRenameBox = 0
        console.log(payload)
        this.props.isOpenBox(payload);

    }

    handleSave = async (event) => {
        toast.loading('Loading...');
        let response = await renameDevice(this.props.User_Redux.user.UserName, this.props.User_Redux.user.Password, this.props.Device.NameDevice, this.state.RenameDevice);
        if (!response.isError) {
            console.log(response)
            let payload = { ...this.props.ControlAction_Redux }
            payload.isOpenRenameBox = 0
            payload.AdvanceBox.Device.NameDeviceCustom = this.state.RenameDevice
            console.log(payload)
            this.props.isOpenBox(payload)
            payload = { ...this.props.User_Redux }
            delete response.isError;
            payload.message = response.message;
            payload.user = response.user;
            this.props.updateUser(payload);
        } else {
            this.setState({
                Notification: response.message
            })
        }
        toast.remove();



    }

    render() {

        if (this.props.ControlAction_Redux.isOpenRenameBox) {
            return (
                <React.Fragment>
                    <div className='Background-RenameBox'>
                        <div className='Box'>
                            <Toaster className="Toaster"
                                position="top-center"
                                reverseOrder={false}
                            />
                            <div className='Title'>{this.props.Device.NameDeviceCustom}</div>
                            <div className='Content'>
                                <input type="text"
                                    className='Input'
                                    placeholder='Nhập tên thay đổi'
                                    value={this.state.Key}
                                    onChange={(event) => this.handleOnChangeRename(event)} />
                            </div>
                            <Notification Notification={this.state.Notification} />
                            <div className='Bnt-Control'>
                                <button className='Bnt-'
                                    onClick={() => { this.handleSave() }}>Lưu</button>
                                <button className='Bnt-'
                                    onClick={() => { this.handleClose() }}>Đóng</button>

                            </div>

                        </div>

                    </div>

                </React.Fragment>

            )
        } return null;

    }
}

const Notification = (props) => {
    //Kiểm tra giá trị của props
    return (
        <span style={{ color: "#fd2d2d", fontSize: "16px" }}>{props.Notification}</span>
    )
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
        updateUser: (payload) => dispatch(updateUser(payload))
    }
}

export default connect(mapStateToProps, mapDispatToProps)(Rename)