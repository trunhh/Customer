import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alertsuccess,
  Alerterror,
  PaginationTable,
  Alertwarning,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { CustomerAction } from "../../Redux/Actions/Main";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import { APIKey } from "../../Services/Api";
import { Alert } from "reactstrap";
import LayoutLogin from "../../Layout/LayoutLogin";

export const ResetPasswordComponent = () => {
  const dispatch = useDispatch();

  const [Password, bindPassword, setPassword] = useInput("");
  const PasswordRef = useRef();

  const [PasswordConfirm, bindPasswordConfirm, setPasswordConfirm] =
    useInput("");
  const PasswordConfirmRef = useRef();

  const [CustomerID, setCustomerID] = useState(0);
  const [PassOld, setPassOld] = useState("");

  const [Message, setMessage] = useState("");
  const [KeyChangePass, setKeyChangePass] = useState("");
  const [disable, setDisable] = useState(false); // disable button

  const [PassHide, setPassHide] = useState("password");
  const [PassEye, setPassEye] = useState("");
  const [PassConfirmHide, setPassConfirmHide] = useState("password");
  const [PassConfirmEye, setPassConfirmEye] = useState("");

  useEffect(() => {
    APIC_CustomerCheckResetPass();
  }, []);

  const APIC_CustomerCheckResetPass = async () => {
    setDisable(true);

    let sPageURL = window.location.href;
    let _key = sPageURL.split("key=");
    setKeyChangePass(_key[1]);

    let pr = {
      Json: _key[1],
    };
    const keyDesc = await mainAction.DecryptString(pr, dispatch);
    if (keyDesc !== "") {
      var arr = keyDesc.split(";");
      let params = {
        Json: '{"CustomerID":"' + arr[0] + '"}',
        func: "APIC_spCustomer_GetById",
      };
      const data = await mainAction.API_spCallServer(params, dispatch);
      if (data[0].CustomerCode == arr[1] && data[0].Password == arr[2]) {
        setCustomerID(arr[0]);
        setPassOld(arr[2]);
        setDisable(false);
        setMessage(
          "Yêu cầu đổi mật khẩu hợp lệ. Có thể tiến hành đổi mật khẩu mới"
        );
      } else {
        setMessage("Yêu cầu đổi mật khẩu đã hết hạn");
      }
    } else {
      setMessage("Lỗi");
    }
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const APIC_spCustomerResetPass = async () => {
    setDisable(true);
    if (Password !== PasswordConfirm) {
      Alertwarning(
        "Mật khẩu mới và mật khẩu xác nhận không trùng nhau. Vui lòng kiểm tra lại"
      );
      setDisable(false);
      return;
    }
    //Mã hóa mk mới
    let prEnc = {
      Json: Password,
    };
    const keyEnc = await mainAction.EncryptString(prEnc, dispatch);

    //Đổi mk
    let params = {
      AppAPIKey: APIKey,
      Key: KeyChangePass,
      CustomerID: CustomerID,
      Password: keyEnc,
      PasswordOld: PassOld,
    };
    if (KeyChangePass !== "" && CustomerID !== 0) {
      const data = await mainAction.API_spCallServer(
          "APIC_spCustomerResetPass_V2",
          params,
          dispatch
      );
      debugger;
      if (data != null) {
        Alertsuccess("Đổi mật khẩu thành công!");
        localStorage.setItem("login", "");
        window.location.href = "/login";
      } else {
        Alerterror("Đổi mật khẩu không thành công");
        setDisable(false);
      }
    } else {
      Alerterror("Yêu cầu đổi mật khẩu không hợp lệ");
      setDisable(false);
    }
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutLogin>
      <div className="content-login">
        <div className="container container-login">
          <div className="row">
            <div className="col-md-3">
              <Link to="/">
                <Img
                  src="../../assets/img/logo-gtel.png"
                  width="200"
                  className="margin-left-5"
                />
              </Link>
            </div>
            <div className="col-md-6">
              <h3 className="bold text-center">
                YÊU CẦU THAY ĐỔI <span className="red">MẬT KHẨU</span>
              </h3>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form method="#" action="#">
                <div className="row">
                  <label className="col-sm-4 col-form-label">
                    Mật khẩu mới <span className="red">(*)</span>
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <input
                        type={PassHide}
                        className="form-control"
                        ref={PasswordRef}
                        value={Password}
                        {...bindPassword}
                        disabled={disable}
                      />
                      <div className="input-group-append">
                        <span
                          className={
                            "fa fa-fw fa-eye input-group-text " + PassEye
                          }
                          onClick={(e) => {
                            setPassHide(PassEye === "" ? "text" : "password");
                            setPassEye(PassEye === "" ? "fa-eye-slash" : "");
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-4 col-form-label">
                    Nhập lại mật khẩu <span className="red">(*)</span>
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <input
                        className="form-control"
                        type={PassConfirmHide}
                        ref={PasswordConfirmRef}
                        value={PasswordConfirm}
                        {...bindPasswordConfirm}
                        disabled={disable}
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
                <div className="form-group text-center">
                  <button
                    type="button"
                    className="btn btn-fill login-button"
                    disabled={disable}
                    onClick={APIC_spCustomerResetPass}
                  >
                    đổi mật khẩu<div className="ripple-container"></div>
                  </button>
                </div>
                <div className="form-group text-center">
                  {Message + " "}
                  <Link className="green italic" to="/forgot">
                    Gửi lại yêu cầu đổi mật khẩu
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
};
