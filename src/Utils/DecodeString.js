export const  DecodeString = (string) => {
    if (string.trim() !== "") {
        let a = atob(string);
        return decodeURIComponent(a);
    } else
        return '';
};