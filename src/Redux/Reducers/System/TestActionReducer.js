import {TestTypeAction} from '../../Actions/System'

/* save data from api */
const initialState = {
    ListOfficer: [],
    KQOfficer:''
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case TestTypeAction.MB_spOfficer_Save_SUCCESS:
            return {
                ...state,
                KQOfficer: action.payload
            }
        case TestTypeAction.MB_spOfficer_Get_SUCCESS:
            return {
                ...state,
                ListOfficer: action.payload
            }
        case TestTypeAction.APIC_spCustomerOrderCreate_SUCCESS:
            return {
                ...state,
                KQOfficer: action.payload
            }
        case TestTypeAction.APIC_spCustomerComplainList_SUCCESS:
            return {
                ...state,
                KQOfficer: action.payload
            }
        default:
            return state;
    }
}
