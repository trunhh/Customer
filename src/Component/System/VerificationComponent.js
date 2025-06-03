import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alertsuccess, Alerterror, GetCookie, EncodeString, GetCookieGroup } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { useInput } from "../../Hooks";
import LayoutMain from "../../Layout/LayoutMain";

export const VerificationComponent = () => {
  const dispatch = useDispatch();
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [Phone, setPhone] = useState(GetCookie("Phone"));
  const [SMSOTP, bindSMSOTP, setSMSOTP] = useInput("");
  const SMSOTPRef = useRef();

  const [disable, setDisable] = useState(false); // disable button

  const history = useHistory();

  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
    if (GetCookieGroup("IsChooseCustomer") === "Fail")
      window.location.href = "/home";
  }, []);

  const APIC_SendSMSOTP = async () => {
    setDisable(false);
    let params = {
      CustomerId: CustomerID,
      func:"APIC_SendSMSOTP"
    };
    const data = await mainAction.API_spCallServerNoSQL(params, dispatch);
    if (data.message === "Success") Alertsuccess(data.localMessage);
    else Alerterror(data.localMessage);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const APIC_spCustomerVerification = async () => {
    setDisable(false);
    let params = {
      CustomerId: CustomerID,
      SMSOTP: SMSOTP,
    };
    if (SMSOTP === "") {
      Alerterror("Nhập mã xác thực !");
      return;
    } else {
      const pr = {
        json: JSON.stringify(params),
        func: "APIC_spCustomerVerification_V1",
      };
      debugger
      const data = await mainAction.API_spCallServer(pr, dispatch);
      debugger
      if (data.resultCode === 0) {
        Alertsuccess("Xác thực thành công");
        let _customer = GetCookie("All");
        _customer.Vertification = 1;

        let ensc = EncodeString(JSON.stringify(_customer));
        localStorage.setItem("login", ensc);

        history.push("/tao-nhanh-van-don");
      } else {
        Alerterror(data.localMessage);
      }
    }
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row Forminfor">
          <div className="col-md-12 HomeTitle margin-top-20">Xác thực tài khoản</div>
          <div className="col-md-12 mt10">
            <form method="#" action="#">
              <div className="row margin-top-10">
                <label className="col-sm-12 font-weight500">Số điện thoại <span className="red">(*)</span></label>
                <div className="col-sm-12">
                  <div class="input-group">
                    <input type="phone" className="form-control" value={Phone} disable="true" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                    <div class="input-group-append">
                      <button id="inputGroup-sizing-sm" type="button" className="btn btn-warning btn-sm input-group-button" disabled={disable} onClick={APIC_SendSMSOTP} style={{ height: "35px", marginTop: "0" }}>
                        Gửi mã xác thực
                        <div className="ripple-container"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row margin-top-10">
                <label className="col-sm-12 font-weight500" style={{ marginTop: "-10px" }}>Nhập mã xác thực <span className="red">(*)</span></label>
                <div className="col-sm-12">
                  <input className="form-control" type="password" ref={SMSOTPRef} value={SMSOTP} {...bindSMSOTP} />
                </div>
              </div>
              <div className="form-group text-center">
                <button type="button" className="btn btn-danger btn-sm" disabled={disable} onClick={APIC_spCustomerVerification}>
                  Xác nhận<div className="ripple-container"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
