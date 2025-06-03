
import { LocationType } from '.'

export function GetCity(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.GET_CITY,
            params,
            resolve,
            reject
        })
    })
}

export function GetDistrictFromCity(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.GET_DISTRICT_FROM_CITY,
            params,
            resolve,
            reject
        })
    })
}

export function updateCityID(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.UPDATE_CITY_ID,
            params,
            resolve,
            reject
        })
    })
}

export function updateDistrictID(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.UPDATE_DISTRICT_ID,
            params,
            resolve,
            reject
        })
    })
}

export function updateWardID(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.UPDATE_WARD_ID,
            params,
            resolve,
            reject
        })
    })
}

export function GET_LOCATION(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.GET_LOCATION,
            params,
            resolve,
            reject
        })
    })
}
export function APIC_GetWardByDistrict(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: LocationType.APIC_GetWardByDistrict,
            params,
            resolve,
            reject
        })
    })
}