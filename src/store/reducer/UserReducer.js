const initialState = {
    checkLogin: 0
}
const userReducer = (state = initialState, action) => {
    console.log(`>>> old state userReducer redux --- `, state);
    switch (action.type) {
        case 'LOGIN': {
            state = action.payload;
            console.log(`>>> new state userReducer redux ---  --- `, state);
            return state;

        }

        case 'UPDATE_USER': {
            state = action.payload;
            console.log(`>>> new state userReducer redux ---  --- `, state);
            return state;

        }
        default:
            return state

    }
}


export default userReducer