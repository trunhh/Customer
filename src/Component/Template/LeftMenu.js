import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { GetCookie, Alerterror, GetModule, GetCookieGroup } from "../../Utils";
import { mainAction } from "../../Redux/Actions";

export const LeftMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [IsAvery, setIsAvery] = useState("display-none");
  const [ShowMainMenu, setShowMainMenu] = useState(true);

  useEffect(() => {
    if (CustomerID === null)
      window.location.href = "/";

    if (GetCookie("CustomerGroupId") === 6)
      setIsAvery("");

    if (GetCookieGroup("IsChooseCustomer") === "Fail")
      setShowMainMenu(false);
  }, []);

  useEffect(() => {
    System_spLogModule_Save(location.pathname);
  }, [location]);

  //#region  lưu log hệ thống
  const System_spLogModule_Save = async (ActionName) => {
    const prl = GetModule(ActionName);
    prl.UserId = GetCookie("CustomerID")
    const paramsl = {
      Json: JSON.stringify(prl),
      func: "CPN_spLogModule_Save",
    }
    const result = await mainAction.API_spCallServer(paramsl, dispatch);
    console.log(result);
    //#endregion
  };
  //#endregion

  const onClickLogout = () => {
    localStorage.setItem("login", "");
    localStorage.setItem("GroupInfo", "");
    window.location.href = "/";
  };

  return (
    <div
      className="sidebar ps"
      data-color="purple"
      data-background-color="white"
    /* data-image="../assets/img/sidebar-1.jpg" */
    >
      <div className="logo text-center">
        <div className="btn btn-just-icon btn-white btn-fab">
          <i className="material-icons design_bullet-list-67 green">
            menu_open
          </i>
        </div>
      </div>
      <div className="sidebar-wrapper ps-container ps-theme-default">
        <ul className="nav mt0">
          <li className={"border-bottom nav-item " + (
            location.pathname === "/home"
              ? "active"
              : "")}>
            <Link className="nav-link" to="/home">
              <i className="material-icons mt5">home</i>
              <p> Trang chủ</p>
            </Link>
          </li>
          <li
            className={
              "border-bottom nav-item " +
              (location.pathname === "/lo-trinh-giao-hang"
                ? "active"
                : "")
            }
          >
            <Link className="nav-link" to="/lo-trinh-giao-hang">
              <i className="material-icons mt5">insights</i>
              <p>Xem lộ trình giao hàng</p>
            </Link>
          </li>
          <li
            className={
              "border-bottom nav-item " +
              (location.pathname === "/tao-nhanh-van-don" ||
                location.pathname === "/upload-excel-van-don" ||
                location.pathname === "/tim-kiem-van-don" ||
                location.pathname === "/goi-lay-hang" ||
                location.pathname === "/danh-sach-goi-lay-hang" ||
                location.pathname === "/danh-sach-goi-lay-hang"
                ? "active"
                : "")
            }
          >
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#ladingnav"
              aria-expanded="false"
            >
              <i className="material-icons">content_paste</i>
              <p>
                Quản lý đơn hàng <b className="caret"></b>
              </p>
            </a>
            <div className="collapse" id="ladingnav">
              <ul className="nav">
                <li className={"nav-item " + (location.pathname === "/tao-nhanh-van-don" ? "active" : "")}>
                  <Link className="nav-link" to="/tao-nhanh-van-don">
                    <i className="material-icons mt5">shopping_cart</i>
                    <span className="sidebar-normal"> Tạo nhanh vận đơn</span>
                  </Link>
                </li>
                <li className={"nav-item " + (location.pathname === "/upload-excel-van-don" ? "active" : "")}>
                  <Link className="nav-link" to="/upload-excel-van-don">
                    <i className="material-icons mt5">shopping_cart</i>
                    <span className="sidebar-normal">
                      {" "}
                      Upload excel vận đơn
                    </span>
                  </Link>
                </li>

                <li className={"nav-item " + (location.pathname === "/tim-kiem-van-don" ? "active" : "")}>
                  <Link className="nav-link" to="/tim-kiem-van-don">
                    <i className="material-icons mt5">search</i>
                    <span className="sidebar-normal"> Danh sách vận đơn</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li className={"border-bottom nav-item " + (location.pathname === "/uoc-tinh-cuoc-phi" || location.pathname === "/thoi-gian-toan-trinh-phat-hang-dich-vu" ? "active" : "")}>
            <a className="nav-link" data-toggle="collapse" href="#pricenav" aria-expanded="false">
              <i className="material-icons">list</i>
              <p>
                Cước phí - Thời gian <b className="caret"></b>
              </p>
            </a>
            <div className="collapse" id="pricenav">
              <ul className="nav">
                <li className={"nav-item " + (location.pathname === "/uoc-tinh-cuoc-phi" ? "active" : "")}>
                  <Link className="nav-link" to="/uoc-tinh-cuoc-phi">
                    <i className="material-icons mt5">fact_check</i>
                    <span className="sidebar-normal"> Ước tính cước phí</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname ===
                      "/thoi-gian-toan-trinh-phat-hang-dich-vu"
                      ? "active"
                      : "")
                  }
                >
                  <Link
                    className="nav-link"
                    to="/thoi-gian-toan-trinh-phat-hang-dich-vu"
                  >
                    <i className="material-icons mt5">watch_later</i>
                    <span className="sidebar-normal">
                      {" "}
                      Toàn trình phát theo DV
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li
            className={
              "border-bottom nav-item " +
              (location.pathname === "/ho-tro-don-hang" ||
                location.pathname === "/danh-sach-ho-tro-don-hang"
                ? "active"
                : "")
            }
          >
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#complainnav"
              aria-expanded="false"
            >
              <i className="material-icons">record_voice_over</i>
              <p>
                Hỗ trợ đơn hàng <b className="caret"></b>
              </p>
            </a>
            <div className="collapse" id="complainnav">
              <ul className="nav">
                  <li
                    className={
                      "nav-item " +
                      (location.pathname === "/ho-tro-don-hang" ? "active" : "")
                    }
                  >
                    <Link to="/ho-tro-don-hang" className="nav-link">
                      <i className="material-icons mt5">settings_phone</i>
                      <span className="sidebar-normal">Khiếu nại đơn hàng</span>
                    </Link>
                  </li>
                <li
                  className={
                    "nav-it em " +
                    (location.pathname === "/danh-sach-ho-tro-don-hang"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/danh-sach-ho-tro-don-hang" className="nav-link">
                    <i className="material-icons mt5">perm_contact_calendar</i>
                    <span className="sidebar-normal">Lịch sử khiếu nại</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li
            className={
              "border-bottom nav-item " +
              (location.pathname === "/cong-no-tam-tinh" ||
                location.pathname === "/bang-ke-thanh-toan" ||
                location.pathname === "/bao-cao-tong-quan" ||
                location.pathname === "/bao-cao-kpi-giao-hang-cod" ||
                location.pathname === "/bao-cao-ton-no" ||
                location.pathname === "/bao-cao-dealine-thanh-toan"
                ? "active"
                : "")
            }
          >
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#reportnav"
              aria-expanded="false"
            >
              <i className="material-icons">pie_chart</i>
              <p>
                Báo cáo <b className="caret"></b>
              </p>
            </a>
            <div className="collapse" id="reportnav">
              <ul className="nav">
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/cong-no-tam-tinh" ? "active" : "")
                  }
                >
                  <Link to="/cong-no-tam-tinh" className="nav-link">
                    <i className="material-icons mt5">dns</i>
                    <span className="sidebar-normal">Công nợ tạm tính</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bang-ke-thanh-toan"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/bang-ke-thanh-toan" className="nav-link">
                    <i className="material-icons mt5">credit_card</i>
                    <span className="sidebar-normal">Bảng kê thanh toán</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-tong-quan" ? "active" : "")
                  }
                >
                  <Link to="/bao-cao-tong-quan" className="nav-link">
                    <i className="material-icons">insights</i>
                    <span className="sidebar-normal">Kết quả giao hàng</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-kpi-giao-hang-cod"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/bao-cao-kpi-giao-hang-cod" className="nav-link">
                    <i className="material-icons mt5">bubble_chart</i>
                    <span className="sidebar-normal">Kpi giao hàng COD</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bang-ke-thanh-toan-cod"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/bang-ke-thanh-toan-cod" className="nav-link">
                    <i className="material-icons mt5">bubble_chart</i>
                    <span className="sidebar-normal">Bảng kê thanh toán COD</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-ton-no" ? "active" : "")
                  }
                >
                  <Link to="/bao-cao-ton-no" className="nav-link">
                    <i className="material-icons mt5">pie_chart</i>
                    <span className="sidebar-normal">Báo cáo tồn nợ</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-dealine-thanh-toan"
                      ? "active"
                      : "")
                  }
                >
                  <Link className="nav-link" to="/bao-cao-dealine-thanh-toan">
                    <i className="material-icons mt5">bar_chart</i>
                    <span className="sidebar-normal">Thời hạn thanh toán</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li
            className={
              "border-bottom nav-item " +
              IsAvery +
              " " +
              (location.pathname === "/in-bill-tu-excel" ? "active" : "")
            }
          >
            <Link className="nav-link" to="/in-bill-tu-excel">
              <i className="material-icons">unarchive</i>
              <p>AVERY - IN BILL</p>
            </Link>
          </li>
          <li
            className={
              "border-bottom nav-item " +
              (location.pathname === "/mang-luoi-buu-cuc" ? "active" : "")
            }
          >
            <Link className="nav-link" to="/mang-luoi-buu-cuc">
              <i className="material-icons">room</i>
              <p>Mạng lưới bưu cục</p>
            </Link>
          </li>
          {ShowMainMenu ? (<>
            <li
              className={
                "border-bottom margin-bottom-20 nav-item " +
                (location.pathname === "/thong-tin-ca-nhan" ||
                  location.pathname === "/dia-chi-gui-thuong-xuyen" ||
                  location.pathname === "/dia-chi-nhan-thuong-xuyen" ||
                  location.pathname === "/doi-mat-khau" ||
                  location.pathname === "/xac-thuc-tai-khoan"
                  ? "active"
                  : "")
              }
            >
              <a
                className="nav-link"
                data-toggle="collapse"
                href="#settingnav"
                aria-expanded="false"
              >
                <i className="material-icons">list</i>
                <p>
                  Cài đặt tài khoản <b className="caret"></b>
                </p>
              </a>
              <div className="collapse" id="settingnav">
                <ul className="nav">
                  <li
                    className={
                      "nav-item " +
                      (location.pathname === "/thong-tin-ca-nhan" ? "active" : "")
                    }
                  >
                    <Link className="nav-link" to="/thong-tin-ca-nhan">
                      <i className="material-icons mt5">account_circle</i>
                      <span className="sidebar-normal"> Thông tin tài khoản</span>
                    </Link>
                  </li>
                  <li
                    className={
                      "nav-item " +
                      (location.pathname === "/doi-mat-khau" ? "active" : "")
                    }
                  >
                    <Link className="nav-link" to="/doi-mat-khau">
                      <i className="material-icons mt5">swap_horiz</i>
                      <span className="sidebar-normal"> Đổi mật khẩu</span>
                    </Link>
                  </li>
                  {(GetCookie("Verification") === 0 && GetCookie("TypeCustomer") === 2) || GetCookie("CustomerID") === 34232 ? (<li
                    className={
                      "nav-item " +
                      (location.pathname === "/xac-thuc-tai-khoan"
                        ? "active"
                        : "")
                    }
                  >
                    <Link className="nav-link" to="/xac-thuc-tai-khoan">
                      <i className="material-icons mt5">fact_check</i>
                      <span className="sidebar-normal"> Xác thực tài khoản</span>
                    </Link>
                  </li>) : (<></>)}
                  <li
                    className={
                      "nav-item " +
                      (location.pathname === "/dia-chi-gui-thuong-xuyen"
                        ? "active"
                        : "")
                    }
                  >
                    <Link className="nav-link" to="/dia-chi-gui-thuong-xuyen">
                      <i className="material-icons mt5">location_on</i>
                      <span className="sidebar-normal">
                        {" "}
                        Địa chỉ gửi thường xuyên
                      </span>
                    </Link>
                  </li>
                  <li
                    className={
                      "nav-item " +
                      (location.pathname === "/dia-chi-nhan-thuong-xuyen"
                        ? "active"
                        : "")
                    }
                  >
                    <Link className="nav-link" to="/dia-chi-nhan-thuong-xuyen">
                      <i className="material-icons mt5">location_on</i>
                      <span className="sidebar-normal">
                        {" "}
                        Địa chỉ nhận thường xuyên
                      </span>
                    </Link>
                  </li>
                  <li
                    className={
                      "hide-md nav-item " +
                      (location.pathname === "/dia-chi-nhan-thuong-xuyen"
                        ? "active"
                        : "")
                    }
                  >
                    <a className="nav-link" href="#" onClick={onClickLogout}>
                      <i className="material-icons mt5">logout</i>
                      <span className="sidebar-normal"> Đăng xuất</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </>) : (<></>)}
          <li
            className={
              "border-bottom nav-item " +
              (location.pathname === "/bao-cao-nhap-kho" ||
                location.pathname === "/bao-cao-xuat-kho" ||
                location.pathname === "/bao-cao-ton-kho" ||
                location.pathname === "/bao-cao-chuyen-kho"
                ? "active"
                : "")
            }
          >
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#reportwarehousenav"
              aria-expanded="false"
            >
              <i className="material-icons">pie_chart</i>
              <p>
                Báo cáo kho <b className="caret"></b>
              </p>
            </a>
            <div className="collapse" id="reportwarehousenav">
              <ul className="nav">
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-nhap-kho" ? "active" : "")
                  }
                >
                  <Link to="/bao-cao-nhap-kho" className="nav-link">
                    <i className="material-icons mt5">dns</i>
                    <span className="sidebar-normal">Báo cáo nhập kho</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-xuat-kho"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/bao-cao-xuat-kho" className="nav-link">
                    <i className="material-icons mt5">credit_card</i>
                    <span className="sidebar-normal">Báo cáo xuất kho</span>
                  </Link>
                </li>
                {/*  <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-chuyen-kho" ? "active" : "")
                  }
                >
                  <Link to="/bao-cao-chuyen-kho" className="nav-link">
                    <i className="material-icons">insights</i>
                    <span className="sidebar-normal">Báo cáo chuyển kho</span>
                  </Link>
                </li> */}
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-ton-kho"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/bao-cao-ton-kho" className="nav-link">
                    <i className="material-icons mt5">bubble_chart</i>
                    <span className="sidebar-normal">Báo cáo tồn kho</span>
                  </Link>
                </li>
                <li
                  className={
                    "nav-item " +
                    (location.pathname === "/bao-cao-ton-kho-npt"
                      ? "active"
                      : "")
                  }
                >
                  <Link to="/bao-cao-ton-kho-npt" className="nav-link">
                    <i className="material-icons mt5">bubble_chart</i>
                    <span className="sidebar-normal">Báo cáo tồn kho npt</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          {/*  <li className="nav-item logout" onClick={onClickLogout}>
            <Link className="nav-link">
              <i className="material-icons mt5">logout</i>
              <p> Đăng xuất</p>
            </Link>
          </li> */}
        </ul>
        {/*   <ul className="nav mt0">
        <li className="border-bottom nav-item " onClick={onClickLogout}>
             <Link className="nav-link" style={{border:'1px solid #00884E'}}>
              <i className="material-icons" style={{color:'#00884E'}}>logout</i>
              <p  style={{color:'#00884E'}}> Đăng xuất</p>
            </Link>
          </li>
        </ul> */}
        <div className="ps-scrollbar-x-rail">
          <div className="ps-scrollbar-x" tabIndex="0"></div>
        </div>
        <div className="ps-scrollbar-y-rail">
          <div className="ps-scrollbar-y" tabIndex="0"></div>
        </div>
      </div>
      <div className="bottommenu">
        {/*   <div className="btn btn-just-icon btn-white btn-fab">
          <i className="material-icons design_bullet-list-67 green">
            menu_open
          </i>
        </div> */}
        <ul className="sidebar-wrapper nav mt0">
          <li className="border-bottom nav-item " onClick={onClickLogout}>
            <Link className="nav-link" style={{ border: '1px solid #00884E', textAlign: 'center' }}>
              <i className="material-icons" style={{ color: '#00884E', marginRight: '25px' }}>logout</i>
              <p style={{ color: '#00884E', paddingLeft: '30px' }}> Đăng xuất</p>
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-background"></div>
    </div>
  );
};
