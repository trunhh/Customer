import React from "react";
import { FooterMenu, HeaderMenu, LeftMenu } from "../Component/Template";

const LayoutMain = ({ children, ...rest }) => {
  return (
    <>
      <LeftMenu></LeftMenu>
      <div className="main-panel ps">
        <HeaderMenu></HeaderMenu>
        <div className="content" style={{ height: "calc(100vh - 58px)" }}>
          {children}
        </div>
         <FooterMenu></FooterMenu>
      </div>
    </>
  );
};
export default LayoutMain;
