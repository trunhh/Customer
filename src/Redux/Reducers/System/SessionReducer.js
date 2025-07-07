import { SET_SESSION_KEY, SET_CAPTCHA_TOKEN } from "../../Actions/System/SessionAction";

const  innitialState = {
    sessionState: {
        sessionKey: null,
        sessionKeyExpireAt: null,
    },
    captchaState: {
        captchaToken: null,
    }

}

const SessionReducer = (state = innitialState, action) => {
    switch (action.type) {
        case SET_SESSION_KEY:
            return {
                ...state,
                sessionState: {
                    ...state.sessionState,
                    sessionKey: action.sessionKey,
                    sessionKeyExpireAt: action.sessionKeyExpireAt
                }
            };
        case SET_CAPTCHA_TOKEN: 
        return {
            ...state,
            captchaState: {
                ...state.captchaState,
                captchaToken: action.captchaToken
            }
        };
        default: 
            return state;
    };
}

export default SessionReducer;