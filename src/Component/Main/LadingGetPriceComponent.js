import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { useInput } from "../../Hooks";

import { SelectCity, SelectDistrict, SelectWard, Avarta, NoCustomer } from "../../Common";
import {
  Alertsuccess,
  Alerterror,
  DecodeString,
  FormatMoney,
  FormatDateJson,
  GetCookieValue,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";

import { mainAction } from "../../Redux/Actions";
import { Location, Lading } from "../../Redux/Actions/Category";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import LayoutMain from "../../Layout/LayoutMain";

/* Load CSS */
export const LadingGetPriceComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();
  const [Prices, setPrices] = useState([]);
  const [IsShowList, setIsShowList] = useState("display-none");

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [CityFromMeno, setCityFromMeno] = useState(0);
  const [DistrictFromMeno, setDistrictFromMeno] = useState(0);
  const [CityFromMenoName, setCityFromMenoName] = useState("");
  const [DistrictFromMenoName, setDistrictFromMenoName] = useState("");

  const [CityMeno, setCityMeno] = useState(0);
  const [DistrictMeno, setDistrictMeno] = useState(0);
  const [WardMeno, setWardMeno] = useState(0);
  const [CityMenoName, setCityMenoName] = useState("");
  const [DistrictMenoName, setDistrictMenoName] = useState("");
  const [WardMenoName, setWardMenoName] = useState("");

  const [Weight, bindWeight, setWeight] = useInput("");
  const WeightRef = useRef();

  const [COD, bindCOD, setCOD] = useInput(0);
  const CODRef = useRef();
  /* run after render as document.ready */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null)
      history.push("/");
  }, []);

  const onChooseProvinceFrom = (item) => {
    setCityFromMeno(item.value);
    setCityFromMenoName(item.label);
    setDistrictFromMeno(0);
    setDistrictFromMenoName("");
  };

  const onChooseDistrictFrom = (item) => {
    setDistrictFromMeno(item.value);
    setDistrictFromMenoName(item.label);
  };

  const onChooseProvince = (item) => {
    setCityMeno(item.value);
    setCityMenoName(item.label);
    setDistrictMeno(0);
    setDistrictMenoName("");
    setWardMeno(0);
    setWardMenoName("");
  };

  const onChooseDistrict = (item) => {
    setDistrictMeno(item.value);
    setDistrictMenoName(item.label);
    setWardMeno(0);
    setWardMenoName("");
  };

  const onChooseWard = (item) => {
    setWardMeno(item.value);
    setWardMenoName(item.label);
  };

  /* clear data on form when insert success */
  const ClearForm = () => {
    setCityFromMeno(0);
    setDistrictFromMeno(0);
    setCityMeno(0);
    setDistrictMeno(0);
    setWardMeno(0);
    setWeight("");
    setDisable(false);
  };

  const APIC_spLadingGetPriceMany = async () => {
    //ScrollTop();
    if (CityFromMeno === 0 || CityFromMeno === undefined) {
      Alerterror("Vui lòng chọn Tỉnh thành gửi");
      return;
    } else if (
      DistrictFromMeno === 0 ||
      DistrictFromMeno === undefined
    ) {
      Alerterror("Vui lòng chọn Quận huyện gửi");
      return;
    } else if (Weight === "") {
      Alerterror("Vui lòng nhập trọng lượng");
      return;
    } else if (CityMeno === 0 || CityMeno === undefined) {
      Alerterror("Vui lòng chọn Tỉnh thành nhận");
      return;
    } else if (DistrictMeno === 0 || DistrictMeno === undefined) {
      Alerterror("Vui lòng chọn Quận huyện nhận");
      return;
    } else if (WardMeno === 0 || WardMeno === undefined) {
      Alerterror("Vui lòng chọn Phường xã nhận");
      return;
    }
    setDisable(false);
    let pr = {
      //AppAPIKey: APIKey,
      CustomerId: GetCookieGroup("IsChooseCustomer") === "True" ? CustomerID : 0,
      CityGoId: CityFromMeno,
      CityToId: CityMeno,
      DistrictTo: DistrictMeno,
      WardToId: WardMeno,
      Weight: parseFloat(Weight),
      PostOffice_Id: GetCookie("PostOfficeId"),
    };
    const params = {
      API_key: APIKey,
      TokenDevices: TOKEN_DEVICE,
      Json: JSON.stringify(pr),
      func: "CPN_spLading_EstimatesPrice",
    };
    try {
      // call redux saga
      const data = await mainAction.API_spCallServer(params, dispatch);
      //const data = await Lading.APIC_spLadingGetPriceMany(params, dispatch);
      setPrices(data);
      //ClearForm();
      //Alertsuccess(data.localMessage);
      setIsShowList("");
      setDisable(false); // disable button
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      setDisable(false); // disable button
    }
  };

  const GotoCreate = (_Service) => {
    let draff = {
      ServiceID: _Service.ServiceID,
      ServiceName: _Service.ServiceName,
      Weight: Weight,
      CityFrom: CityFromMeno,
      CityFromName: CityFromMenoName,
      DistrictFrom: DistrictFromMeno,
      DistrictFromName: DistrictFromMenoName,
      CityTo: CityMeno,
      CityToName: CityMenoName,
      DistrictTo: DistrictMeno,
      DistrictToName: DistrictMenoName,
      WardTo: WardMeno,
      WardToName: WardMenoName
    };
    localStorage.setItem("LadingDraft", JSON.stringify(draff));
    history.push("tao-nhanh-van-don");
  };

  return (
    <LayoutMain>
      {GetCookieGroup("IsChooseCustomer") === "True" ? (<>
        <div className="container-fluid">
          <div className="row Formlading">
            <div className="col-md-12 HomeTitle margin-top-10">Ước tính chi phí</div>
            <div className="col-md-6 margin-top-20">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <i className="fa fa-info-circle"></i> THÔNG TIN GỬI
                </div>
                <div className="panel-body">
                  <div className="row mb5">
                    <label className="col-md-12 mt10">
                      Gửi từ <span className="red">(*)</span>
                    </label>
                    <div className="col-md-12">
                      <SelectCity
                        onActive={CityFromMeno}
                        onSelected={(item) => {
                          onChooseProvinceFrom(item);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb5">
                    <label className="col-md-12 mt10">
                      Quận/huyện <span className="red">(*)</span>
                    </label>
                    <div className="col-md-12">
                      <SelectDistrict
                        onActive={DistrictFromMeno}
                        ParentID={CityFromMeno}
                        onSelected={(item) => {
                          onChooseDistrictFrom(item);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb5">
                    <label className="col-md-12 mt10">
                      Trọng lượng <span className="red">(*)</span>
                    </label>
                    <div className="col-md-12">
                      <div className="input-group mb-2">
                        <input
                          type="number"
                          className="form-control"
                          ref={WeightRef}
                          value={Weight}
                          {...bindWeight}
                          placeholder='Nhập trọng lượng kiện hàng'
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">gram</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 margin-top-20">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <i className="fa fa-info-circle"></i> THÔNG TIN NHẬN
                </div>
                <div className="panel-body">
                  <div className="row mb5">
                    <label className="col-md-12 mt10">
                      Gửi đến <span className="red">(*)</span>
                    </label>
                    <div className="col-md-12">
                      <SelectCity
                        onActive={CityMeno}
                        onSelected={(item) => {
                          onChooseProvince(item);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb5">
                    <label className="col-md-12 mt10">
                      Quận/huyện <span className="red">(*)</span>
                    </label>
                    <div className="col-md-12">
                      <SelectDistrict
                        onActive={DistrictMeno}
                        ParentID={CityMeno}
                        onSelected={(item) => {
                          onChooseDistrict(item);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb5">
                    <label className="col-md-12 mt10">
                      Phường/xã <span className="red">(*)</span>
                    </label>
                    <div className="col-md-12">
                      <SelectWard
                        onActive={WardMeno}
                        ParentID={DistrictMeno}
                        onSelected={(item) => {
                          onChooseWard(item);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 text-center margin-top-10">
            <button
              type="reset"
              className="btn text-transform btn-sm btn-refeshno"
              onClick={ClearForm}
            >
              <i className="material-icons">undo</i> Hủy
            </button>
            <button
              type="button"
              className="btn text-transform btn-sm btn-save margin-left-10"
              disabled={disable}
              onClick={APIC_spLadingGetPriceMany}
            >
              <i className="material-icons">monetization_on</i> Tra cứu giá
            </button>
          </div>
          <div className={IsShowList + "col-md-12 Formlading margin-top-20"}>
            <div className="row">
              {/* <div className="col-md-12 main-title">THÔNG TIN CƯỚC PHÍ</div> */}
              {Prices.map((item, index) => {
                return (
                  <div className="col-md-6 margin-top-20 table-border">
                    <table cellSpacing="5" cellPadding="10">
                      <tr className='borbotgrey'>
                        <td className="bold">{item.ServiceName}</td>
                        <td className="text-right">
                          {/* <Link
                                  to="/tao-nhanh-van-don"
                                  className="btn btn-success pull-right"
                                >
                                  <i className="material-icons">widgets</i> Tạo
                                  đơn hàng
                                </Link> */}
                          <button
                            type="button"
                            onClick={(e) => GotoCreate(item)}
                            className="btn text-transform btn-sm btn-refesh pull-right"
                          >
                            <i className="material-icons">widgets</i> Tạo đơn
                            hàng
                          </button>
                        </td>
                      </tr>
                      <tr className='borbotgrey'>
                        <td>Cước chính</td>
                        <td className="text-right">
                          {/* undefined, {maximumFractionDigits:0} */}
                          {item.Amount !== null
                            ? FormatMoney(item.Amount) + "đ"
                            : "0đ"}
                        </td>
                      </tr>
                      {/*  <tr>
                              <td>Phí COD</td>
                              <td className="text-right">
                                {item.CODMone ?? 0}
                              </td>
                            </tr> */}
                      <tr>
                        <td>Ngày giao dự kiến</td>
                        <td className="text-right">
                          {item.DealineTime === "/Date(-62135596800000)/"
                            ? "N/A"
                            : FormatDateJson(item.DealineTime, "d-k-y") ??
                            "Liên hệ để được tư vấn"}
                        </td>
                      </tr>
                    </table>
                  </div>
                );
              })}
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </>) : (<NoCustomer />)
      }
    </LayoutMain>
  );
};
