import React, { useEffect, useState } from "react";
import { DecodeString } from "../Utils";
import { useLocation } from "react-router";
const LayoutVideoCall = ({ children, ...rest }) => {
  const location = useLocation();
  //const [token, setToken] = useState("");
  const [callTo, setCallTo] = useState("");
  useEffect(() => {
    const pr = new URLSearchParams(location.search);
    if (pr.get("q") !== null) setCallTo(pr.get("q"));
  }, []);

  return (
    <>
      {children}
      <input type="hidden" id="callTo" value={callTo} />
      <div style={{ display: "none" }}>
        Logged in:{" "}
        <span id="loggedUserId" style={{ color: "red" }}>
          Chưa đăng nhập, vui lòng click login
        </span>
        <br />
        Call status:{" "}
        <span id="callStatus" style={{ color: "red" }}>
          Not started
        </span>
      </div>
      <div>
        <video
          id="localVideo"
          playsInline
          autoPlay
          muted
          style={{
            width: "100px",
            borderRadius: "10px",
            background: "#424141",
            marginRight: "10px",
            position: "absolute",
            right: "15px",
            top: "15px",
            zIndex: 123456,
          }}
        ></video>
        <video
          id="remoteVideo"
          playsInline
          autoPlay
          style={{ width: "600px", height: "300px", background: "#424141" }}
        ></video>
        <div
          id="callTime"
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            zIndex: 123456,
            color: "#fff",
          }}
        >
          00:00
        </div>
      </div>
      <div
        className="col-md-12 text-center"
        style={{ position: "absolute", bottom: "15px", zIndex: 123456 }}
      >
        <button
          id="loginBtn"
          className="btn btn-success"
          style={{ display: "none" }}
        >
          Login
        </button>
        <button
          className="btn btn-success"
          id="callBtn"
          style={{
            padding: "15px 18px",
            marginRight: "10px",
          }}
        >
          <i className="fa fa-phone"></i> Gọi thoại
        </button>
        <button
          className="btn btn-success"
          id="videoCallBtn"
          style={{
            padding: "15px 10px",
            marginRight: "10px",
          }}
        >
          <span class="material-icons" style={{ fontSize: "25px" }}>
            videocam
          </span> Gọi video
        </button>
        <button
          className="btn btn-danger"
          id="hangupBtn"
          style={{
            borderRadius: "100%",
            padding: "13px 18px 17px 15px",
            marginRight: "10px",
            display: "none",
          }}
        >
          <i
            className="fa fa-phone"
            style={{ transform: "rotate(135deg)" }}
          ></i>
        </button>
        <button
          className="btn btn-warning"
          id="muteBtn"
          style={{
            borderRadius: "100%",
            padding: "15px 10px",
            marginRight: "10px",
            display: "none",
          }}
        >
          <span class="material-icons" style={{ fontSize: "25px" }}>
            mic_off
          </span>
        </button>
        <button
          className="btn btn-warning"
          id="enableVideoBtn"
          style={{
            borderRadius: "100%",
            padding: "15px 10px",
            display: "none",
          }}
        >
          <span class="material-icons" style={{ fontSize: "25px" }}>
            videocam_off
          </span>
        </button>
      </div>
    </>
  );
};
export default LayoutVideoCall;
