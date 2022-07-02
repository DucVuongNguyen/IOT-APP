import React from "react";
import "./addDevice.scss";
import { updateUser } from "../../store/action/userAction";
import { isOpenBox } from "../../store/action/ControlAction";
import { connect } from "react-redux";
import addDevice from "../../services/addDevice";
import checkDevice from "../../services/checkDevice";
import toast, { Toaster } from "react-hot-toast";

class AddDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NameDevice: "",
      Key: "",
      Notification: "",
    };
    toast.remove();
  }

  handleOnChangeNameDevice = (event) => {
    console.log(event.target.value);
    this.setState({
      NameDevice: event.target.value,
      Notification: "",
    });
  };
  handleOnChangePassword = (event) => {
    console.log(event.target.value);
    this.setState({
      Key: event.target.value,
      Notification: "",
    });
  };

  handleCancel = (event) => {
    let payload = { ...this.props.ControlAction_Redux };
    payload.isOpenAddBox = 0;
    console.log(payload);
    this.props.isOpenBox(payload);
    this.setState({
      Notification: "",
    });
  };

  handleAddDevice = async (event) => {
    console.log(
      `this.props.User_Redux.user.UserName: ${this.props.User_Redux.user.UserName}`
    );
    console.log(
      `this.props.User_Redux.user.Password: ${this.props.User_Redux.user.Password}`
    );
    console.log(`this.state.NameDevice: ${this.state.NameDevice}`);
    console.log(`this.state.PasswordDevice: ${this.state.Key}`);
    toast.loading("Loading...");
    let response = await checkDevice(this.state.NameDevice, this.state.Key);

    let Type = response.Type;
    console.log(`Type: ${Type}`);
    if (!response.isError) {
      let response = await addDevice(
        this.props.User_Redux.user.UserName,
        this.props.User_Redux.user.Password,
        this.state.NameDevice,
        this.state.Key,
        Type
      );
      if (!response.isError) {
        let payload = { ...this.props.ControlAction_Redux };
        payload.isOpenAddBox = 0;
        console.log(payload);
        this.props.isOpenBox(payload);
        payload = { ...this.props.User_Redux };
        delete response.isError;
        payload.message = response.message;
        payload.user = response.user;
        this.props.updateUser(payload);
      } else {
        console.log(`response: ${response.message}`);
        this.setState({
          Notification: response.message,
        });
        toast.remove();
      }
    } else {
      console.log(`response: ${response.message}`);
      this.setState({
        Notification: response.message,
      });
      toast.remove();
    }

    this.setState({
      NameDevice: "",
      Key: "",
    });
    toast.remove();
  };

  render() {
    if (this.props.ControlAction_Redux.isOpenAddBox) {
      return (
        <React.Fragment>
          <div className="Background-AddBox">
            <div className="AddBox">
              <Toaster
                className="Toaster"
                position="top-center"
                reverseOrder={false}
              />
              <div className="Title">Thêm thiết bị mới</div>
              <div className="Content">
                <label className="Label">Tên thiết bị</label>
                <input
                  type="text"
                  className="Input"
                  placeholder="Nhập tên thiết bị"
                  value={this.state.NameDevice}
                  onChange={(event) => this.handleOnChangeNameDevice(event)}
                />
              </div>
              <div className="Content">
                <label className="Label">Key</label>
                <input
                  type="text"
                  className="Input"
                  placeholder="Nhập Key thiết bị"
                  value={this.state.Key}
                  onChange={(event) => this.handleOnChangePassword(event)}
                />
              </div>
              <Notification Notification={this.state.Notification} />
              <div className="Bnt-Control">
                <button
                  className="Bnt-"
                  onClick={() => {
                    this.handleAddDevice();
                  }}
                >
                  Thêm
                </button>
                <button
                  className="Bnt-"
                  onClick={() => {
                    this.handleCancel();
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }
}

const Notification = (props) => {
  //Kiểm tra giá trị của props
  return <span style={{ color: "#fd2d2d" }}>{props.Notification}</span>;
};

const mapStateToProps = (state) => {
  return {
    User_Redux: state.User,
    ControlAction_Redux: state.ControlAction,
  };
};

const mapDispatToProps = (dispatch) => {
  return {
    isOpenBox: (payload) => dispatch(isOpenBox(payload)),
    updateUser: (payload) => dispatch(updateUser(payload)),
  };
};

export default connect(mapStateToProps, mapDispatToProps)(AddDevice);
