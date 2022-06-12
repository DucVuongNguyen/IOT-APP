import axios from 'axios';
let handlecheckDevice = async (NameDevice,Key) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/checkDevice`, {
            NameDevice: `${NameDevice}`,
            Key: `${Key}`
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

export default handlecheckDevice;