export const isOpenAddBox = (payload) => {
    return {
        type: 'OPEN_ADD_DEVICE_BOX',
        payload: payload
    }
}

export const isOpenAdvanceBox = (payload) => {
    return {
        type: 'OPEN_ADVANCE_BOX',
        payload: payload
    }
}
