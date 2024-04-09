const setStatusSent = "Set_Status_Sent";
const setStatusReached = "Set_Status_Reached";
const setStatusPrinting = "Set_Status_Printing";
const setStatusDone = "Set_Status_Done";
const setError = "Set_Error";

export function statusSent(status) {
    return {
        type: setStatusSent,
        payload: status
    }
};
export function statusReached(status) {
    return {
        type: setStatusReached,
        payload: status
    }
};
export function statusPrinting(status) {
    return {
        type: setStatusPrinting,
        payload: status
    }
};
export function statusDone(status) {
    return {
        type: setStatusDone,
        payload: status
    }
};
export function statusError(error) {
    return {
        type: setError,
        payload: error
    }
};


function printReducer(
    state = {
        status: "",
        error: ""
    },
    action
) {
    switch (action.type) {
        case "Set_Status_Sent":
            return { ...state, status: action.payload }
        case "Set_Status_Reached":
            return { ...state, status: action.payload }
        case "Set_Status_Printing":
            return { ...state, status: action.payload }
        case "Set_Status_Done":
            return { ...state, status: action.payload }
        case "Set_Error":
            return { ...state, error: action.payload }
        default:
            return state
    };
};

export default printReducer;