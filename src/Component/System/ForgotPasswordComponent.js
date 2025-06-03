import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alertsuccess, Alerterror } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { CustomerAction } from "../../Redux/Actions/Main";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import { APIKey } from "../../Services/Api";
import LayoutLogin from "../../Layout/LayoutLogin";

export const ForgotPasswordComponent = () => {
  const dispatch = useDispatch();

  const [Email, bindEmail, setEmail] = useInput("");
  const EmailRef = useRef();

  const [disable, setDisable] = useState(false); // disable button
  /* run after render */
  useEffect(() => {
  }, []);

  const APIC_CustomerSendEmailForgot = async () => {
    setDisable(false);
    let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (Email === "") {
      Alerterror("Vui lòng nhập Email");
      return;
    } else if (!pattern.test(Email)) {
      Alerterror("Email không đúng định dạng");
      return;
    }
    let params = {
      AppAPIKey: APIKey,
      Email: Email,
    };
    const data = await CustomerAction.APIC_CustomerSendEmailForgot(params, dispatch);
    if (data.resultCode === 0) {
      setDisable(true);
      Alertsuccess(data.localMessage);
    }
    else
      Alerterror(data.localMessage);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const HandleKeyDown = (e) => {
    if (e.key === 'Enter') {
      APIC_CustomerSendEmailForgot();
    }
  }

  return (
    <LayoutLogin>
    <div className="content-login">
      <div className="container container-login">
        <div className="row">
          <div className="col-md-3">
            <Img
              src="../../assets/img/logo-gtel.png"
              className="margin-left-5"
              width="200"
            />
          </div>
          <div className="col-md-6">
            <h3 className="bold text-center">
              YÊU CẦU THAY ĐỔI MẬT KHẨU
            </h3>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row text-center">
          <div className="col-md-12 width60">
            <label className="">
              Email <span className="red">(*)</span>
            </label>
            <div className="col-md-12 text-center">
              <div className=""><input
                type="email"
                className="form-control"
                ref={EmailRef}
                value={Email}
                {...bindEmail}
                disabled={disable}
                onKeyDown={(e) => HandleKeyDown(e)}
              /></div>
            </div>
            <div className="form-group text-center">
              <button
                type="button"
                className="btn text-transform btn-sm btn-save"
                disabled={disable}
                onClick={APIC_CustomerSendEmailForgot}
              >
                Gửi yêu cầu<div className="ripple-container"></div>
              </button>
            </div>
            <div className="form-group text-center bold">
              Đến trang{" "}
              <Link className="red" to="/login">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LayoutLogin>
  );
};
