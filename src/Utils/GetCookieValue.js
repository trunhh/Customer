import { useCookies } from "react-cookie";
export const  GetCookieValue = () => {
    let objectCookies = useCookies("CustomerLoginData", "");
    if(objectCookies!=="" && objectCookies!==null && objectCookies!==undefined){
        return objectCookies[0].CustomerLoginData;
    }
    else
    return null;
};