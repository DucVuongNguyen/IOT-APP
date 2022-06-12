import axios from 'axios';
let changeKey = async (NameDevice, OldKey, NewKey) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/changeKey`, {
            OldKey: `${OldKey}`,
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

export default changeKey;