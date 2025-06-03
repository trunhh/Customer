import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  DecodeString,
  EncodeString,
  GetCookie,
  GetCookieGroup,
  getData,
  setData,
} from "../../Utils";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { useInput } from "../../Hooks";
import { LANE } from "../../Enum";
import I18n from "../../Language";

export const HeaderMenu = () => {
  const dispatch = useDispatch();
  const [LangName, setLangName] = useState(I18n.t("Header.Vietnamese"));
  const [LangIcon, setLangIcon] = useState("/assets/img/vn.png");

  const [Codesearch, bindCodesearch, setCodesearch] = useInput("");
  const [CustomerGroup, setCustomerGroup] = useState(
    GetCookie("CustomerGroupId")
  );
  const [Customers, setCustomers] = useState([]);
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [CurrentName, setCurrentName] = useState("");
  useEffect(() => {
    //#region Đa ngôn ngữ hệ thống
    initialLanguage();
    //#endregion
    if (CustomerID === null) window.location.href = "/login";

    if (CustomerGroup !== "0") {
      APIC_spCustomerGetByGroup(CustomerGroup);
    }
    if (GetCookieGroup("IsChooseCustomer") === "True")
      setCurrentName(GetCookie("CustomerCode"));
    else setCurrentName("Nhóm KH: " + GetCookieGroup("GroupName"));
  }, []);

  const APIC_spCustomerGetByGroup = async (group) => {
    if (group !== 0) {
      /* let pr = {
        Json: "{\"GroupId\":" + group + "}",
        func: "APIC_spCustomerGetByGroupJson",
        API_key: APIKey,
        TokenDevices: TOKEN_DEVICE,
      };
      const data = await mainAction.API_spCallServer(pr, dispatch); */
      setCustomers(GetCookieGroup("Customers"));
    }
  };

  const setNewCookie = async (item) => {
    let ensc = EncodeString(JSON.stringify(item));
    localStorage.setItem("login", ensc);
    updateCookie("True");
    window.location.reload();
  };

  const updateCookie = (key) => {
    let group = JSON.parse(DecodeString(localStorage.getItem("GroupInfo")));
    group.IsChooseCustomer = key;
    let enscG = EncodeString(JSON.stringify(group));
    localStorage.setItem("GroupInfo", enscG);
    window.location.reload();
  };

  const onClickLogout = async () => {
    localStorage.setItem("login", "");
    localStorage.setItem("GroupInfo", "");
    window.location.href = "/";
  };

  const Link = (Codesearch) => {
    window.location.href = "/tra-cuu-van-don?code=" + Codesearch.trim();
  };
  const onKeyUp = (e) => {
    if (e.charCode == 13) {
      Link(Codesearch);
    }
  };

  //#region đa ngôn ngữ hệ thống
  const changeLanguage = async (keylang) => {
    let lang = await getData(LANE);

    let params = {
      language: keylang,
      Type: 1,
    };
    const language = await mainAction.changeLanguage(params, dispatch);
    await setData(LANE, JSON.stringify(language));
    //#region đa ngôn ngữ leftmenu
    localStorage.setItem("keyLang", keylang);
    window.location.reload();
    //#endregion
  };

  const initialLanguage = () => {
    dispatch(mainAction.checkLanguage(null));
    const keyLang = localStorage.getItem("keyLang");
    if (keyLang !== "EN" && keyLang !== "en") {
      setLangName("Tiếng Việt");
      setLangIcon("/assets/img/vn.png");
      localStorage.setItem("keyLang", "VN");
    } else {
      setLangName("English");
      setLangIcon("/assets/img/en.png");
    }
  };
  //#endregion

  const MenuNoGroup = (
    <ul className="navbar-nav">
      <li className="nav-item dropdown hide-sm">
        <a
          className="nav-link height50"
          href="#"
          id="navbarDropdownGroup"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div>
            <span className="CustomerName">{CurrentName}</span>
          </div>
          <div style={{ float: "right", marginBottom: "7px" }}>
            <span style={{ textTransform: "capitalize", color: "#9696A0" }}>
              Manager Account
            </span>
            <i
              className="material-icons"
              style={{ fontSize: "17px", top: "1px", color: "#9696A0" }}
            >
              expand_more
            </i>
          </div>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="navbarDropdownGroup"
        >
          <a className="dropdown-item" href="#" onClick={onClickLogout}>
            Đăng xuất
          </a>
        </div>
      </li>
      <li className="nav-item dropdown hide-sm left-25s">
        <img
          src={GetCookie("LinkAvatar")}
          className="CustomerAvartar"
          width="100"
        />
      </li>
      <li className="nav-item dropdown hide-sm">
        <a
          className="nav-link"
          href="#"
          id="navbarDropdownGroup"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div>
            <img
              src="../assets/img/vn.png"
              style={{ borderRadius: "3px" }}
              width="25px"
            />
            <i
              className="material-icons"
              style={{ fontSize: "22px", top: "2px", color: "#9696A0" }}
            >
              arrow_drop_down
            </i>
          </div>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="navbarDropdownGroup"
        >
          <a className="dropdown-item bor-bottom" href="#">
            <img
              src="../assets/img/vn.png"
              style={{ borderRadius: "3px", marginRight: "8px" }}
              width="30"
            />{" "}
            VIETNAM
          </a>
          <a className="dropdown-item" href="#">
            <img
              src="../assets/img/en.png"
              style={{ borderRadius: "3px", marginRight: "8px" }}
              width="30"
            />{" "}
            ENGLISH
          </a>
        </div>
      </li>
    </ul>
  );

  const MenuHaveGroup = (
    <ul className="navbar-nav mt0">
      <li className="nav-item dropdown">
        <a
          className="nav-link"
          href="javascript:;"
          id="navbarDropdownGroup"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i
            className="material-icons"
            style={{ marginRight: "10px", color: "#00884E" }}
          >
            group
          </i>
          <span>{CurrentName}</span>
          <i
            className="material-icons"
            style={{ fontSize: "22px", top: "2px", color: "#9696A0" }}
          >
            arrow_drop_down
          </i>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right header-scroll"
          aria-labelledby="navbarDropdownGroup"
        >
          <a
            className="dropdown-item"
            key={0}
            href="#"
            onClick={() => {
              setCurrentName("Nhóm KH: " + GetCookieGroup("GroupName"));
              updateCookie("Fail");
            }}
          >
            {"Nhóm KH: " + GetCookieGroup("GroupName")}
          </a>
          {Customers.map((item, index) => {
            return (
              <a
                className={
                  item.CustomerId === CustomerID
                    ? "active dropdown-item"
                    : "dropdown-item"
                }
                key={index}
                href="#"
                onClick={() => setNewCookie(item)}
              >
                {item.CustomerCode + " - " + item.CustomerName}
              </a>
            );
          })}
        </div>
      </li>
      <li className="nav-item dropdown hide-sm">
        <a
          className="nav-link"
          href="#"
          id="navbarDropdownGroup"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div>
            <img
              src="../assets/img/vn.png"
              style={{ borderRadius: "3px" }}
              width="25px"
            />
            <i
              className="material-icons"
              style={{ fontSize: "22px", top: "2px", color: "#9696A0" }}
            >
              arrow_drop_down
            </i>
          </div>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="navbarDropdownGroup"
        >
          <a className="dropdown-item bor-bottom" href="#">
            <img
              src="../assets/img/vn.png"
              style={{ borderRadius: "3px", marginRight: "8px" }}
              width="30"
            />{" "}
            VIETNAM
          </a>
          <a className="dropdown-item" href="#">
            <img
              src="../assets/img/en.png"
              style={{ borderRadius: "3px", marginRight: "8px" }}
              width="30"
            />{" "}
            ENGLISH
          </a>
        </div>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-absolute fixed-top">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <a className="navbar-brand simple-text logo-normal" href="/home">
            <img src="/assets/img/logo-gtel.png" alt="GTELPOST" width="100" />
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="navbar-toggler-icon icon-bar"></span>
          <span className="navbar-toggler-icon icon-bar"></span>
          <span className="navbar-toggler-icon icon-bar"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center">
          <div className="input-group no-border">
            <i
              className="material-icons iconsearch"
              onClick={() => Link(Codesearch)}
            >
              search
            </i>
            <input
              type="text"
              className="form-control border-search"
              placeholder="Tìm kiếm mã vận đơn"
              value={Codesearch}
              {...bindCodesearch}
              onKeyPress={(e) => {
                onKeyUp(e);
              }}
              style={{ width: "350px" }}
            />
          </div>
        </div>
        <div
          className="collapse navbar-collapse justify-content-end"
          style={{ height: "35px" }}
        >
          {CustomerGroup === 0 ? MenuNoGroup : MenuHaveGroup}
        </div>
      </div>
    </nav>
  );
};
