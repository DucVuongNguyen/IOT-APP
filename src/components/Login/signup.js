import React, { Component } from 'react';
import './signup.scss';
import signup from '../../services/signup';
import { } from "@fortawesome/react-fontawesome";
import { } from '@fortawesome/free-solid-svg-icons';
import { } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import { connect } from 'react-redux';
import { loginUser } from '../../store/action/userAction'
import toast, { Toaster } from 'react-hot-toast';





class Login extends Component {
    // hàm tạo: chạy trước khi render
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            Notification: '',
            isClose: 0,
            isError: 0
        }

    }


    handleOnChangeUsername = (event) => {
        console.log(event.target.value);
        this.setState({
            username: event.target.value,
            Notification: ''
        })

    }
    handleOnChangePassword = (event) => {
        console.log(event.target.value);
        this.setState({
            password: event.target.value,
            Notification: ''
        })

    }
    handleSignup = async (event) => {
        console.log('Sign up')
        toast.loading('Loading...');
        let response = await signup(this.state.username, this.state.password);
        if (response) {
            this.setState({
                Notification: response.message,
                isError: response.isError
            })

        }
        toast.remove();
    }
    handleLogin = async (event) => {
        console.log('Close')
        this.setState({
            isClose: 1,
        })
    }



    render() {

        return (
            <React.Fragment>
                <Toaster className="Toaster"
                    position="top-center"
                    reverseOrder={false}
                />
                <section className='Signup-Background'>
                    <div className='Box'>
                        <div className='Title'>Sign up</div>
                        <div className='placeholde'>Đăng kí tài khoản mới</div>
                        <div className='Content'>
                            <label className='Label'>Username</label>
                            <input type="text"
                                className='Input'
                                placeholder='Tên tài khoản đăng ký'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)} />
                        </div>
                        <div className='Content'>
                            <label className='Label'>Password</label>
                            <input type="text"
                                className='Input'
                                placeholder='Mật khẩu tài khoản đăng kí'
                                value={this.state.password}
                                onChange={(event) => this.handleOnChangePassword(event)} />
                        </div>
                        <Notification isError={this.state.isError} Notification={this.state.Notification} />
                        <div className='Bnt_Box'>
                            <button className='Bnt'
                                onClick={() => { this.handleLogin() }}>Đăng nhập</button>
                            <button className='Bnt'
                                onClick={() => { this.handleSignup() }}>Đăg ký</button>
                        </div>

                    </div>
                    {this.state.isClose ? <Navigate to="/Login" replace={true} /> : null}
                </section>

            </React.Fragment>


        )
    }

}

const Notification = (props) => {
    //Kiểm tra giá trị của props
    if (Number(props.isError)) {
        return (
            <span style={{ color: "#fd2d2d" }}>{props.Notification}</span>
        )
    }
    else {
        return (
            <span style={{ color: "rgb(67, 205, 128)" }}>{props.Notification}</span>
        )
    }
}

const mapStateToProps = (state) => {
    return { User_Redux: state.User }
}

const mapDispatToProps = (dispatch) => {
    return {
        User: (payload) => dispatch(loginUser(payload)),
    }

}
export default connect(mapStateToProps, mapDispatToProps)(Login);
