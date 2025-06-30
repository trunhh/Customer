import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { useInput } from "../../Hooks";
import { GoogleLogin } from 'react-google-login';
import {
  SelectCity,
  SelectDistrict,
  SelectWard,
  Avarta,
} from "../../Common";
import { Alertsuccess, Alerterror, DecodeString, GetCookie, GetCookieGroup } from "../../Utils";

import { mainAction } from "../../Redux/Actions";
import { CustomerAction } from "../../Redux/Actions/Main";
import { APIKey, TOKEN_DEVICE, GOOGLE_LOGIN_CLIENTID, FACEBOOK_LOGIN_APPID } from "../../Services/Api";
import LayoutMain from "../../Layout/LayoutMain";
/* Load CSS */

export const ProfiveComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();
  const [Customer, setCustomer] = useState(GetCookie("All"));
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [CustomerName, bindCustomerName, setCustomerName] = useInput(GetCookie("CustomerName"));
  const CustomerNameRef = useRef();

  const [Phone, bindPhone, setPhone] = useInput(GetCookie("Phone"));
  const PhoneRef = useRef();

  const [Email, bindEmail, setEmail] = useInput(GetCookie("Email"));
  const EmailRef = useRef();

  const [Company, bindCompany, setCompany] = useInput(GetCookie("Company"));
  const CompanyRef = useRef();

  const [Address, bindAddress, setAddress] = useInput(GetCookie("Address"));
  const AddressRef = useRef();

  const [BankNumber, bindBankNumber, setBankNumber] = useInput(GetCookie("BankNumber"));
  const BankNumberRef = useRef();

  const [BankNumberName, bindBankNumberName, setBankNumberName] = useInput(GetCookie("BankNumberName"));
  const BankNumberNameRef = useRef();

  const [BankName, bindBankName, setBankName] = useInput(GetCookie("BankName"));
  const BankNameRef = useRef();

  const [BankBranch, bindBankBranch, setBankBranch] = useInput(GetCookie("BankBranch"));
  const BankBranchRef = useRef();

  const [City, setCity] = useState(0);

  const [District, setDistrict] = useState(GetCookie("District"));

  const [Ward, setWard] = useState(GetCookie("Ward"));

  const [Avatar, setAvatar] = useState(GetCookie("LinkAvatar"));
  const [FileUpload, setFileUpload] = useState({});

  useEffect(() => {
    debugger
    var a = GetCookie("CustomerCompany")
    if (CustomerID === null)
      history.push("/");
    if (GetCookieGroup("IsChooseCustomer") === "Fail")
      window.location.href = "/home";
    setCity(GetCookie("City"));
  }, []);

  const onChooseProvince = (item) => {
    //setCityMeno(item);
    setCity(item.value);
  };

  const onChooseDistrict = (item) => {
    //setDistrictMeno(item);
    setDistrict(item.value);
  };

  const onSelectWard = (item) => {
    //setWardMeno(item);
    setWard(item.value);
  };
  /* clear data on form when insert success */

  const APIC_spCustomerUpdateInfo = async () => {
    //ScrollTop();
    setDisable(false);
    if (CustomerName === "") {
      Alerterror("Vui lòng nhập họ tên");
      return;
    }
    else if (Phone === "") {
      Alerterror("Vui lòng nhập SDT");
      return;
    } else if (Email === "") {
      Alerterror("Vui lòng nhập Email");
      return;
    } else if (Address === "") {
      /*  else if (ValidEmail(Email) !== "") {
        Alerterror("Email không đúng định dạng");
        return;
      }  */
      Alerterror("Vui lòng nhập Địa chỉ");
      return;
    } else if (City === 0) {
      Alerterror("Vui lòng chọn Tỉnh thành");
      return;
    } else if (District === 0) {
      Alerterror("Vui lòng chọn Quận huyện");
      return;
    } else if (Ward === 0) {
      Alerterror("Vui lòng chọn Phường xã");
      return;
    } else {
      let params = {
        AppAPIKey: APIKey,
        TokenDevices: TOKEN_DEVICE,
        CustomerID: CustomerID,
        CustomerName: CustomerName,
        CompanyName: Company,
        UserName: "",
        Password: "",
        Phone: Phone,
        Email: Email,
        Address: Address,
        City: City,
        District: District,
        Ward: Ward,
        BankNumber: BankNumber == null ? "" : BankNumber,
        BankNumberName: BankNumberName == null ? "" : BankNumberName,
        BankName: BankName == null ? "" : BankName,
        BankBranch: BankBranch == null ? "" : BankBranch
      };
    const data = await mainAction.API_spCallServer(
      "APIC_spCustomerUpdateInfo_V1",
      params,
      dispatch
    );
      if (data.resultCode === 0)
        Alertsuccess(data.localMessage);
      else
        Alerterror(data.localMessage);
      //Cập nhật lại cookie
      Customer.CustomerName = CustomerName;
      Customer.Address = Address;
      Customer.City = City;
      Customer.District = District;
      Customer.Ward = Ward;
      Customer.BankNumber = BankNumber;
      Customer.BankNumberName = BankNumberName;
      Customer.BankName = BankName;
      Customer.setBankBranch = BankBranch;
      Customer.Company = Company;
      localStorage.setItem("Customer_LoginData", JSON.stringify(Customer));
    }
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const [OldAvatar, setOldAvatar] = useState("/assets/img/noimage.jpg");
  const [ShowChooseAvatar, setShowChooseAvatar] = useState("");
  const [ShowSaveAvatar, setShowSaveAvatar] = useState("display-none");

  const onCancelChangeAvatar = (event) => {
    setShowChooseAvatar("");
    setShowSaveAvatar("display-none");
    setAvatar(OldAvatar);
  };

  const onFileChange = (event) => {
    setFileUpload(event.target.files[0]);
    setShowChooseAvatar("display-none");
    setShowSaveAvatar("");
    setOldAvatar(Avatar);
    setAvatar(URL.createObjectURL(event.target.files[0]));
  };

  // On file upload (click the upload button)
  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append("CustomerID", CustomerID);
    formData.append("AppAPIKey", APIKey);
    formData.append("TokenDevice", "website");
    formData.append("Avatar", "");
    formData.append("myFile", FileUpload, FileUpload.name);

    const data = await CustomerAction.APIC_spCustomerChangeAvatar(
      formData,
      dispatch
    );
    debugger
    if (data.resultCode === 0) {
      setAvatar("https://erp.vps.vn" + data.localMessage);
      setShowChooseAvatar("");
      setShowSaveAvatar("display-none");
    }
    let objCustomer = Customer;
    objCustomer.Avatar = "https://erp.vps.vn" + data.localMessage;
    localStorage.setItem("Customer_LoginData", JSON.stringify(objCustomer));
    setCustomer(objCustomer);
    Alertsuccess("Cập nhật ảnh đại diện thành công !");
  };

  const responseFacebook = (response) => {
    console.log(response);
  }

  const responseGoogle = async (response) => {
    let pr = {
      CustomerId: Customer.CustomerID,
      GoogleId: response.profileObj.googleId,
      SocialLoginObj: response.profileObj
    }
    const params = {
      API_key: APIKey,
      Json: JSON.stringify(pr),
      func: "APIC_spCustomerSocialLoginV2",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
    if (list.length > 0) {
      let _customer = list[0];
      let objCustomer = {
        CustomerID: _customer.CustomerID,
        CustomerCode: _customer.CustomerCode,
        CustomerName: _customer.CustomerName,
        Phone: _customer.Phone,
        Email: _customer.Email,
        Address: _customer.Address,
        Company: _customer.CustomerCompany,
        City: _customer.City,
        District: _customer.District,
        Ward: _customer.Ward,
        CityName: _customer.CityName,
        DistrictName: _customer.DistrictName,
        WardName: _customer.WardName,
        Verification: _customer.Verification,
        CustomerGroupId: _customer.CustomerGroupId,
        PostOfficeId: _customer.PostOfficeId,
        Officer_ServiceId: _customer.Officer_ServiceId,
        GroupId: _customer.CustomerGroupId,
        LinkAvatar: _customer.LinkAvatar,
        TypeCustomer: _customer.Type,
        GoogleId: _customer.GoogleId,
        FacebookId: _customer.FacebookId
      };
      localStorage.setItem("Customer_LoginData", JSON.stringify(objCustomer));
      setCustomer(objCustomer);
      Alertsuccess("Liên kết tài khoản với Google thành công !");
    }
  }

  return (
    <LayoutMain>
      <div className="row FormProfl">
        <div className="col-md-12 row HomeTitle  cardcus">Thông tin tài khoản</div>
        <div className="col-md-4   margin-top-20">
          <div className="row cardcus">
            <div className="col-md-12 text-center">
              <img src={Avatar} className="avatarCustomer" />
            </div>
            <div
              className={
                ShowChooseAvatar + " col-md-12 text-center"
              }
            >
              <input
                type="file"
                className="fileUpload"
                onChange={onFileChange}
                accept="image/*"
              />
              <button
                type="button"
                className="btn text-transform btn-refesh btn-sm"
                disabled={disable}
              >
                <i className="material-icons">camera_alt</i> Đổi ảnh đại diện
              </button>
            </div>
            <div
              className={ShowSaveAvatar + " col-md-12 text-center"}
            >
              <button
                type="button"
                className="btn btn-danger btn-sm width150"
                disabled={disable}
                onClick={onFileUpload}
              >
                <i className="material-icons">save</i> cập nhật
              </button>
              <button
                type="button"
                className="btn btn-default btn-sm width150"
                disabled={disable}
                onClick={onCancelChangeAvatar}
              >
                <i className="material-icons">undo</i> Hủy
              </button>
            </div>
            <div className="col-md-12 text-center margin-top-20">
              {/* <FacebookLogin
                  appId={FACEBOOK_LOGIN_APPID}
                  textButton="Kết nối với Facebook"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  icon="fa-facebook"
                  cssClass="btn btn-info btnFacebook"
                />
                <br /> */}
              {GetCookie("GoogleId") === null ? (
                <GoogleLogin
                  clientId={GOOGLE_LOGIN_CLIENTID}
                  buttonText="Kết nối tài khoản với Google"
                  onSuccess={responseGoogle}
                  icon="fa-google"
                  cssClass="btn btn-success btnGoogle"
                />
              ) : (<></>)}
            </div>
          </div>
        </div>

        <div className="col-md-8 margin-top-20">
          <div className='cardcus'>
            <div className='title'>
              Thông tin cá nhân{" "}
            </div>
            <div className="row margin-top-20">
              <div className="col-md-6 mt5">
                <div className="form-group">
                  <label>Họ tên <span className="red">(*)</span></label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={CustomerNameRef}
                    value={CustomerName}
                    {...bindCustomerName}
                  />
                </div>
              </div>
              <div className="col-md-6 mt5">
                <div className="form-group borradius3">
                  <label>Số điện thoại <span className="red">(*)</span></label>
                  <input
                    type="number"
                    className="form-control"
                    ref={PhoneRef}
                    value={Phone}
                    {...bindPhone}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group borradius3">
                  <label>Email <span className="red">(*)</span></label>
                  <input
                    type="email"
                    className="form-control borradius3"
                    ref={EmailRef}
                    value={Email}
                    {...bindEmail}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group ">
                  <label>Công ty</label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={CompanyRef}
                    value={Company}
                    {...bindCompany}
                  />
                </div>
              </div>
              <div className="col-md-12 margin-top-10">
                <div className="form-group">
                  <label>Địa chỉ <span className="red">(*)</span></label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={AddressRef}
                    value={Address}
                    {...bindAddress}
                  />
                </div>
              </div>

              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>STK ngân hàng</label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={BankNumberRef}
                    value={BankNumber}
                    {...bindBankNumber}
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Tên TK ngân hàng</label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={BankNumberNameRef}
                    value={BankNumberName}
                    {...bindBankNumberName}
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Tên ngân hàng</label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={BankNameRef}
                    value={BankName}
                    {...bindBankName}
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Tên chi nhánh</label>
                  <input
                    type="text"
                    className="form-control borradius3"
                    ref={BankBranchRef}
                    value={BankBranch}
                    {...bindBankBranch}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mt0">
                  <label className="bmd-label-static">Tỉnh thành <span className="red">(*)</span></label>
                  <SelectCity
                    onActive={City}
                    onSelected={(item) => {
                      onChooseProvince(item);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mt0">
                  <label className="bmd-label-static">Quận/huyện <span className="red">(*)</span></label>
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
                <div className="form-group mt0">
                  <label className="bmd-label-static">Phường/xã <span className="red">(*)</span></label>
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
                  className="btn text-transform btn-sm btn-save"
                  disabled={disable}
                  onClick={APIC_spCustomerUpdateInfo}
                >
                  <i className="material-icons">cached</i> Cập nhật thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};