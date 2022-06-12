import React, { Component } from 'react';
import './login.scss';
import checkUserService from '../../services/checkUserService';
import { } from "@fortawesome/react-fontawesome";
import { } from '@fortawesome/free-solid-svg-icons';
import { } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import { connect } from 'react-redux';
import { loginUser } from '../../store/action/userAction'




class Login extends Component {
    // hàm tạo: chạy trước khi render
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            Notification: ''
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
        let response = await checkUserService(this.state.username, this.state.password);
        console.log('response.checkLogin: ' + response.checkLogin)
        this.props.User(response)
        this.setState({
            Notification: response.message
        })
    }



    render() {

        return (
            <React.Fragment>
                <section className='Login-Background'>
                    <div className='LoginBox'>
                        <div className='Title'>Login</div>
                        <div className='Content'>
                            <label className='Label'>Username</label>
                            <input type="text"
                                className='Input'
                                placeholder='Enter your usersname'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)} />
                        </div>
                        <div className='Content'>
                            <label className='Label'>Password</label>
                            <input type="text"
                                className='Input'
                                placeholder='Enter your password'
                                value={this.state.password}
                                onChange={(event) => this.handleOnChangePassword(event)} />
                        </div>
                        <Notification checkLogin={this.props.User_Redux.checkLogin} Notification={this.state.Notification} />
                        <button className='Bnt-login'
                            onClick={() => { this.handleLogin() }}>Login</button>
                    </div>

                </section>

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
