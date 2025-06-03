import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../Redux/Actions";
import {  Alertwarning, GetCookie } from "../../Utils";
import { SelectCity } from "../../Common";
import { useHistory } from "react-router-dom";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import GoogleMap from "google-map-react";
import LayoutMain from "../../Layout/LayoutMain";
const AnyReactComponent = ({ Name, Address, Phone }) => (
  <div className="map-marker">
    <i className="fa fa-map-marker green" style={{ fontSize: 30 }}></i>
    <div className="map-tooltip">
      <span className="bold" style={{ textTransform: "uppercase" }}>
        {Name}
      </span>{" "}
      <br />
      <span>
        <i className="fa fa-map-marker green"></i> {Address}
      </span>
      <br />
      <span>
        <i className="fa fa-phone green"></i> {Phone}
      </span>
    </div>
  </div>
);
export const PostOfficeComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button;
  const history = useHistory();
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [ServiceMeno, setServiceMeno] = useState({
    value: 0,
    label: "Chọn dịch vụ",
  });
  const [CityMeno, setCityMeno] = useState({
    value: 0,
    label: "Chọn tỉnh thành",
  });
  const [Data, setData] = useState([]);
  const [DataFilter, setDataFilter] = useState([]);

  /* run after render */
  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
    _Init();
  }, []);

  const _Init = async () => {
    try {
      debugger;
      let pr = {
        Json: "",
        func: "APIC_spPostOffice_GetMany",
      };
      const data = await mainAction.API_spCallServer(pr, dispatch);
      setData(
        data.filter(
          (p) =>
            (p.Types === 1 || p.Types === 2) &&
            p.Lat !== null &&
            p.Lng !== null &&
            p.Lat !== 0 &&
            p.Lng !== 0
        )
      );
      setDataFilter(data.filter((p) => p.Types === 1 || p.Types === 2));
    } catch (err) {
      Alertwarning("Vui lòng liên hệ CSKH để biết thêm thông tin !");
      console.log("Eror", err);
    }
    setDisable(false);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const onFilterPO = (CityId) => {
    setDataFilter(Data.filter((p) => p.LocationId === CityId || CityId === 0));
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row HomeTitle cardcus">Hệ thống bưu cục</div>
        <div className="row cardcus margin-top-20">
          <div className="col-md-12 bold  margin-bottom-20">
            {Data.length} chi nhánh / bưu cục trên toàn quốc
          </div>
          <div className="col-md-5 bormap">
            <div className="">
              <div className="form-group padding-10" style={{ marginTop: 0 }}>
                <SelectCity
                  IsActive={CityMeno}
                  onSelected={(item) => {
                    setCityMeno(item);
                    onFilterPO(item.value);
                  }}
                />
              </div>
              <div
                className="scroller"
                style={{ maxHeight: "calc(100vh - 230px)", padding: '10px' }}
              >
                {DataFilter.map((item, index) => {
                  return (
                    <div className="col-md-12 bg-gray" key={index}>
                      <span
                        className="maptilte"
                       /*  style={{ textTransform: "uppercase" }} */
                      >
                        {index + 1}.{item.POName}
                      </span>{" "}
                     {/*  <span onClick={onFilterPO(item.LocationId)}>Tìm đường đi</span> */}
                      <br />
                      <span className='margin-top-20 mapcontent'>
                      <img alt="phone" src="/assets/img/icon24/phone.png" className='margin-right-5' width="14" /> {item.POPhone}
                      </span>
                      <br />
                      <div className='mapcontent'>
                      <img alt="location" src="/assets/img/icon24/location.png" className='margin-right-5' width="14" />{" "}
                        <span>{item.POAddress} </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-md-7 text-center">
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 155px)",
              }}
            >
              <GoogleMap
                apiKey={"AIzaSyBUBW5JbPqpurOUq2iV3Ys3rx59IktH1-s"}
                center={[10.775869, 106.688661]}
                zoom={6}
              >
                {DataFilter.filter(
                  (p) =>
                    p.Lat !== null &&
                    p.Lng !== null &&
                    p.Lat !== 0 &&
                    p.Lng !== 0
                ).map((item, index) => {
                  return (
                    <AnyReactComponent
                      key={index}
                      lat={item.Lat}
                      lng={item.Lng}
                      Name={item.POName}
                      Address={item.POAddress}
                      Phone={item.POPhone}
                    />
                  );
                })}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
