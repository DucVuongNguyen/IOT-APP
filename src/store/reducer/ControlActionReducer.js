const initialState = {
    isOpenAddBox: 0,
    // isOpenAdvanceBox : 0,
    AdvanceBox: {
        isOpen: 0,
    },
}
const ControlAction = (state = initialState, action) => {
    console.log(`>>> old state DeviceReducer redux --- `, state);
    switch (action.type) {
        case 'OPEN_ADD_DEVICE_BOX': {
            let vars = { ...state }
            vars.isOpenAddBox = action.payload;
            state = vars
            console.log(`>>> new state DeviceReducer redux --- `, state);
            return state;

        }
        case 'OPEN_ADVANCE_BOX': {
            let vars = { ...state }
            vars.AdvanceBox = action.payload;
            state = vars
            console.log(`>>> new state DeviceReducer redux --- `, state);
            return state;

        }

        default:
            return state

    }
}


export default ControlAction