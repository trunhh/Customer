import {TestTypeAction} from '.';

export function MB_spOfficer_Save(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: TestTypeAction.MB_spOfficer_Save,
            params,
            resolve,
            reject
        })
    })
}

export function MB_spOfficer_Get(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: TestTypeAction.MB_spOfficer_Get,
            params,
            resolve,
            reject
        })
    })
}

