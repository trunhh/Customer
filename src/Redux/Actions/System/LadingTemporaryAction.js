import {LadingTemporaryTypeAction} from '.';

export function CTM_spGetLadingTemporary(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingTemporaryTypeAction.CTM_spGetLadingTemporary,
            params,
            resolve,
            reject
        })
    })
}

export function CTM_spGetLadingDetailTemporary(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingTemporaryTypeAction.CTM_spGetLadingDetailTemporary,
            params,
            resolve,
            reject
        })
    })
}