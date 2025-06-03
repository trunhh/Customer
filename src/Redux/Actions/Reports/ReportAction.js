import { ReportTypeAction } from '.'

//main report
export function APIC_spLadingReportDelivery(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spLadingReportDelivery,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spKpiDeliveryCODReport(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spKpiDeliveryCODReport,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spOutstandingDebtReport(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spOutstandingDebtReport,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spPaymentDealine_Report(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spPaymentDealine_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Inventory_Report_Detail(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Inventory_Report_Detail,
            params,
            resolve,
            reject
        })
    })
}

//warehouse report
export function APIC_spCustomer_GetidFromWeb(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spCustomer_GetidFromWeb,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_List(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_List,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Area_list(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Area_list,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Import_Report(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Import_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Import_Report_Detail(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Import_Report_Detail,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Import_Report_Print(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Print_Import_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWarehouse_Import_DeleteById(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWarehouse_Import_DeleteById,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Output_Report(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Output_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Output_Report_Detail(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Output_Report_Detail,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Output_Report_Print(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Print_Output_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWarehouse_Output_DeletebyId(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWarehouse_Output_DeletebyId,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Tranport_Report(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Tranport_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Tranport_Report_Detail(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Tranport_Report_Detail,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Transport_Report_Print(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Print_Transport_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spWareHouse_Inventory_Report(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spWareHouse_Inventory_Report,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spCustomerPaymentDealine_Report(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spCustomerPaymentDealine_Report,
            params,
            resolve,
            reject
        })
    })
}

export function APIC_spPaymentReport(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: ReportTypeAction.APIC_spPaymentReport,
            params,
            resolve,
            reject
        })
    })
}