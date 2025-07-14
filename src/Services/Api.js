import Axios from "axios";

export const API_DOMAIN = process.env.REACT_APP_API_DOMAIN; // Test

export const GOOGLE_LOGIN_CLIENTID =
  "418580183625-h3psg5ke3ri923qg5kuos64jmr0j2fuj.apps.googleusercontent.com";
export const FACEBOOK_LOGIN_APPID = "836612320191788";

export const APIKey = "CAKApikey2025";
export const TOKEN_DEVICE = "website";
export const API_END_POINT = API_DOMAIN + '/api/Main';

export const GOOGLE_MAP_API_KEY = "AIzaSyAl8WZfFte7tdA-GgRC281-c8ufJdEGtd4"; //'AIzaSyBdzbUGthJC0EQAmUsAXgh4J0OUN9uVh4g' //
export const GOOGLE_MAP_ZOOM = 5;
export const GOOGLE_MAP_CENTER = { lat: 14.775869, lng: 106.688661 };

export const CaptchaKey = process.env.REACT_APP_CAPTCHA_KEY;

export const api = Axios.create({
  baseURL: API_END_POINT,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": window.location.host,
  },
  withCredentials: true,
});


export const setCaptchaToken = (token) => {
  api.defaults.headers['X-Captcha-Token'] = token;
}

export const authApi = Axios.create({
  baseURL: API_END_POINT,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": window.location.host,
  },
  withCredentials: true,
});

// authApi.interceptors.request.use(async (config) => {
//   console.log("🔥 API INTERCEPTOR TRIGGERED", config.url);
//   const method = config.method?.toUpperCase() || "GET";
//   const timestamp = new Date().toISOString();
//   const url = config.url;
//   const body = config.data ? JSON.stringify(config.data) : "";

//   // const sessionKey = await getSessionKey();
//   const sessionKey = localStorage.getItem('token');
//   const signdata = `${method}${url}${timestamp}${body}`;
//   console.log(signdata);

//   const encoder = new TextEncoder();
  
//   const key = await crypto.subtle.importKey('raw', encoder.encode(sessionKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
//   const sign = await crypto.subtle.sign('HMAC', key, encoder.encode(signdata));
//   const signature = btoa(String.fromCharCode(...new Uint8Array(sign)));

//   config.headers["X-Timestamp"] = timestamp;
//   config.headers["X-Signature"] = signature;

//   return config;
// });