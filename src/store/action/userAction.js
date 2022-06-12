export const loginUser = (payload) => {
    return {
        type: 'LOGIN',
        payload: payload
    }
}

export const updateUser = (payload) => {
    return {
        type: 'UPDATE_USER',
        payload: payload
    }
}
