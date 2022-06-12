import React from "react";
import './addDevice.scss';
import { updateUser } from '../../store/action/userAction';
import { isOpenAddBox } from '../../store/action/ControlAction'
import { connect } from 'react-redux';
import addDevice from '../../services/addDevice';
import checkDevice from '../../services/checkDevice';



class AddDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NameDevice: '',
            Key: '',
            Notification: ''
        }

    }

    handleOnChangeNameDevice = (event) => {
        console.log(event.target.value);
        this.setState({
            NameDevice: event.target.value,
            Notification: ''
        })

    }
    handleOnChangePassword = (event) => {
        console.log(event.target.value);
        this.setState({
            Key: event.target.value,
            Notification: ''
        })

    }

    handleCancel = (event) => {
        let payload = 0
        this.props.isOpenAddBox(payload)
    }

    handleAddDevice = async (event) => {
        console.log(`this.props.User_Redux.user.UserName: ${this.props.User_Redux.user.UserName}`);
        console.log(`this.props.User_Redux.user.Password: ${this.props.User_Redux.user.Password}`);
        console.log(`this.state.NameDevice: ${this.state.NameDevice}`);
        console.log(`this.state.PasswordDevice: ${this.state.Key}`);
        let response = await checkDevice(this.state.NameDevice, this.state.Key);

        let Type = response.Type;
        console.log(`Type: ${Type}`);

        if (!response.isError) {

            let response = await addDevice(this.props.User_Redux.user.UserName, this.props.User_Redux.user.Password, this.state.NameDevice, this.state.Key, Type);
            if (!response.isError) {
                let payload = 0
                this.props.isOpenAddBox(payload)
                delete response.isError;
                payload = response;
                this.props.updateUser(payload);
            }
            else {
                console.log(`response: ${response.message}`);
                this.setState({
                    Notification: response.message
                })

            }

        }
        else {
            console.log(`response: ${response.message}`);
            this.setState({
                Notification: response.message
            })

        }
        this.setState({
            NameDevice: '',
            Key: ''
        })

    }

    render() {

        if (this.props.ControlAction_Redux.isOpenAddBox) {
            return (
                <React.Fragment>
                    <div className='Background-AddBox'>
                        <div className='AddBox'>
                            <div className='Title'>Thêm thiết bị mới</div>
                            <div className='Content'>
                                <label className='Label'>Tên thiết bị</label>
                                <input type="text"
                                    className='Input'
                                    placeholder='Nhập tên thiết bị'
                                    value={this.state.NameDevice}
                                    onChange={(event) => this.handleOnChangeNameDevice(event)} />
                            </div>
                            <div className='Content'>
                                <label className='Label'>Key</label>
                                <input type="text"
                                    className='Input'
                                    placeholder='Nhập Key thiết bị'
                                    value={this.state.Key}
                                    onChange={(event) => this.handleOnChangePassword(event)} />
                            </div>
                            <Notification Notification={this.state.Notification} />
                            <div className='Bnt-Control'>
                                <button className='Bnt-'
                                    onClick={() => { this.handleAddDevice() }}>Add</button>
                                <button className='Bnt-'
                                    onClick={() => { this.handleCancel() }}>Cancel</button>

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
        <span style={{ color: "#fd2d2d" }}>{props.Notification}</span>
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
        isOpenAddBox: (payload) => dispatch(isOpenAddBox(payload)),
        updateUser: (payload) => dispatch(updateUser(payload))
    }
}

export default connect(mapStateToProps, mapDispatToProps)(AddDevice)