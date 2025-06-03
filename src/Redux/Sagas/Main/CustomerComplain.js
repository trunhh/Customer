import { put, takeEvery, take, cancel, delay, call } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT_APP } from '../../../Services';
import { CustomerTypeAction } from "../../Actions/Main";
import { mainTypes } from "../../Actions";


export function* APIC_spCustomerComplain(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spCustomerComplain", params)
        // check call api success
        if (respone && respone.status == 200) {
            console.log(respone)
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.APIC_spCustomerComplain_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerComplainList(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        console.log(params)
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spCustomerComplainList", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            console.log(respone)
            // yield put({ type: TestTypeAction.APIC_spCustomerComplainList_SUCCESS, payload: JSON.parse(respone.data.data) });
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


export default function* watchCustomerComplain() {
    ///Watcher watch Sagas
    
    yield takeEvery(CustomerTypeAction.APIC_spCustomerComplain, APIC_spCustomerComplain)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerComplainList, APIC_spCustomerComplainList)
    
}