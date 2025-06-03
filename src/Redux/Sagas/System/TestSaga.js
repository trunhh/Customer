import { put, takeEvery, take, cancel, delay, call } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT } from '../../../Services';
import { TestTypeAction } from "../../Actions/System";
import { mainTypes } from "../../Actions";

export function* MB_spOfficer_Save(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/MB_spOfficer_Save", params)
        // check call api success
        if (respone && respone.status == 200) {
            
            //Save data from api to store of redux
            //yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
            action.resolve(respone.data)
            /// close loading
           // yield put({ type: mainTypes.LOADING, payload: false });
        }
        else {
        // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
           // yield put({ type: mainTypes.LOADING, payload: false });
            //yield delay(300)
            //yield put({ type: mainTypes.ERROR, payload: true });
        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
        //yield delay(300)
        //yield put({ type: mainTypes.ERROR, payload: true });
    }
}

export function* MB_spOfficer_Get(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/MB_spOfficer_Get", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
            //yield put({ type: TestTypeAction.MB_spOfficer_Get_SUCCESS, payload: JSON.parse(respone.data.data) });
            action.resolve(respone.data)
            
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





export default function* watchTestSagas() {
    ///Watcher watch Sagas
    
    yield takeEvery(TestTypeAction.MB_spOfficer_Save, MB_spOfficer_Save)
    yield takeEvery(TestTypeAction.MB_spOfficer_Get, MB_spOfficer_Get)
    
    
}