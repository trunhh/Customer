//Action type
export const SET_SESSION_KEY = "SETSESSIONKEY";
export const SET_CAPTCHA_TOKEN = "SETCAPTCHATOKEN";


//Action creators
export const setSessionKey = (sessionKey, sessionKeyExpireAt) => ({
    type: SET_SESSION_KEY,
    sessionKey,
    sessionKeyExpireAt,
});

export const setCaptchaToken = (captchaToken) => ({
    type: SET_CAPTCHA_TOKEN,
    captchaToken,
})