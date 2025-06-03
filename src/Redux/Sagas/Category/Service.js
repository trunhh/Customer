import { put, takeEvery, take, cancel, delay } from 'redux-saga/effects';
import { api, APIKeyOld, API_END_POINT,API_END_POINT_APP, APIKey, TOKEN_DEVICE } from '../../../Services';
import { ServiceType } from "../../Actions/Category";
import { authTypes, mainTypes } from "../../Actions";

export function* APIC_spServiceGetMany(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        //params received
        const params = action && action.params
        params.API_key = APIKey;
        params.TokenDevices = TOKEN_DEVICE;
        params.func="APIC_spService_List";
        params.json= JSON.stringify({"Type":1});
        /// catch api die
        yield delay(300);
        // call api
        
        let respone = yield api.post(API_END_POINT_APP + "/API_spCallServer", params)
        console.log("sdsfd",respone)
        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
            //Save data from api to store of redux
            yield put({ type: ServiceType.APIC_spServiceGetMany_SUCCESS, payload: JSON.parse(respone.data) });
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
export default function* watchServiceSagas() {
    ///Watcher watch Sagas
    yield takeEvery(ServiceType.APIC_spServiceGetMany, APIC_spServiceGetMany)

}