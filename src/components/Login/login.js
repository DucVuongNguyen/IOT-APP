import React, { Component } from 'react';
import './login.scss';
import checkUserService from '../../services/checkUserService';
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
            Signup: 0,
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
    handleLogin = async (event) => {
        // console.log(`username: ${this.state.username}`);
        // console.log(`password: ${this.state.password}`);
        toast.loading('Loading...');
        let response = await checkUserService(this.state.username, this.state.password);
        console.log('response.checkLogin: ' + response.checkLogin)
        delete response.isError;
        this.props.User(response)
        this.setState({
            Notification: response.message
        })
        toast.remove();

    }
    handleSignup = async (event) => {
        console.log('Signup')
        this.setState({
            Signup: 1
        })
    }



    render() {

        return (
            <React.Fragment>
                <Toaster className="Toaster"
                    position="top-center"
                    reverseOrder={false}
                />
                <section className='Login-Background'>
                    <div className='LoginBox'>
                        <div className='Title'>Login</div>
                        <div className='placeholde'>Đăng nhập tài khoản</div>
                        <div className='Content'>
                            <label className='Label'>Username</label>
                            <input type="text"
                                className='Input'
                                placeholder='Tên tài khoản đăng nhập'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)} />
                        </div>
                        <div className='Content'>
                            <label className='Label'>Password</label>
                            <input type="text"
                                className='Input'
                                placeholder='Mật khẩu tài khoản đăng nhập'
                                value={this.state.password}
                                onChange={(event) => this.handleOnChangePassword(event)} />
                        </div>
                        <Notification checkLogin={this.props.User_Redux.checkLogin} Notification={this.state.Notification} />
                        <div className='Bnt_Box'>
                            <button className='Bnt'
                                onClick={() => { this.handleLogin() }}>Đăng nhập</button>
                            <button className='Bnt'
                                onClick={() => { this.handleSignup() }}>Đăng ký</button>
                        </div>

                    </div>

                </section>
                {this.state.Signup ? <Navigate to="/Signup" replace={true} /> : null}

            </React.Fragment>


        )
    }

}

const Notification = (props) => {
    //Kiểm tra giá trị của props
    if (props.checkLogin) {
        //Trả về JSX để hiển thị
        return (
            <Navigate to="/Home" replace={true} />
        )
    } else {
        return (
            <span style={{ color: "#fd2d2d" }}>{props.Notification}</span>
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
