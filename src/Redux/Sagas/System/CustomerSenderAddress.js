import { put, takeLatest, take, cancel, delay, call } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT_APP } from '../../../Services';
import { CustomerSenderAddressTypeAction } from "../../Actions/System";
import { mainTypes } from "../../Actions";

export function* APIC_spCustomerSenderAddress_Save(action) {
    try {
        debugger
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spCustomerSenderAddress_Save", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data.data.localMessage)
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

export function* APIC_spCustomerSenderAddressList(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spCustomerSenderAddressList", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
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

export function* API_spCustomerSenderAddressList_Detail(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/API_spCustomerSenderAddressList_Detail", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
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

export default function* watchCustomerSenderAddress() {
    ///Watcher watch Sagas
    yield takeLatest(CustomerSenderAddressTypeAction.APIC_spCustomerSenderAddress_Save, APIC_spCustomerSenderAddress_Save)
    yield takeLatest(CustomerSenderAddressTypeAction.APIC_spCustomerSenderAddressList, APIC_spCustomerSenderAddressList)
    yield takeLatest(CustomerSenderAddressTypeAction.API_spCustomerSenderAddressList_Detail, API_spCustomerSenderAddressList_Detail)
}