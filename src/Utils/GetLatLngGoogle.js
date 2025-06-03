import Geocode from "react-geocode";
//Geocode.setApiKey("AIzaSyAxFCqPJ3tcb9DK66k0GkrUaUAt2qwRfrI");

export const GetLatLngGoogle = async (Address, type = 0, lat = 0, lng = 0) => {
    try {
        //AIzaSyBUBW5JbPqpurOUq2iV3Ys3rx59IktH1-s Oke
        Geocode.setApiKey("AIzaSyBUBW5JbPqpurOUq2iV3Ys3rx59IktH1-s");

        if (type === 1) {
            const response = await Geocode.fromLatLng(lat, lng).then(
                response => {
                    const address = response.results[0].formatted_address;
                    return address
                },
                error => {
                    console.error(error);
                    return;
                }
            )
            
            return response;
        }

        const response = await Geocode.fromAddress(Address);;
        if (response) {
            return [{
                lat: response.results[0].geometry.location.lat,
                lng: response.results[0].geometry.location.lng,
                AddressReturn: response.results[0].formatted_address
            }];
        } else {
            return "False";
        }
    }
    catch (e) {
        return "False";
    }
};