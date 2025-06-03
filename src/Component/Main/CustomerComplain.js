import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Alertsuccess,
  Alerterror,
  ValidPhone,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { NoCustomer } from "../../Common";
import LayoutMain from "../../Layout/LayoutMain";

export const CustomerComplain = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button;

  const history = useHistory();
  const location = useLocation();

  const [LadingCode, setLadingCode] = useState("");
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [Name, setName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Type, setType] = useState(0);
  const [Content, setContent] = useState("");

  const NameRef = useRef();
  const PhoneRef = useRef();
  const LadingCodeRef = useRef();

  //#region validation
  const [ErrType, setErrType] = useState("");
  const [ErrName, setErrName] = useState("");
  const [ErrPhone, setErrPhone] = useState("");
  const [ErrContent, setErrContent] = useState("");
  //#endregion end validation

  /* run after render */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null)
      history.push("/");

    setName(GetCookie("CustomerName"));
    setPhone(GetCookie("Phone"));

    location.Code === undefined
      ? setLadingCode("")
      : setLadingCode(location.Code);
  }, []);

  const APIC_spCustomerComplain = async () => {
    debugger;


    if (Type === 0 || Type === "0") {
      Alerterror("Vui lòng chọn loại khiếu nại");
      setErrType("form-error");
      return;
    } else setErrType("");

    if (Name === "") {
      Alerterror("Vui lòng nhập tên người khiếu nại");
      setErrName("form-error");
      return;
    } else setErrName("");

    if (Phone === "") {
      Alerterror("Vui lòng nhập số điện thoại");
      setErrPhone("form-error");
      return;
    } else setErrPhone("");

    if (ValidPhone(Phone) !== "") {
      Alerterror("Số điện thoại không đúng định dạng");
      setErrPhone("form-error");
      return;
    }
    else if (LadingCode !== "") {
      const Codearr = [];
      const uniqueSet = new Set(LadingCode.split(","));
      const backToArray = [...uniqueSet];
      if (backToArray.length > 10) {
        Alerterror("Vui lòng nhập tối đa 10 vận đơn!");
        setErrContent("form-error");
        return;
      }
    }
    else if (Content === "") {
      Alerterror("Vui lòng nhập nội dung khiếu nại");
      setErrContent("form-error");
      return;
    }

    else setErrContent("");

    try {

      let params = {
        CustomerId: CustomerID,
        Name: Name,
        Phone: Phone,
        LadingCode: LadingCode,
        Type: parseInt(Type),
        Content: Content,
        SendFrom: "TRÊN WEBSITE CUSTOMER",
      };
      setDisable(true); // disable button
      const pr = {
        Json: JSON.stringify(params),
        func: "APIC_spCustomerComplain_JsonAuto",
        API_key: APIKey,
        TokenDevices: TOKEN_DEVICE,
      };
      // call redux saga
      const result = await mainAction.API_spCallServer(pr, dispatch);
      // call redux saga
      mainAction.LOADING({ IsLoading: false }, dispatch);
      Alertsuccess("Thành công");
      APIC_spCustomerComplain_Clear();
      const NotifiParam = {
        Json: JSON.stringify({
          CustomerId: CustomerID,
          FuncSend: "ComplainCreate",
          SendFrom: "WEB CUSTOMER",
          JsonData: [
            {
              Name: Name,
              Phone: Phone,
              Content: Content,
            },
          ],
        }),
        func: "APIC_spSendNotification",
        API_key: APIKey,
      };
      const resultNotify = await mainAction.API_spCallServer(
        NotifiParam,
        dispatch
      );
      mainAction.LOADING({ IsLoading: false }, dispatch);
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      setDisable(false);
    }
  };

  const APIC_spCustomerComplain_Clear = () => {
    setName("");
    setPhone("");
    setLadingCode("");
    setContent("");
    setDisable(false); // disable button
  };
  const RegPhone = (e) => {
    let result = ValidPhone(e);
    setErrPhone(result);
    setPhone(e);
  };
  return (
    <LayoutMain>
      {GetCookieGroup("IsChooseCustomer") === "True" ? (<>
        <div className="container-fluid">
          <div className="row Formlading">
            <div className="col-md-12 HomeTitle margin-top-10">
              Khiếu nại đơn hàng
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group bmd-form-group">
                    <label className="no-absolute">
                      Loại khiếu nại <span className="red">(*)</span>
                    </label>
                    <select
                      style={{ height: '37px' }}
                      className={"top0 form-control " + ErrType}
                      value={Type}
                      onChange={(e) => {
                        setType(e.target.value);
                        e.target.value === "0"
                          ? setErrType("form-error")
                          : setErrType("");
                      }}
                    >
                      <option value="0">Chọn loại khiếu nại</option>
                      <option value="1">Khiếu nại về dịch vụ</option>
                      <option value="2">Khiếu nại về cước phí</option>
                      <option value="3">Khiếu nại về COD</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="no-absolute">
                      Tên người khiếu nại <span className="red">(*)</span>
                    </label>
                    <input
                      type="text"
                      className={"form-control " + ErrName}
                      ref={NameRef}
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="no-absolute">
                      Số điện thoại liên hệ <span className="red">(*)</span>
                    </label>
                    <input
                      type="text"
                      className={"form-control " + ErrPhone}
                      ref={PhoneRef}
                      value={Phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        RegPhone(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="no-absolute">Mã vận đơn</label>
                    <input
                      type="text"
                      className="form-control"
                      value={LadingCode}
                      onChange={(e) => setLadingCode(e.target.value)}
                      placeholder='Nhập tối đa 10 mã vận đơn cách nhau bằng dấu","'
                    />
                  </div>
                </div>
                <div className="col-md-12 margin-bottom-20">
                  <div className="form-group">
                    <label className="no-absolute">
                      Nội dung khiếu nại <span className="red">(*)</span>
                    </label>
                    <textarea
                      className={"form-control " + ErrContent}
                      value={Content}
                      onChange={(e) => setContent(e.target.value)}
                      minLength="0"
                      maxLength="500"
                      rows="4"
                      placeholder="Nhập nội dung khiếu nại, hỗ trợ, góp ý ..."
                    />
                  </div>
                </div>

                <div className="clearfix"></div>
              </div>
            </div>
          </div>
          <div className="col-md-12 margin-top-20 text-center">
            <button
              type="submit"
              className="btn btn-sm text-transform btn-refeshno"
              disabled={disable}
              onClick={APIC_spCustomerComplain_Clear}
            >
              <i className="material-icons">undo</i>
              Hủy
            </button>
            <button
              type="button"
              className="btn text-transform btn-sm btn-save margin-left-10"
              disabled={disable}
              onClick={APIC_spCustomerComplain}
            >
              <i className="material-icons">headset_mic</i>
              Gửi Yêu Cầu
            </button>

          </div>
        </div>
      </>) : (<NoCustomer />)}
    </LayoutMain>
  );
};
