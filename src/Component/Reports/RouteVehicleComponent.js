import React, { useMemo } from "react";
import { withScriptjs,withGoogleMap } from "react-google-maps";
import { GoogleMapComponent } from ".";
import { GOOGLE_MAP_API_KEY } from "../../Services";
import LayoutMain from "../../Layout/LayoutMain";

export const RouteVehicleComponent = () => {

    const MapWithAMarker = useMemo(() => withScriptjs(withGoogleMap(GoogleMapComponent)), []);

    return (
        <LayoutMain>
        <div className="content mapareas">
            <div className="container-fluid">
                <p className="text-center" style={{fontSize:"12px"}}>
                <span class="mr-5"><img height="20" src="https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png" /> Vị trí đơn hàng</span>
                    <span class="mr-5" style={{whiteSpace:"nowrap"}}><img height="20" src="https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_grey.png" /> Điểm xe đã đi qua</span>
                    <span class="mr-5" style={{whiteSpace:"nowrap"}}><img height="20" src="https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png" /> Điểm xe sắp đi tới</span>
                    <span class="mr-5" style={{whiteSpace:"nowrap"}}><img height="20" src="https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png" /> Địa điểm giao/lấy hàng của bạn</span>
                    <span class="mr-5" style={{whiteSpace:"nowrap"}}><img height="20" src="https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_orange.png" /> Đã hoàn tất giao/lấy hàng của bạn</span>
                    <span class="mr-5" style={{whiteSpace:"nowrap"}}><img height="20" src="/assets/img/Vehicle/on180.png" /> Xe đang di chuyển</span>
                    <span class="mr-5" style={{whiteSpace:"nowrap"}}><img height="20" src="/assets/img/Vehicle/off180.png" /> Xe tạm dừng di chuyển</span>
                </p>
                <MapWithAMarker
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAP_API_KEY + "&v=3.exp&libraries=geometry,drawing,places"}
                    loadingElement={<div style={{ height: "calc(100vh - 150px)" }} />}
                    containerElement={<div style={{ height: "calc(100vh - 150px)" }} />}
                    mapElement={<div style={{ height: "calc(100vh - 150px)" }} />}
                />
            </div>
        </div>
        </LayoutMain>
    );
}