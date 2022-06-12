import axios from 'axios';
let handleLogin = async (username, password) => {
    let data;
    try {
    await axios.post(`https://iot-server-demo.herokuapp.com/api/checkUser`, {
            UserName: `${username}`,
            Password: `${password}`
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

export default handleLogin;