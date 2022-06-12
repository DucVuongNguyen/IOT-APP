import axios from 'axios';
let handleAddDevice = async (UserName, Password, NameDevice, Key, Type) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/addDevice`, {
            UserName: `${UserName}`,
            Password: `${Password}`,
            NameDevice: `${NameDevice}`,
            Key: `${Key}`,
            Type: `${Type}`
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