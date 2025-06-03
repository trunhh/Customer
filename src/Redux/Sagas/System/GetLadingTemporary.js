import { put, takeEvery, take, cancel, delay, call } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT_APP } from '../../../Services';
import { LadingTemporaryTypeAction } from "../../Actions/System";
import { mainTypes } from "../../Actions";

export function* CTM_spGetLadingTemporary(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/CTM_spGetLadingTemporary", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
            //yield put({ type: LadingTemporaryTypeAction.CTM_spGetLadingTemporary, payload: JSON.parse(respone.data.data) });
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

export function* CTM_spGetLadingDetailTemporary(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/CTM_spGetLadingDetailTemporary", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
            //yield put({ type: LadingTemporaryTypeAction.CTM_spGetLadingDetailTemporary, payload: JSON.parse(respone.data.data) });
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

export default function* watchGetLadingTemporary() {
    ///Watcher watch Sagas
    yield takeEvery(LadingTemporaryTypeAction.CTM_spGetLadingTemporary, CTM_spGetLadingTemporary)
    yield takeEvery(LadingTemporaryTypeAction.CTM_spGetLadingDetailTemporary, CTM_spGetLadingDetailTemporary)
}