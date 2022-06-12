import axios from 'axios';
let readData = async (NameDevice, Key) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/readData`, {
            Key: `${Key}`,
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

export default readData;