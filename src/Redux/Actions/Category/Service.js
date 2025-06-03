import { ServiceType } from '.';

export function APIC_spServiceGetMany(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ServiceType.APIC_spServiceGetMany,
            params,
            resolve,
            reject
        })
    })
}