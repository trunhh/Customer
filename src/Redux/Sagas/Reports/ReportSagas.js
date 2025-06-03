import { put, take, cancel, delay,takeEvery } from 'redux-saga/effects';
import { api, API_END_POINT_APP } from '../../../Services';
import { ReportTypeAction } from "../../Actions/Reports";
import { authTypes, mainTypes } from "../../Actions"; 

//main report
export function* APIC_spLadingReportDelivery(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spLadingReportDelivery", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spKpiDeliveryCODReport(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spKpiDeliveryCODReport", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spOutstandingDebtReport(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spOutstandingDebtReport", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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

//warehouse report
export function* APIC_spCustomer_GetidFromWeb(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spCustomer_GetidFromWeb", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_List(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_List", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
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
export function* APIC_spWareHouse_Area_list(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Area_list", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Import_Report(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Import_Report", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Import_Report_Detail(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Import_Report_Detail", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Import_Report_Print(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Import_Report_Print", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWarehouse_Import_DeleteById(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWarehouse_Import_DeleteById", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Output_Report(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Output_Report", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Output_Report_Detail(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Output_Report_Detail", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Output_Report_Print(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Output_Report_Print", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWarehouse_Output_DeletebyId(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWarehouse_Output_DeletebyId", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Tranport_Report(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Tranport_Report", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Tranport_Report_Detail(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Tranport_Report_Detail", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Transport_Report_Print(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Transport_Report_Print", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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
export function* APIC_spWareHouse_Inventory_Report(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spWareHouse_Inventory_Report", params)
        console.log('call sagas api',respone)
        // check call api success
        if (respone && respone.status === 200) {
            
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

export function* APIC_spCustomerPaymentDealine_Report(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spCustomerPaymentDealine_Report", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data)
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

export function* APIC_spPaymentReport(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        
        let respone = yield api.post(API_END_POINT_APP + "/APIC_spPaymentReport", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data)
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

export default function* watchReportSagas() {
    yield takeEvery(ReportTypeAction.APIC_spLadingReportDelivery, APIC_spLadingReportDelivery)
    yield takeEvery(ReportTypeAction.APIC_spKpiDeliveryCODReport, APIC_spKpiDeliveryCODReport)
    yield takeEvery(ReportTypeAction.APIC_spOutstandingDebtReport, APIC_spOutstandingDebtReport)

    //warehouse report
    yield takeEvery(ReportTypeAction.APIC_spCustomer_GetidFromWeb, APIC_spCustomer_GetidFromWeb)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_List, APIC_spWareHouse_List)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Area_list, APIC_spWareHouse_Area_list)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Import_Report, APIC_spWareHouse_Import_Report)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Import_Report_Detail, APIC_spWareHouse_Import_Report_Detail)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Import_Report_Print, APIC_spWareHouse_Import_Report_Print)
    yield takeEvery(ReportTypeAction.APIC_spWarehouse_Import_DeleteById, APIC_spWarehouse_Import_DeleteById)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Output_Report, APIC_spWareHouse_Output_Report)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Output_Report_Detail, APIC_spWareHouse_Output_Report_Detail)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Output_Report_Print, APIC_spWareHouse_Output_Report_Print)
    yield takeEvery(ReportTypeAction.APIC_spWarehouse_Output_DeletebyId, APIC_spWarehouse_Output_DeletebyId)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Tranport_Report, APIC_spWareHouse_Tranport_Report)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Tranport_Report_Detail, APIC_spWareHouse_Tranport_Report_Detail)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Transport_Report_Print, APIC_spWareHouse_Transport_Report_Print)
    yield takeEvery(ReportTypeAction.APIC_spWareHouse_Inventory_Report, APIC_spWareHouse_Inventory_Report)

    //customer report
    yield takeEvery(ReportTypeAction.APIC_spCustomerPaymentDealine_Report, APIC_spCustomerPaymentDealine_Report)
    yield takeEvery(ReportTypeAction.APIC_spPaymentReport, APIC_spPaymentReport)
}