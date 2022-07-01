import axios from 'axios';
let changeKey = async (UserName, Password,NameDevice, Key, NewKey) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/changeKey`, {
            UserName: `${UserName}`,
            Password: `${Password}`,
            NameDevice: `${NameDevice}`,
            Key: `${Key}`,
            NewKey: `${NewKey}`,
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

export default changeKey;