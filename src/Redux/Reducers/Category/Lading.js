import { LadingType } from "../../Actions/Category";

const initialState = {
    listLading: []
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        
        case LadingType.APIC_spLadingGetMany_SUCCESS:
            return {
                ...state,
                listLading: action.payload
            }
        default:
            return state;
    }
}
