import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import {
  Alertsuccess,
  Alerterror,
  ValidPhone,
  ValidEmail,
  ValidPassword,
} from "../../Utils";
import { SelectCity, SelectDistrict, SelectWard } from "../../Common";
import { mainAction } from "../../Redux/Actions";
import { CustomerAction } from "../../Redux/Actions/Main";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import {
  APIKey,
  TOKEN_DEVICE,
  GOOGLE_LOGIN_CLIENTID,
  FACEBOOK_LOGIN_APPID,
} from "../../Services/Api";
import LayoutLogin from "../../Layout/LayoutLogin";

export const RegisterComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [disable, setDisable] = useState(false); // disable button

  const [CityMeno, setCityMeno] = useState(0);
  const [DistrictMeno, setDistrictMeno] = useState(0);
  const [WardMeno, setWardMeno] = useState(0);

  const [Password, bindPassword, setPassword] = useInput("");
  const [PasswordConfirm, bindPasswordConfirm, setPasswordConfirm] =
    useInput("");
  const [CustomerName, bindCustomerName, setCustomerName] = useInput("");
  const [Phone, bindPhone, setPhone] = useInput("");
  const [Email, bindEmail, setEmail] = useInput("");
  const [Address, bindAddress, setAddress] = useInput("");
  const [GoogleId, setGoogleId] = useState("");
  const [FacebookId, setFacebookId] = useState("");

  const [phoneReg, setPhoneReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [passwordConfirmReg, setPasswordConfirmReg] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  const PasswordRef = useRef();
  const PasswordConfirmRef = useRef();
  const CustomerNameRef = useRef();
  const PhoneRef = useRef();
  const EmailRef = useRef();
  const AddressRef = useRef();
  const SocialIdRef = useRef();

  /* run after render */
  useEffect(() => {
    let strSocial = localStorage.getItem("registerSocial");
    if (strSocial !== undefined && strSocial !== "" && strSocial !== null) {
      let objs = JSON.parse(strSocial);
      setCustomerName(objs.Name);
      setEmail(objs.Email);
      setGoogleId(objs.GoogleId);
      setFacebookId(objs.FacebookId);
      localStorage.setItem("registerSocial", "");
    }
  }, []);

  /* get and set parameter from form and sub common */

  /* Chose item from select common */
  const onChooseProvince = (item) => {
    setCityMeno(item.value);
    setDistrictMeno(0);
    setWardMeno(0);
  };

  const onChooseDistrict = (item) => {
    setDistrictMeno(item.value);
    setWardMeno(0);
  };

  const onChooseWard = (item) => {
    setWardMeno(item.value);
  };

  const [ErrName, setErrName] = useState("");
  const [ErrAddress, setErrAddress] = useState("");
  const [ErrCity, setErrCity] = useState("");
  const [ErrDistrict, setErrDistrict] = useState("");
  const [ErrWard, setErrWard] = useState("");

  const [PassHide, setPassHide] = useState("password");
  const [PassEye, setPassEye] = useState("");
  const [PassConfirmHide, setPassConfirmHide] = useState("password");
  const [PassConfirmEye, setPassConfirmEye] = useState("");

  const onClickRegister = async () => {
    let params = {
      CustomerName: CustomerName,
      Phone: Phone,
      Email: Email,
      Address: Address,
      Username: Phone,
      Password: Password,
      City: CityMeno,
      District: DistrictMeno,
      Ward: WardMeno,
      GoogleId: GoogleId,
      FacebookId: FacebookId,
      SocialLoginObj: "",
    };
    if (CustomerName === "") {
      Alerterror("Vui lòng nhập Họ tên");
      setErrName("form-error");
      return;
    } else setErrName("");

    if (Phone === "") {
      Alerterror("Vui lòng nhập số điện thoại");
      setPhoneReg("form-error");
      return;
    } else setPhoneReg("");

    if (ValidPhone(Phone) === "form-error") {
      Alerterror("Số điện thoại không đúng định dạng");
      setPhoneReg("form-error");
      return;
    } else setPhoneReg("");

    if (Email === "") {
      setEmailReg("form-error");
      Alerterror("Vui lòng nhập email");
      return;
    } else setEmailReg("");

    if (ValidEmail(Email) !== "") {
      setEmailReg("form-error");
      Alerterror("Email không đúng định dạng");
      return;
    } else setEmailReg("");

    if (Password === "") {
      setPasswordReg("form-error");
      Alerterror("Nhập mật khẩu");
      return;
    } else setPasswordReg("");

    if (ValidPassword(Password) !== "") {
      setPasswordReg("form-error");
      Alerterror("Mật khẩu không an toàn");
      return;
    } else setPasswordReg("");

    if (PasswordConfirm === "") {
      Alerterror("Nhập mật khẩu xác nhận");
      setPasswordConfirmReg("form-error");
      return;
    } else setPasswordConfirmReg("");

    if (RegPasswordConfirm(PasswordConfirm) !== "") {
      Alerterror("Mật khẩu xác nhận không đúng");
      setPasswordConfirmReg("form-error");
      return;
    } else setPasswordConfirmReg("");

    if (Address === "") {
      Alerterror("Vui lòng nhập Địa chỉ");
      setErrAddress("form-error");
      return;
    } else setErrAddress("");

    if (CityMeno === 0 || CityMeno === undefined) {
      Alerterror("Vui lòng chọn Tỉnh thành");
      setErrCity("form-error");
      return;
    } else setErrCity("");

    if (DistrictMeno === 0 || DistrictMeno === undefined) {
      Alerterror("Vui lòng chọn Quận huyện");
      setErrDistrict("form-error");
      return;
    } else setErrDistrict("");

    if (WardMeno === 0 || WardMeno === undefined) {
      Alerterror("Vui lòng chọn Phường xã");
      setErrWard("form-error");
      return;
    } else setErrWard("");

    try {
      setDisable(false);
      const pr = {
        API_key: APIKey,
        Json: JSON.stringify(params),
        func: "APIC_spCustomerRegister_Save_V1",
      };
      const data = await mainAction.API_spCallServer(pr, dispatch);
      if (data[0].resultCode === 0) {
        Alertsuccess(data[0].localMessage);
        history.push("/");
      } else {
        Alerterror(data[0].localMessage);
      }
      mainAction.LOADING({ IsLoading: false }, dispatch);
    } catch (err) {
      Alerterror("Vui lòng liên hệ bộ phận chăm sóc khách hàng!");
      console.log("Eror", err);
    }
  };

  const RegEmail = (e) => {
    setEmail(e);
    if (e !== "") {
      let result = ValidEmail(e);
      setEmailReg(result);
      if (result === "form-error")
        setErrorMessage("Email không đúng định dạng");
      else setErrorMessage("");
    }
  };

  const RegPhone = (e) => {
    setPhone(e);
    if (e !== "") {
      let result = ValidPhone(e);
      setPhoneReg(result);
      if (result === "form-error")
        setErrorMessage("Số điện thoại không đúng định dạng");
      else setErrorMessage("");
    }
  };

  const RegPassword = (e) => {
    setPassword(e);
    if (e !== "") {
      let result = ValidPassword(e);
      setPasswordReg(result);
      if (result === "form-error") {
        setErrorMessage(
          "Mật khẩu phải có ít nhất 8 kí tự (bao gồm chữ hoa, chữ thường, chữ số, ký tự đặc biệt)"
        );
        return "form-error";
      } else {
        setErrorMessage("");
        return "";
      }
    }
  };

  const RegPasswordConfirm = (e) => {
    setPasswordConfirm(e);
    if (e !== Password) {
      setPasswordConfirmReg("form-error");
      setErrorMessage("Mật khẩu nhập lại không khớp");
      return "form-error";
    } else {
      setPasswordConfirmReg("");
      setErrorMessage("");
      return "";
    }
  };

  const responseFacebook = (response) => {
    debugger;
    console.log(response);
  };

  const responseGoogle = async (response) => {
    let obj = new Object();
    obj.Email = response.profileObj.email;
    obj.Name = response.profileObj.familyName + response.profileObj.givenName;
    obj.googleId = response.profileObj.googleId;
    obj.imageUrl = response.profileObj.imageUrl;
    const params = {
      API_key: APIKey,
      Json:
        '{"SocialID":"' +
        response.profileObj.googleId +
        '","SocialType":"Google", "SocialLoginObj": "' +
        JSON.stringify(response) +
        '"}',
      func: "APIC_spCustomerSocialLoginV2",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
  };

  return (
    <LayoutLogin>
      <div className="content-login">
        <div className="container container-login">
          <div className="row">
            <div className="col-md-12 text-center mb10">
              <Img
                src="../../assets/img/LOGO-GTEL.png"
                className="margin-left-5"
                width="200"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center margin-top-5s">
              <h3 className="bold">ĐĂNG KÝ TÀI KHOẢN</h3>
              <div className="form-group">
                Bạn đã có tài khoản rồi?
                <Link style={{ color: "#2264D1" }} className="bold" to="/">
                  {" "}
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-5s">
              <label className="color-grey">
                Họ tên <span className="red">(*)</span>
              </label>
              <div className="form-group mt0">
                <input
                  type="text"
                  className={"form-control borradius3 " + ErrName}
                  ref={CustomerNameRef}
                  value={CustomerName}
                  {...bindCustomerName}
                  placeholder="Nhập họ tên của bạn"
                />
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-5s">
              <label className="color-grey">
                Email <span className="red">(*)</span>
              </label>
              <div className="form-group mt0">
                <input
                  type="email"
                  className={"form-control borradius3 " + emailReg}
                  ref={EmailRef}
                  value={Email}
                  {...bindEmail}
                  onChange={(e) => RegEmail(e.target.value)}
                  placeholder="Nhập số Email của bạn"
                />
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-5s">
              <label className="color-grey">
                Số điện thoại <span className="red">(*)</span>
              </label>
              <div className="form-group mt0">
                <input
                  type="number"
                  className={"form-control borradius3 " + phoneReg}
                  ref={PhoneRef}
                  value={Phone}
                  {...bindPhone}
                  onChange={(e) => RegPhone(e.target.value)}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
            </div>
            <div classname="col-md-6 width60 margin-top-5s"></div>
            <div className="col-md-6 width60 margin-top-5s">
              <label className="color-grey">
                Mật khẩu <span className="red">(*)</span>
              </label>
              <div className="form-group mt0">
                <div className="input-group">
                  <input
                    type={PassHide}
                    className={"form-control borradius3 " + passwordReg}
                    ref={PasswordRef}
                    value={Password}
                    {...bindPassword}
                    onChange={(e) => {
                      RegPassword(e.target.value);
                    }}
                    placeholder="Nhập mật khẩu"
                  />
                  <div className="input-group-append">
                    <span
                      className={"fa fa-fw fa-eye input-group-text " + PassEye}
                      onClick={(e) => {
                        setPassHide(PassEye === "" ? "text" : "password");
                        setPassEye(PassEye === "" ? "fa-eye-slash" : "");
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-5s">
              <label className="color-grey">
                Xác nhận mật khẩu <span className="red">(*)</span>
              </label>
              <div className="form-group mt0">
                <div className="input-group">
                  <input
                    type={PassConfirmHide}
                    className={"form-control borradius3 " + passwordConfirmReg}
                    ref={PasswordConfirmRef}
                    value={PasswordConfirm}
                    {...bindPasswordConfirm}
                    onChange={(e) => RegPasswordConfirm(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <div className="input-group-append">
                    <span
                      className={
                        "fa fa-fw fa-eye input-group-text " + PassConfirmEye
                      }
                      onClick={(e) => {
                        setPassConfirmHide(
                          PassConfirmEye === "" ? "text" : "password"
                        );
                        setPassConfirmEye(
                          PassConfirmEye === "" ? "fa-eye-slash" : ""
                        );
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-center error-message width60 margin-top-5s">
              {ErrorMessage}
            </div>
            <div className="col-md-6 width60 margin-top-10s">
              <div className="form-group">
                <label className="color-grey">
                  Tỉnh thành <span className="red">(*)</span>
                </label>
                <SelectCity
                  className={"form-control " + ErrCity}
                  onActive={CityMeno}
                  onSelected={(item) => {
                    onChooseProvince(item);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-10s">
              <div className="form-group">
                <label className="color-grey">
                  Quận huyện <span className="red">(*)</span>
                </label>
                <SelectDistrict
                  className={"form-control " + ErrDistrict}
                  onActive={DistrictMeno}
                  ParentID={CityMeno}
                  onSelected={(item) => {
                    onChooseDistrict(item);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-10s">
              <div className="form-group">
                <label className="color-grey">
                  Phường xã <span className="red">(*)</span>
                </label>
                <SelectWard
                  onActive={WardMeno}
                  ParentID={DistrictMeno}
                  onSelected={(item) => {
                    onChooseWard(item);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 width60 margin-top-5s">
              <label className="color-grey">
                Địa chỉ <span className="red">(*)</span>
              </label>
              <div className="form-group mt0">
                <input
                  type="text"
                  className={"form-control borradius3 " + ErrAddress}
                  ref={AddressRef}
                  value={Address}
                  {...bindAddress}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
            </div>

            <div className="col-md-6 width60" style={{ fontSize: "12px" }}>
              <span>
                Khi nhấn đăng ký, quý khác đã đồng ý với Điều khoản sử dụng dịch
                vụ của GTELPOST. Nếu quý khách không đăng ký được tài khoản, vui
                lòng liên hệ hotline{" "}
                <span className="red"> 19000328 - 024.9999.0328</span> để được
                hỗ trợ.
              </span>
            </div>
            <div className="col-md-6 text-center width60">
              <div className="form-group">
                <button
                  type="button"
                  className="btn text-transform btn-sm btn-save width100"
                  onClick={onClickRegister}
                >
                  Đăng ký ngay<div className="ripple-container"></div>
                </button>
              </div>
            </div>

            <div className="gg display-none">
              <FacebookLogin
                appId={FACEBOOK_LOGIN_APPID}
                autoLoad={false}
                fields="name,email,picture"
                scope="public_profile"
                callback={responseFacebook}
                icon="fa-facebook"
                cssClass="btn btn-success btnFacebook"
              />
              <GoogleLogin
                clientId={GOOGLE_LOGIN_CLIENTID}
                buttonText="Sign In with Google"
                onSuccess={responseGoogle}
                icon="fa-google"
                cssClass="btn btn-success btnFacebook"
              />
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
};
