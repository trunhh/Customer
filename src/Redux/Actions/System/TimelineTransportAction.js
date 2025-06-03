import {TimelineTransportTypeAction} from '.';

export function CTM_spTimelineTransport(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: TimelineTransportTypeAction.CTM_spTimelineTransport,
            params,
            resolve,
            reject
        })
    })
}
