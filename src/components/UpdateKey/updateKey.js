import React from "react";
import './updatekey.scss';
import updateKey from '../../services/updateKey'
import { updateUser } from '../../store/action/userAction';
import { isOpenBox } from '../../store/action/ControlAction'
import { connect } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';


class UpdateKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Key: '',
            Notification: ''
        }
        toast.remove();
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
        payload.isOpenUpdateKeyBox = 0
        console.log(payload)
        this.props.isOpenBox(payload);

    }

    handleSave = async (event) => {
        toast.loading('Loading...');
        let response = await updateKey(this.props.User_Redux.user.UserName, this.props.User_Redux.user.Password, this.props.Device.NameDevice, this.state.Key);
        if (!response.isError) {
            toast.remove();
            console.log(response)
            let payload = { ...this.props.ControlAction_Redux }
            payload.isOpenUpdateKeyBox = 0
            payload.AdvanceBox.Device.Key = this.state.Key
            payload.AdvanceBox.isOpen = 1
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

        if (this.props.ControlAction_Redux.isOpenUpdateKeyBox) {
            return (
                <React.Fragment>
                    <div className='Background-UpdateKeyBox'>
                        <div className='Box'>
                            <Toaster className="Toaster"
                                position="top-center"
                                reverseOrder={false}
                            />
                            <div className='Title'>{this.props.Device.NameDeviceCustom}</div>

                            <div className='Content'>
                                <label className='Label'>Key thiết bị</label>
                                <input type="text"
                                    className='Input'
                                    placeholder='Nhập Key thiết bị'
                                    value={this.state.NewKey}
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

export default connect(mapStateToProps, mapDispatToProps)(UpdateKey)