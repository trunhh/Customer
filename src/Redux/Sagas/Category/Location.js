import { put, takeEvery, take, cancel, delay } from 'redux-saga/effects';
import { api, API_END_POINT_APP } from '../../../Services';
import { LocationType } from "../../Actions/Category";
import { authTypes, mainTypes } from "../../Actions";

export function* GET_LOCATION(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        const params = action && action.params
        params.API_key = APIKey;
        params.TokenDevices = TOKEN_DEVICE;
        params.func="CPN_spLocation_GET";
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/API_spCallServer", params)
        // check call api success
        if (respone && respone.status == 200) {
            ///callback to screen
            action.resolve(respone.data)
            /// close loading
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}
export default function* watchLocationSagas() {
    yield takeEvery(LocationType.GET_LOCATION, GET_LOCATION)
}