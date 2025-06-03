import { ServiceType } from '../../Actions/Category'
const initialState = {
    listService: []
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        
        case ServiceType.APIC_spServiceGetMany_SUCCESS:
            return {
                ...state,
                listService: action.payload
            }
        default:
            return state;
    }
}
