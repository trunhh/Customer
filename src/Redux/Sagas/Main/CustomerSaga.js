import { put, takeEvery, delay, } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT, } from '../../../Services';
import { CustomerTypeAction } from "../../Actions/Main";
import { mainTypes } from "../../Actions";

export function* APIC_spCustomerCheckLogin(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerCheckLogin", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
            action.resolve(respone.data)
            /// close loading
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
        else {
        // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
            //yield put({ type: mainTypes.LOADING, payload: false });
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

export function* APIC_spCustomerCheckPhone(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerCheckPhone", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerCheckEmail(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerCheckEmail", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerUpdateInfo(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerUpdateInfo", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerGetById(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerGetById", params)
        // check call api success
        if (respone && respone.status === 200) {
            console.log("nhi",respone.data);
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerGetByGroup(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerGetByGroup", params)
        // check call api success
        if (respone && respone.status === 200) {
            console.log("nhi",respone.data);
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerRegister(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT+ "/APIC_spCustomerRegister", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_CustomerSendEmailForgot(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_CustomerSendEmailForgot", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_CustomerCheckResetPass(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_CustomerCheckResetPass", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerResetPass(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerResetPass", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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

export function* APIC_spCustomerChangeAvatar(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerChangeAvatar", params)
        // check call api success
        if (respone && respone.status === 200) {
            
            //Save data from api to store of redux
           // yield put({ type: TestTypeAction.MB_spOfficer_Save_SUCCESS, payload: JSON.parse(respone.data.data) });
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
export function* APIC_spCustomerRecipientLoad(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerRecipientLoad", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
          
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
export function* APIC_spCustomerRecipientRemove(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerRecipientRemove", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
          
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
export function* APIC_spCustomerRecipientSave(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerRecipientSave", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
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
export function* APIC_SendSMSOTP(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_SendSMSOTP", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
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
export function* APIC_spCustomerVerification(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_spCustomerVerification", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
            
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
export function* APIC_GetEncoding(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT + "/APIC_GetEncoding", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status == 200) {
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
export default function* watchCustomerSagas() {
    ///Watcher watch Sagas
    
    yield takeEvery(CustomerTypeAction.APIC_spCustomerCheckLogin, APIC_spCustomerCheckLogin)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerCheckPhone, APIC_spCustomerCheckPhone)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerCheckEmail, APIC_spCustomerCheckEmail)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerUpdateInfo, APIC_spCustomerUpdateInfo)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerGetById, APIC_spCustomerGetById)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerGetByGroup, APIC_spCustomerGetByGroup)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerRegister, APIC_spCustomerRegister)
    yield takeEvery(CustomerTypeAction.APIC_CustomerSendEmailForgot, APIC_CustomerSendEmailForgot)
    yield takeEvery(CustomerTypeAction.APIC_CustomerCheckResetPass, APIC_CustomerCheckResetPass)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerResetPass, APIC_spCustomerResetPass)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerChangeAvatar, APIC_spCustomerChangeAvatar)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerRecipientLoad, APIC_spCustomerRecipientLoad)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerRecipientRemove, APIC_spCustomerRecipientRemove)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerRecipientSave, APIC_spCustomerRecipientSave)
    yield takeEvery(CustomerTypeAction.APIC_SendSMSOTP, APIC_SendSMSOTP)
    yield takeEvery(CustomerTypeAction.APIC_spCustomerVerification, APIC_spCustomerVerification)
    yield takeEvery(CustomerTypeAction.APIC_GetEncoding, APIC_GetEncoding)
}