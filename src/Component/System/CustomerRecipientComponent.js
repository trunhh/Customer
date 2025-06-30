import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useInput } from "../../Hooks";

import { SelectCity, SelectDistrict, SelectWard } from "../../Common";
import {
  Alertsuccess,
  Alerterror,
  PaginationTable,
  ValidPhone,
  GetLatLngGoogle,
  GetCookie,
  GetCookieGroup
} from "../../Utils";

import { CustomerAction } from "../../Redux/Actions/Main";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { DataTable } from "../../Common/DataTable";
import LayoutMain from "../../Layout/LayoutMain";

export const CustomerRecipientComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();
  const [AddressList, setAddressList] = useState([]);

  /* get and set parameter from form and sub common */
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [AddressId, setAddressId] = useState(0);
  const [City, setCity] = useState(0);
  const [District, setDistrict] = useState(0);
  const [Ward, setWard] = useState(0);
  const [CityMeno, setCityMeno] = useState("");
  const [DistrictMeno, setDistrictMeno] = useState("");
  const [WardMeno, setWardMeno] = useState("");

  const [Name, bindName, setName] = useInput("");
  const NameRef = useRef();

  const [Phone, bindPhone, setPhone] = useInput("");
  const PhoneRef = useRef();

  const [Street, bindStreet, setStreet] = useInput("");
  const StreetRef = useRef();

  const [Code, bindCode, setCode] = useInput("");
  const CodeRef = useRef();

  const [Company, bindCompany, setCompany] = useInput("");
  const CompanyRef = useRef();

  const [AddressOld, setAddressOld] = useState();
  const [Lat, setLat] = useState(0);
  const [Lng, setLng] = useState(0);

  const [NoResultMessage, setNoResultMessage] = useState(
    "Không tìm thấy dữ liệu"
  );

  const [ShowForm, setShowForm] = useState(false);

  /* run after render as document.ready */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null)
      history.push("/");
    if (GetCookieGroup("IsChooseCustomer") === "Fail")
      window.location.href = "/home";
    APIC_spCustomerRecipientLoad();
  }, []);

  const onChooseProvince = (item) => {
    setCity(item.value);
    setCityMeno(item.label);
    setDistrict(0);
    setDistrictMeno("");
    setWard(0);
    setWardMeno("");
  };

  const onChooseDistrict = (item) => {
    setDistrict(item.value);
    setDistrictMeno(item.label);
    setWard(0);
    setWardMeno("");
  };

  const [StreetList, setStreetList] = useState([]);
  const onSelectWard = async (item) => {
    setWard(item.value);
    setWardMeno(item.label);

    //Gọi api nạp danh sách địa chỉ cho khách lựa chọn
    const params = {
      Json: "[{\"WardId\":\"" + item.value + "\"}]",
      func: "APIC_spCustomerRecipientGetByLocation",
      API_key: APIKey,
    };
    // call redux saga
    const result = await mainAction.API_spCallServer(params, dispatch);
    setStreetList(result);
  };

  const changeStreet = (e) => {
    debugger
    setStreet(e);
    if (e === "") {
      setLng(0);
      setLat(0);
    }
    else {
      let check = StreetList.find(p => p.Street.toUpperCase() === e.toUpperCase());
      if (check !== undefined) {
        setLat(check.Lat);
        setLng(check.Lng);
      }
      else {
        setLat(0);
        setLng(0);
      }
    }
  };

  /* clear data on form when insert success */

  const APIC_spCustomerRecipientLoad = async () => {
    const params = {
      API_key: APIKey,
      Json: '{"CustomerId":' + CustomerID + "}",
      func: "APIC_spCustomerRecipientLoad",
    };
    // call redux saga
    const data = await mainAction.API_spCallServer(params, dispatch);
    if (data !== null) setNoResultMessage("");
    else setNoResultMessage("Không tìm thấy dữ liệu");
    setAddressList(data);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const Edit = (item) => {
    debugger
    setAddressId(item._original.Id);
    setName(item._original.Name);
    setPhone(item._original.Phone);
    setStreet(item._original.Street);
    setCity(item._original.CityId);
    setDistrict(item._original.DistrictId);
    setWard(item._original.WardId);
    setCityMeno(item._original.City);
    setDistrictMeno(item._original.District);
    setWardMeno(item._original.Ward);
    setCompany(item._original.Company);
    setAddressOld(item._original.Street + ", " + item._original.Ward + ", " + item._original.District + ", " + item._original.City);
    setLat(item._original.Lat);
    setLng(item._original.Lng);
    setShowForm(true);
  }

  const Delete = async (item) => {
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerID: CustomerID,
      AddressId: item._original.Id,
    };
    const data = await mainAction.API_spCallServer(
      "APIC_spCustomerRecipientRemove_V1",
      params,
      dispatch
    );
    if (data.resultCode == 0) {
      setAddressList(AddressList.filter(p => p.Id !== item._original.Id));
      Alertsuccess(data.Message);
    } else Alerterror(data.Message);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const APIC_spCustomerRecipientSave = async () => {
    setDisable(true);
    let GetLat = Lat, GetLng = Lng, Address = Street + ", " + WardMeno + ", " + DistrictMeno + ", " + CityMeno;
    if (Name === "")
      Alerterror("Nhập họ tên");
    else if (Phone === "")
      Alerterror("Nhập số điện thoại");
    else if (ValidPhone(Phone) === "form-error")
      Alerterror("Số điện thoại không đúng định dạng !");
    else if (City === undefined || City == 0)
      Alerterror("Chọn tỉnh thành");
    else if (District === undefined || District == 0)
      Alerterror("Chọn quận huyện");
    else if (Ward === undefined || Ward == 0)
      Alerterror("Chọn phường xã");
    else if (Street === "")
      Alerterror("Nhập số nhà, đường");
    else {
      debugger
      if (Lat === 0 || Lng === 0 || Lat === "" || Lng === "" || Lat === "0" || Lng === "0"
        || Lat === undefined || Lng === undefined || Lat === null || Lng === null) {
        const res = await GetLatLngGoogle(Address);
        if (res) {
          GetLat = res[0].lat
          GetLng = res[0].lng
        }
      }

      let params = {
        AppAPIKey: APIKey,
        TokenDevices: TOKEN_DEVICE,
        CustomerID: CustomerID,
        AddressId: AddressId,
        Code: Phone,
        Name: Name,
        Phone: Phone,
        CityId: City,
        City: CityMeno,
        DistrictId: District,
        District: DistrictMeno,
        WardId: Ward,
        Ward: WardMeno,
        Street: Street,
        Company: Company,
        Address:
          Street +
          ", " +
          WardMeno +
          ", " +
          DistrictMeno +
          ", " +
          CityMeno,
        Lat: GetLat,
        Lng: GetLng,
      };
      const pr = {
        API_key: APIKey,
        json: JSON.stringify(params),
        func: "APIC_spCustomerRecipientSaveJson",
      };
      const data = await mainAction.API_spCallServer(pr, dispatch);
      Alertsuccess(data.localMessage);
      APIC_spCustomerRecipientLoad();
      setDisable(false);
      PaginationTable();
      ClearForm();
    }
    setDisable(false);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const [phoneReg, setPhoneReg] = useState("");
  const RegPhone = (e) => {
    debugger;
    setPhone(e);
    if (e !== "") {
      let result = ValidPhone(e);
      setPhoneReg(result);
      if (result === "form-error")
        Alerterror("Số điện thoại không đúng định dạng");
    }
  };

  const GoToCreateLading = (item) => {
    let draft = {
      AddressToId: item._original.Id,
      AddressTo: item._original.Address,
      objTo: item._original
    };
    localStorage.setItem("LadingDraft", JSON.stringify(draft));
    debugger
    history.push("tao-nhanh-van-don");
  }

  const ClearForm = () => {
    setCity(0);
    setDistrict(0);
    setWard(0);
    setCityMeno("");
    setDistrictMeno("");
    setWardMeno("");
    setName("");
    setPhone("");
    setStreet("");
    setCode("");
    setCompany("");
    setAddressOld("");
    setAddressId(0);
    setDisable(false);
  };

  const columns = [
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
      filterable: false,
    },
    {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <span>
          <i
            className="fa fa-edit green button"
            onClick={() => GoToCreateLading(row)}
            title="Tạo đơn hàng"
          ></i>
          <i
            className="fa fa-cog yellow button"
            onClick={() => Edit(row)}
            title="Sửa"
          ></i>
          <i
            className="fa fa-trash red button"
            onClick={() =>
              window.confirm("Xác nhận xóa địa chỉ ?") &&
              Delete(row)
            }
            title="Xóa"
          ></i>
        </span>
      ),
      width: 100,
      filterable: false,
    },
    {
      Header: "Tên",
      accessor: "Name",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm theo tên ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Số điện thoại",
      accessor: "Phone",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm theo số điện thoại ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Địa chỉ",
      accessor: "Address",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm theo địa chỉ ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Công ty",
      accessor: "Company",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm theo công ty ..."
          className="form-control"
        />
      ),
    },
  ];

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle">Địa chỉ nhận thường xuyên
            <button type="button" className="btn btn-refesh text-transform pull-right btn-sm" onClick={(e) => setShowForm(!ShowForm)}>
              <i className="fa fa-plus"></i> Thêm địa chỉ mới
            </button>
          </div>
          <div className="col-md-12 margin-top-20">
            <div className={"panel-collapse collapse in cardcus " + (ShowForm ? "show" : "")} id="collapseOne">
              <div className="margin-top-10">
                <div className="titleNew">
                  <i className="fa fa-edit"></i> Thêm mới địa chỉ
                </div>
                <div className="panel-body margin-top-10">
                  <form className=" form-horizontal">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Họ tên <span className="red">(*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control borradius3"
                            ref={NameRef}
                            value={Name}
                            {...bindName}
                            placeholder='Nhập họ tên'
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            SĐT <span className="red">(*)</span>
                          </label>
                          <input
                            type="number"
                            className={"form-control borradius3 " + phoneReg}
                            ref={PhoneRef}
                            value={Phone}
                            {...bindPhone}
                            placeholder='Nhập số điện thoại'
                            min="0"
                            onBlur={(e) => RegPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Công ty</label>
                          <input
                            type="text"
                            className="form-control borradius3"
                            ref={CompanyRef}
                            value={Company}
                            {...bindCompany}
                            placeholder='Nhập tên công ty'
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="bmd-label-static">
                            Tỉnh thành <span className="red">(*)</span>
                          </label>
                          <SelectCity
                            onActive={City}
                            onSelected={(item) => {
                              onChooseProvince(item);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="bmd-label-static">
                            Quận/huyện <span className="red">(*)</span>
                          </label>
                          <SelectDistrict
                            onActive={District}
                            ParentID={City}
                            onSelected={(item) => {
                              onChooseDistrict(item);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="bmd-label-static">
                            Phường/xã <span className="red">(*)</span>
                          </label>
                          <SelectWard
                            onActive={Ward}
                            ParentID={District}
                            onSelected={(item) => {
                              onSelectWard(item);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 margin-top-20">
                        <div className="form-group">
                          <label>
                            Số nhà, đường <span className="red">(*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            ref={StreetRef}
                            value={Street}
                            {...bindStreet}
                            minLength="0"
                            maxLength="500"
                            placeholder='Nhập số nhà, tên đường'
                            onBlur={(e) => {
                              changeStreet(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 text-center">
                        <button
                          type="button"
                          className="btn text-transform btn-sm btn-refesh"
                          onClick={ClearForm}
                        >
                          <i className="material-icons">undo</i> Hủy
                        </button>{" "}
                        <button
                          type="button"
                          className="btn text-transform btn-sm btn-save"
                          disabled={disable}
                          onClick={APIC_spCustomerRecipientSave}
                        >
                          <i className="material-icons">create</i> Xác nhận
                        </button>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 margin-top-10">
            <div className="">
              <div className="table-responsive">
                <DataTable data={AddressList} columns={columns} />
              </div>
            </div>
          </div>
        </div>
      </div >
    </LayoutMain>
  );
};
