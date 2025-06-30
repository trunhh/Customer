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
  GetCookie,
  GetCookieGroup,
} from "../../Utils";

import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { DataTable } from "../../Common/DataTable";
import LayoutMain from "../../Layout/LayoutMain";

/* Load CSS */
export const CustomerSenderComponent = () => {
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

  const [Company, bindCompany, setCompany] = useInput("");
  const CompanyRef = useRef();

  const [NoResultMessage, setNoResultMessage] = useState(
    "Không tìm thấy dữ liệu"
  );

  const [ShowForm, setShowForm] = useState(false);

  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
    if (GetCookieGroup("IsChooseCustomer") === "Fail")
      window.location.href = "/home";
    APIC_spCustomerSenderAddressList(CustomerID);
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

  const onSelectWard = (item) => {
    setWard(item.value);
    setWardMeno(item.label);
  };

  const APIC_spCustomerSenderAddressList = async (ID) => {
    const params = {
      Json: '{"CustomerId":' + ID + "}",
      func: "APIC_spCustomerSenderAddressList",
    };
    // call redux saga
    const data = await mainAction.API_spCallServer(params, dispatch);
    debugger;
    if (data !== null) setNoResultMessage("");
    else setNoResultMessage("Không tìm thấy dữ liệu");
    setAddressList(data);
    //PaginationTable();
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const GoToCreateLading = (item) => {
    debugger
    let draft = {
      AddressFromId: item._original.CustomerAddressSenderId,
      AddressFrom: item._original.AddressFull,
      objFrom: item._original
    };
    localStorage.setItem("LadingDraft", JSON.stringify(draft));
    debugger
    history.push("tao-nhanh-van-don");
  }

  const Edit = (item) => {
    debugger
    setAddressId(item._original.CustomerAddressSenderId);
    setName(item._original.NameSend);
    setPhone(item._original.PhoneSend);
    setStreet(item._original.Street_Number);
    setCity(item._original.CityId);
    setDistrict(item._original.DistrictiId);
    setWard(item._original.WarId);
    setCityMeno(item._original.CityName);
    setDistrictMeno(item._original.DistrictyName);
    setWardMeno(item._original.WarName);
    setCompany(item._original.Company);
    setShowForm(true);
  }

  const Delete = async (row) => {
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      Json: '{"CustomerId":' + CustomerID + ',"AddressId":' + row._original.CustomerAddressSenderId + '}',
      func: "APIC_spCustomerSenderAddressRemove",
    };
    const data = await mainAction.API_spCallServer(params, dispatch);
    if (data.resultCode == 0) {
      setAddressList(AddressList.filter(p => p.CustomerAddressSenderId !== row._original.CustomerAddressSenderId));
      Alertsuccess(data.localMessage);
    } else Alerterror(data.localMessage);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const APIC_spCustomerSenderAddress_SaveJson = async () => {
    //ScrollTop();
    setDisable(true);
    if (Name === "") Alerterror("Nhập họ tên");
    else if (Phone === "") Alerterror("Nhập số điện thoại");
    else if (ValidPhone(Phone) === "form-error")
      Alerterror("Số điện thoại không đúng định dạng !");
    else if (City === undefined || City == 0)
      Alerterror("Chọn tỉnh thành");
    else if (District === undefined || District == 0)
      Alerterror("Chọn quận huyện");
    else if (Ward === undefined || Ward == 0)
      Alerterror("Chọn phường xã");
    else if (Street === "") Alerterror("Nhập số nhà, đường");
    else {
      let params = {
        CustomerId: CustomerID,
        AddressId: AddressId,
        NameSend: Name,
        PhoneSend: Phone,
        CityId: City,
        DistrictId: District,
        WardId: Ward,
        Street_Number: Street,
        AddressFull:
          Street +
          ", " +
          WardMeno +
          ", " +
          DistrictMeno +
          ", " +
          CityMeno
      };
    const data = await mainAction.API_spCallServer(
      "APIC_spCustomerSenderAddress_SaveJson",
      params,
      dispatch
    );
      Alertsuccess(data.localMessage);
      APIC_spCustomerSenderAddressList(CustomerID);
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
    setCompany("");
    setDisable(false);
    setAddressId(0);
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
      accessor: "NameSend",
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
      accessor: "PhoneSend",
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
      accessor: "AddressFull",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm theo địa chỉ ..."
          className="form-control"
        />
      ),
    },
  ];

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle">Địa chỉ gửi thường xuyên
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
                            className="form-control borradius3 "
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
                          <label>
                            Số nhà / đường <span className="red">(*)</span>
                          </label>
                          <input
                            type="text"
                            className="form-control borradius3 "
                            ref={StreetRef}
                            value={Street}
                            {...bindStreet}
                            placeholder='Nhập số nhà, tên đường'
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
                      <div className="col-md-12 text-center">
                        <button
                          type="button"
                          className="btn btn-sm text-transform btn-refesh"
                          onClick={ClearForm}
                        >
                          <i className="material-icons">undo</i> Hủy
                        </button>{" "}
                        <button
                          type="button"
                          className="btn btn-sm text-transform btn-save"
                          disabled={disable}
                          onClick={APIC_spCustomerSenderAddress_SaveJson}
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
      </div>
    </LayoutMain>
  );
};
