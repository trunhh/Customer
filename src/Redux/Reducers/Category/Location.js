import { LocationType } from '../../Actions/Category'
const initialState = {
    profile: null,
    listCity: [],
    cityID: 0,
    districtID: 0,
    wardID:0,
    listDistrict: [],
    listData: [],
    listCityEror:''
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        
        case LocationType.GET_CITY_SUCCESS:
            return {
                ...state,
                listCity: action.payload
            }
        case LocationType.GET_DISTRICT_FROM_CITY_SUCCESS:
            return {
                ...state,
                listDistrict: action.payload
        }
        case LocationType.UPDATE_CITY_ID_SUCCESS:
            return {
                ...state,
                cityID: action.payload
            }
        case LocationType.UPDATE_DISTRICT_ID_SUCCESS:
            return {
                ...state,
                districtID: action.payload
            }
        case LocationType.UPDATE_WARD_ID_SUCCESS:
            return {
                ...state,
                wardID: action.payload
            }
        case LocationType.GET_LOCATION_SUCCESS:
            return {
                ...state,
                listData: action.payload
            }
        default:
            return state;
    }
}
