import { put, takeEvery, take, cancel, delay, call } from 'redux-saga/effects';
import { api, API_END_POINT_APP, API_END_POINT } from '../../../Services';
import { TimelineTransportTypeAction } from "../../Actions/System";
import { mainTypes } from "../../Actions";

export function* CTM_spTimelineTransport(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/CTM_spTimelineTransport", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
            //yield put({ type: TimelineTransportTypeAction.CTM_spTimelineTransport, payload: JSON.parse(respone.data.data) });
            action.resolve(JSON.parse(respone.data.data))
            
        }
        else {
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
        
    }
}

export default function* watchTimelineTransport() {
    ///Watcher watch Sagas
    yield takeEvery(TimelineTransportTypeAction.CTM_spTimelineTransport, CTM_spTimelineTransport)
}