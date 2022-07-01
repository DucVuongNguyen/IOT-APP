import React from "react";
import './changeKey.scss';
import changeKey from '../../services/changeKey'
import { updateUser } from '../../store/action/userAction';
import { isOpenBox } from '../../store/action/ControlAction'
import { connect } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';


class ChangeKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NewKey: '',
            Key: '',
            Notification: ''
        }
        toast.remove();
    }

    handleOnChangeNewKey = (event) => {
        console.log(event.target.value);
        this.setState({
            NewKey: event.target.value,
            Notification: ''
        })

    }
    handleOnChangeKey = (event) => {
        console.log(event.target.value);
        this.setState({
            Key: event.target.value,
            Notification: ''
        })

    }

    handleClose = (event) => {
        let payload = { ...this.props.ControlAction_Redux }
        payload.isOpenChangeKeyBox = 0
        console.log(payload)
        this.props.isOpenBox(payload);

    }

    handleSave = async (event) => {
        toast.loading('Loading...');
        let response = await changeKey(this.props.User_Redux.user.UserName, this.props.User_Redux.user.Password, this.props.Device.NameDevice, this.state.Key, this.state.NewKey);
        if (!response.isError) {
            toast.remove();
            console.log(response)
            let payload = { ...this.props.ControlAction_Redux }
            payload.isOpenChangeKeyBox = 0
            payload.AdvanceBox.isOpen = 1
            payload.AdvanceBox.Device.Key = this.state.NewKey
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
            toast.remove();

        }

    }

    render() {

        if (this.props.ControlAction_Redux.isOpenChangeKeyBox) {
            return (
                <React.Fragment>
                    <div className='Background-ChangeKeyBox'>
                        <div className='Box'>
                            <Toaster className="Toaster"
                                position="top-center"
                                reverseOrder={false}
                            />
                            <div className='Title'>{this.props.Device.NameDeviceCustom}</div>

                            <div className='Content'>
                                <label className='Label'>New Key</label>
                                <input type="text"
                                    className='Input'
                                    placeholder='Nhập Key thay đổi cho thiết bị'
                                    value={this.state.NewKey}
                                    onChange={(event) => this.handleOnChangeNewKey(event)} />
                            </div>
                            <div className='Content'>
                                <label className='Label'>Key</label>
                                <input type="text"
                                    className='Input'
                                    placeholder='Nhập Key hiện tại của thiết bị'
                                    value={this.state.Key}
                                    onChange={(event) => this.handleOnChangeKey(event)} />
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

export default connect(mapStateToProps, mapDispatToProps)(ChangeKey)