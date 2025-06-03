import { LadingType } from '.'
 
export function APIC_spLadingCreate(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingCreate,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingGetPrice(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingGetPrice,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingGetMany(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingGetMany,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingRemove(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingRemove,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingGetDataPrint(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingGetDataPrint,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingGetById(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingGetById,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingGetPriceMany(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingGetPriceMany,
            params,
            resolve,
            reject
        })
    })
}

export function APIC_spLadingPrintFromExcelAvery(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingPrintFromExcelAvery,
            params,
            resolve,
            reject
        })
    })
}

export function APIC_LadingUploadExcel(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_LadingUploadExcel,
            params,
            resolve,
            reject
        })
    })
}

export function APIC_spLadingSaveExcel(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingSaveExcel,
            params,
            resolve,
            reject
        })
    })
}

export function APIC_LadingPrintBillExcel(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_LadingPrintBillExcel,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingUpdate(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingUpdate,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_spLadingGet(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LadingType.APIC_spLadingGet,
            params,
            resolve,
            reject
        })
    })
}