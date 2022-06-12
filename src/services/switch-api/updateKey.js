import axios from 'axios';
let updateKey = async (NameDevice, NewKey) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/updateKey`, {
            NameDevice: `${NameDevice}`,
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

export default updateKey;