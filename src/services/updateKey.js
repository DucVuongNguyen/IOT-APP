import axios from 'axios';
let updateKey = async (UserName, Password, NameDevice, Key) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/updateKey`, {
            UserName: `${UserName}`,
            Password: `${Password}`,
            NameDevice: `${NameDevice}`,
            Key: `${Key}`,
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

export default updateKey;