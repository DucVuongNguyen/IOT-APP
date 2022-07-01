import axios from 'axios';
let getTimeline = async (NameDevice, Key, Date, Month, Year) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/TemperatureHumiditySensor/getTimeline`, {
            NameDevice: `${NameDevice}`,
            Key: `${Key}`,
            Date: `${Date}`,
            Month: `${Month}`,
            Year: `${Year}`,
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

export default getTimeline;