import React, { useState, useEffect, useRef } from "react";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alerterror, EncodeString } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { CustomerAction } from "../../Redux/Actions/Main";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import {
  APIKey,
  GOOGLE_LOGIN_CLIENTID,
  FACEBOOK_LOGIN_APPID,
} from "../../Services/Api";
import LayoutLogin from "../../Layout/LayoutLogin";

export const LoginV1Component = () => {
  const dispatch = useDispatch();

  const [Username, bindUserName, setUsername] = useInput("");
  const UsernameRef = useRef();

  const [Password, bindPassword, setPassword] = useInput("");
  const PasswordRef = useRef();

  const [LoginMessage, setLoginMessage] = useState("");
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();

  const [UserActive, setUserActive] = useState("");
  const [PassActive, setPassActive] = useState("");

  const [PassHide, setPassHide] = useState("password");
  const [PassEye, setPassEye] = useState("");

  useEffect(() => {
    
    localStorage.setItem("login", "");
    let currentDate = new Date();
    if (currentDate.getHours() < 12)
      setLoginMessage("Chào buổi sáng. Chúc bạn ngày mới tràn đầy năng lượng");
    else if (currentDate.getHours() > 12 && currentDate.getHours() < 18)
      setLoginMessage("Buổi chiều của bạn thế nào ?");
    else setLoginMessage("Hôm nay có gì mới ?");
  }, []);

  const onClickLogin = async () => {
    setDisable(true);
    setUserActive("");
    setPassActive("");
    if (Username === "") {
      Alerterror("Thông tin đăng nhập không được để trống");
      setUserActive("form-error");
      setDisable(false);
      return;
    } else if (Password === "") {
      Alerterror("Mật khẩu không được để trống");
      setUserActive("");
      setPassActive("form-error");
      setDisable(false);
      return;
    } else {
      let prj = {
        json: Password,
      };
      
      const pwd = await mainAction.EncryptString(prj, dispatch);
      let pr = {
        Json: '{"UserName":"' + Username + '","Password":"' + pwd + '"}',
        func: "APIC_spCustomerCheckLoginGroup",
      };
      console.log(pr)
      const data = await mainAction.API_spCallServer(pr, dispatch);
      let group = new Object();
      
      if (data.CustomerGroup.length > 0) {
        group.GroupId = data.CustomerGroup[0].Id;
        group.IsChooseCustomer = "Fail";
        group.Customers = data.Customers;
        group.GroupName = data.CustomerGroup[0].CustomerGroupName;
        let listC = ";";
        data.Customers.map((item) => {
          listC += item.CustomerID + ";";
        });
        group.CustomerIds = listC;

        let enscG = EncodeString(JSON.stringify(group));
        localStorage.setItem("GroupInfo", enscG);

        localStorage.setItem(
          "CustomerID",
          "9999" + data.Customers[0].CustomerID
        );
        //localStorage.setItem("Phone",data.Customers[0].Phone);

        let enscC = EncodeString(JSON.stringify(data.Customers[0]));
        localStorage.setItem("login", enscC);
        window.location.href = "/home";
      } else if (data.Customers.length === 1) {
        group.GroupId = 0;
        group.IsChooseCustomer = "True";
        group.Customers = [];

        let enscG = EncodeString(JSON.stringify(group));
        localStorage.setItem("GroupInfo", enscG);

        localStorage.setItem(
          "CustomerID",
          "9999" + data.Customers[0].CustomerID
        );
        //localStorage.setItem("Phone",data.Customers[0].Phone);

        let enscC = EncodeString(JSON.stringify(data.Customers[0]));
        localStorage.setItem("login", enscC);
        window.location.href = "/home";
      } else {
        Alerterror("Tài khoản hoặc mật khẩu không đúng");
      }
    }

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const responseFacebook = async (response) => {
    
    console.log(response);
    if (response.status !== "unknown") {
      let pr = {
        SocialID: response.authResponse.userID,
        SocialType: "Facebook",
        SocialLoginObj: response,
      };
      const params = {
        API_key: APIKey,
        Json: JSON.stringify(pr),
        func: "APIC_spCustomerSocialLoginV2",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        let ensc = EncodeString(JSON.stringify(list[0]));
        localStorage.setItem("login", ensc);
        window.location.href = "/home";
      } else {
        if (
          window.confirm(
            "Không có tài khoản nào liên kết với tài khoản facebook của bạn. Đến trang đăng ký"
          )
        ) {
          let obj = new Object();
          obj.Name = response.profileObj.name;
          obj.Email = response.profileObj.email;
          obj.GoogleId = response.profileObj.googleId;
          obj.FacebookId = "";
          obj.profileObj = response.profileObj;
          localStorage.setItem("registerSocial", JSON.stringify(obj));
          window.location.href = "/register";
        }
      }
    }
  };

  const responseGoogle = async (response) => {
    const params = {
      API_key: APIKey,
      Json: JSON.stringify({
        GoogleId: response.profileObj.googleId,
        SocialLoginObj: response.profileObj,
      }),
      func: "APIC_spCustomerSocialLoginV2",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);

    if (list.length > 0) {
      let ensc = EncodeString(JSON.stringify(list[0]));
      localStorage.setItem("login", ensc);
      window.location.href = "/home";
    } else {
      if (
        window.confirm(
          "Không có tài khoản nào liên kết với tài khoản google của bạn. Đến trang đăng ký"
        )
      ) {
        
        let obj = new Object();
        obj.Name = response.profileObj.name;
        obj.Email = response.profileObj.email;
        obj.GoogleId = response.profileObj.googleId;
        obj.FacebookId = "";
        obj.profileObj = response.profileObj;
        localStorage.setItem("registerSocial", JSON.stringify(obj));
        window.location.href = "/register";
      }
    }
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
            <div className="col-md-6 hide-sm">
              <h3 className="bold">
                <span className="red">GTELPOST</span> CÓ GÌ HOT ?
              </h3>
              <div className="row margin-top-10">
                <div className="col-md-12 margin-top-10">
                  <h4 className="bold">
                    {" "}
                    <Img
                      src="/assets/img/tick.png"
                      className="logocustom"
                      width="20"
                    />{" "}
                    Vận chuyển an toàn{" "}
                  </h4>
                  <div className="italic sm">
                    {" "}
                    Hàng hóa của khách hàng được bảo đảm an toàn tới tay người
                    nhận{" "}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="bold">
                    {" "}
                    <Img
                      src="/assets/img/tick.png"
                      className="logocustom"
                      width="20"
                    />{" "}
                    Hỗ trợ tư vấn linh hoạt{" "}
                  </h4>
                  <div className="italic sm">
                    {" "}
                    Khách hàng luôn được chăm sóc chu đáo - nhiệt tình ở mọi
                    thời điểm{" "}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="bold">
                    {" "}
                    <Img
                      src="/assets/img/tick.png"
                      className="logocustom"
                      width="20"
                    />{" "}
                    Thanh toán dễ dàng{" "}
                  </h4>
                  <div className="italic sm">
                    {" "}
                    Phương thức thanh toán linh hoạt, tiện lợi mà vẫn giữ được
                    sự an toàn{" "}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="bold">
                    {" "}
                    <Img
                      src="/assets/img/tick.png"
                      className="logocustom"
                      width="20"
                    />{" "}
                    Vận chuyển đúng giờ{" "}
                  </h4>
                  <div className="italic sm">
                    {" "}
                    Luôn luôn đúng giờ là một ưu điểm tuyệt vời mà GTELPOST có
                    được{" "}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="bold">
                    <Img
                      src="/assets/img/tick.png"
                      className="logocustom"
                      width="20"
                    />{" "}
                    Nhân viên nhiệt tình
                  </h4>
                  <div className="italic sm">
                    {" "}
                    Nhân viên giao hàng nhiệt tình, luôn lắng nghe mọi ý kiến từ
                    khách hàng{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h3 className="bold mb10"> ĐĂNG NHẬP </h3>
              <div className="form-group mb30">
                Bạn chưa có tài khoản?
                <Link
                  style={{ color: "#2264D1" }}
                  className="bold"
                  to="/register"
                >
                  {" "}
                  Đăng ký ngay
                </Link>
              </div>
              <div className="form-group width60">
                <label for="exampleEmail">Email/số điện thoại </label>
                <input
                  type="text"
                  class={"form-control borradius3 " + UserActive}
                  id="exampleEmail"
                  ref={UsernameRef}
                  value={Username}
                  {...bindUserName}
                  placeholder="Nhập Email hoặc số điện thoại"
                />
              </div>
              <div className="form-group margin-top-20 width60">
                <label for="examplePass">Mật khẩu</label>
                <div className="input-group">
                  <input
                    type={PassHide}
                    class={"form-control borradius3 " + PassActive}
                    id="examplePass"
                    placeholder="Nhập mật khẩu"
                    ref={PasswordRef}
                    value={Password}
                    {...bindPassword}
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
              <div
                className="form-group width60"
                style={{ color: "grey", marginTop: "-5px" }}
              >
                <Link
                  className="pull-right"
                  style={{ color: "#3e3838" }}
                  to="/forgot"
                >
                  Quên mật khẩu ?
                </Link>
              </div>
              <div className="form-group text-center margin-top-20 width60">
                <button
                  type="button"
                  style={{ width: "100%" }}
                  className="margin-top-20 btn text-transform btn-sm btn-save"
                  onClick={onClickLogin}
                >
                  Đăng nhập<div className="ripple-container"></div>
                </button>
              </div>

              <div className="gg">
                {/* <FacebookLogin
                  appId={FACEBOOK_LOGIN_APPID}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  icon="fa-facebook"
                  cssClass="btn btn-info btnFacebook"
                  textButton="Login with Facebook"
                /> */}
                <GoogleLogin
                  clientId={GOOGLE_LOGIN_CLIENTID}
                  buttonText="Đăng nhập nhanh với Google"
                  onSuccess={responseGoogle}
                  icon="fa-google"
                  cssClass=""
                />
              </div>
              <div className="italic margin-top-15  mb30">{LoginMessage}</div>
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
};
