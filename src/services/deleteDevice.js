import axios from 'axios';
let handleAddDevice = async (UserName, Password, NameDevice) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/deleteDevice`, {
            UserName: `${UserName}`,
            Password: `${Password}`,
            NameDevice: `${NameDevice}`,
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

export default handleAddDevice;