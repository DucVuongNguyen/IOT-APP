const initialState = {
    isOpenAddBox: 0,
    isOpenRenameBox: 0,
    isOpenChangeKeyBox: 0,
    isOpenUpdateKeyBox: 0,
    AdvanceBox: {
        isOpen: 0,
    },
}
const ControlAction = (state = initialState, action) => {
    console.log(`>>> old state DeviceReducer redux --- `, state);
    switch (action.type) {
        case 'OPEN_BOX': {
            let vars = action.payload;
            state = vars
            console.log(`>>> new state DeviceReducer redux --- `, state);
            return state;

        }
        default:
            return state

    }
}


export default ControlAction