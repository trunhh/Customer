import React, { useEffect } from "react";
import { DecodeString } from "../../Utils";
import { useState } from "react";

export const FooterMenu = () => {
  const [_customer, setCustomer] = useState({});

  useEffect(() => {
    if (
      localStorage.getItem("login") !== "" &&
      localStorage.getItem("login") !== undefined &&
      localStorage.getItem("login") !== null
    ) {
      try{
        let _strC = DecodeString(localStorage.getItem("login"));
        let _customerInfo = JSON.parse(_strC);
        setCustomer(_customerInfo);
        onRegisterStringee();
      }
      catch{}
    }
  }, []);

  const onRegisterStringee = () => {
    getTokenRestApi(
      "9999" + _customer.CustomerID,
      _customer.CustomerCode + " - " + _customer.CustomerName,
      _customer.phone
    );
  };

  //#region Tạo token, đk agent

  const getTokenRestApi = (userId, names, phone) => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api-node-calltoken.vps.vn/resttoken" + names,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        console.log("rest api token ...", JSON.stringify(response.data));
        let data = JSON.stringify({
          name: names,
          stringee_user_id: userId,
          manual_status: "AVAILABLE",
          routing_type: 1,
          phone_number: phone,
        });

        let config2 = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://icc-api.stringee.com/v1/agent",
          headers: {
            "X-STRINGEE-AUTH": response.data,
            "Content-Type": "application/json",
            Cookie: "SRVNAME=SE",
          },
          data: data,
        };

        axios
          .request(config2)
          .then((response2) => {
            console.log("agent", JSON.stringify(response2.data));
          })
          .catch((error2) => {
            console.log(error2);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //#endregion

  return (
    <>
      <div
        className="callArea"
        style={{ position: "fixed", zIndex: 1000, right: 15, bottom: 15, display:"none" }}
      >
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="btn btn-info"
            style={{ borderRadius: "100%", padding: "15px 18px" }}
            onClick={onRegisterStringee}
          >
            <i className="fa fa-phone"></i>
          </button>
          <div
            className="callList"
            style={{
              position: "absolute",
              right: "0",
              top: "-120px",
              backgroundColor: "#fff",
              width: "235px",
              boxShadow: "0 1px 3px 0 rgb(59 54 54 / 14%)",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <ul
              style={{
                listStyleType: "none",
                padding: "10px 15px",
                marginBottom: 0,
              }}
            >
              <li>
                <a
                  href={
                    "javascript:window.open('/video-call?q=" +
                    _customer?.Business_OfficeId +
                    "','_blank','height=300,width=600');"
                  }
                  style={{ width:"200px" }}
                  className="btn btn-success"
                >
                  <i className="fa fa-phone"></i> Gọi nhân viên KD
                </a>
              </li>
              <li>
                <a
                  href={
                    "javascript:window.open('/video-call?q=" +
                    _customer?.Officer_ServiceId +
                    "','_blank','height=300,width=600');"
                  }
                  className="btn btn-success"
                  style={{ width:"200px" }}
                >
                  <i className="fa fa-phone"></i> Gọi nhân viên CSKH
                </a>
              </li>
              <li>
                <a
                  href={
                    "javascript:window.open('/video-call?q=" +
                    _customer?.IT_Officer +
                    "','_blank','height=300,width=600');"
                  }
                  className="btn btn-success"
                  style={{ width:"200px" }}
                >
                  <i className="fa fa-phone"></i> Gọi nhân viên IT
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="text-center footer-custom">
      &copy;
      {new Date().getFullYear()} All rights reserved. Powered by{" "}
      <a href="https://gtelpost.vn" target="_blank">
        NETCO POST
      </a>
    </div> */}
    </>
  );
};
