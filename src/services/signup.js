import axios from 'axios';
let signup = async (UserName, Password) => {
    let data;
    try {
        await axios.post(`https://iot-server-demo.herokuapp.com/api/Signup`, {
            UserName: `${UserName}`,
            Password: `${Password}`,
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

export default signup;