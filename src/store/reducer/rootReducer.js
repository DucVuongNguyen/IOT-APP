import { combineReducers } from "redux"
import UserReducer from "./UserReducer"
import ControlActionReducer from "./ControlActionReducer"

const rootReducer = combineReducers({
    User: UserReducer,
    ControlAction: ControlActionReducer,

}

)



export default rootReducer