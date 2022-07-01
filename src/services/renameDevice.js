import axios from 'axios';
let renameDevice = async (UserName, Password, NameDevice, RenameDevice) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/renameDevice`, {
            UserName: `${UserName}`,
            Password: `${Password}`,
            NameDevice: `${NameDevice}`,
            RenameDevice: `${RenameDevice}`
        })
            .then(res => {
                // console.log('checkUser');
                // console.log(res.data);
                data = res.data

            })
    } catch (e) {
        console.log(e)
    }
    return data



}

export default renameDevice;