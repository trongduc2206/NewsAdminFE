const initialState = {
    data: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE':
            // console.log()
            return {
                ...state,
                data: action.data
            }
        default: return state;
    }
}