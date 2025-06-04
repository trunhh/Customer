import Axios from "axios";

// const API_DOMAIN = "https://api.gtelpost.vn";
const API_DOMAIN = "http://localhost:62648";

const VERSION_END_POINT = "/api/ApiMain";

export const GOOGLE_LOGIN_CLIENTID =
  "418580183625-h3psg5ke3ri923qg5kuos64jmr0j2fuj.apps.googleusercontent.com";
export const FACEBOOK_LOGIN_APPID = "836612320191788";

export const APIKey = "CAKApikey2025";
export const TOKEN_DEVICE = "website";
export const API_END_POINT = API_DOMAIN + VERSION_END_POINT;

export const GOOGLE_MAP_API_KEY = "AIzaSyAl8WZfFte7tdA-GgRC281-c8ufJdEGtd4"; //'AIzaSyBdzbUGthJC0EQAmUsAXgh4J0OUN9uVh4g' //
export const GOOGLE_MAP_ZOOM = 5;
export const GOOGLE_MAP_CENTER = { lat: 14.775869, lng: 106.688661 };

export const api = Axios.create({
  baseURL: API_END_POINT,
  headers: {
    "Content-Type": "application/json",
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
export const setToken = (token) => {
  // api.defaults.headers.common.Authorization = `Bearer ${token}`
  api.defaults.headers.common.Authorization = token;
};
