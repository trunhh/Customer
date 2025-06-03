import { put, takeEvery, take, cancel, delay } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT,API_END_POINT_APP } from '../../../Services';
import { LadingType } from "../../Actions/Category";
import { authTypes, mainTypes } from "../../Actions";

export function* APIC_spLadingCreate(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingCreate", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
            action.resolve(JSON.parse(respone.data.data))
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
            
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
export function* APIC_spLadingGetPrice(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingGetPrice", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
            action.resolve(JSON.parse(respone.data.data),"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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
export function* APIC_spLadingGetMany(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingGetMany", params)
        // check call api success
        if (respone && respone.status == 200) {
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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
export function* APIC_spLadingRemove(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingRemove", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data.data)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
            
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
export function* APIC_spLadingGetDataPrint(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingGetDataPrint", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data.data)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
            
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

export function* APIC_spLadingGetById(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingGetById", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data.data)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
            
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
export function* APIC_spLadingGetPriceMany(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingGetPriceMany", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(JSON.parse(respone.data.data),"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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
export function* APIC_spLadingPrintFromExcelAvery(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingPrintFromExcelAvery", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(JSON.parse(respone.data.data),"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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
export function* APIC_LadingUploadExcel(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_LadingUploadExcel", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data,"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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
export function* APIC_spLadingSaveExcel(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingSaveExcel", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data,"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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

export function* APIC_LadingPrintBillExcel(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_LadingPrintBillExcel", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data,"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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

export function* APIC_spLadingUpdate(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingUpdate", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data,"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
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
export function* APIC_spLadingGet(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingGet", params)
        console.log('APIC_spLadingGet',respone)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data,"false 200")
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
        else {
            action.reject(respone.data)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
        
    }
}

export default function* watchLadingSagas() {
    ///Watcher watch Sagas
    yield takeEvery(LadingType.APIC_spLadingCreate, APIC_spLadingCreate)
    yield takeEvery(LadingType.APIC_spLadingGetPrice, APIC_spLadingGetPrice)
    yield takeEvery(LadingType.APIC_spLadingGetMany, APIC_spLadingGetMany)
    yield takeEvery(LadingType.APIC_spLadingRemove, APIC_spLadingRemove)
    yield takeEvery(LadingType.APIC_spLadingGetDataPrint, APIC_spLadingGetDataPrint)
    yield takeEvery(LadingType.APIC_spLadingGetById, APIC_spLadingGetById)
    yield takeEvery(LadingType.APIC_spLadingGetPriceMany, APIC_spLadingGetPriceMany)
    yield takeEvery(LadingType.APIC_spLadingPrintFromExcelAvery, APIC_spLadingPrintFromExcelAvery)
    yield takeEvery(LadingType.APIC_LadingUploadExcel, APIC_LadingUploadExcel)
    yield takeEvery(LadingType.APIC_spLadingSaveExcel, APIC_spLadingSaveExcel)
    yield takeEvery(LadingType.APIC_LadingPrintBillExcel, APIC_LadingPrintBillExcel)
    yield takeEvery(LadingType.APIC_spLadingUpdate, APIC_spLadingUpdate)
    yield takeEvery(LadingType.APIC_spLadingGet, APIC_spLadingGet)
}