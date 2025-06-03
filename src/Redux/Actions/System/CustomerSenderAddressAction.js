import {CustomerSenderAddressTypeAction} from '.';

export function APIC_spCustomerSenderAddress_Save(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: CustomerSenderAddressTypeAction.APIC_spCustomerSenderAddress_Save,
            params,
            resolve,
            reject
        })
    })
}

export function APIC_spCustomerSenderAddressList(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: CustomerSenderAddressTypeAction.APIC_spCustomerSenderAddressList,
            params,
            resolve,
            reject
        })
    })
}

export function API_spCustomerSenderAddressList_Detail(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: CustomerSenderAddressTypeAction.API_spCustomerSenderAddressList_Detail,
            params,
            resolve,
            reject
        })
    })
}