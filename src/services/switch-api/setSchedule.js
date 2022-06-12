import axios from 'axios';
let setSchedule = async (NameDevice, Key, EnableSchedule, TimeON_hours_s, TimeON_minutes_s, TimeON_hours_e, TimeON_minutes_e, TimeOFF_hours_s, TimeOFF_minutes_s, TimeOFF_hours_e, TimeOFF_minutes_e) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/setSchedule`, {
            Key: `${Key}`,
            NameDevice: `${NameDevice}`,
            EnableSchedule: `${EnableSchedule}`,
            TimeON_hours_s: `${TimeON_hours_s}`,
            TimeON_minutes_s: `${TimeON_minutes_s}`,
            TimeON_hours_e: `${TimeON_hours_e}`,
            TimeON_minutes_e: `${TimeON_minutes_e}`,
            TimeOFF_hours_s: `${TimeOFF_hours_s}`,
            TimeOFF_minutes_s: `${TimeOFF_minutes_s}`,
            TimeOFF_hours_e: `${TimeOFF_hours_e}`,
            TimeOFF_minutes_e: `${TimeOFF_minutes_e}`,
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

export default setSchedule;