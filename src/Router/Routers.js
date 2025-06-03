import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

import { GetCookie } from "../Utils";

import { FooterMenu, HeaderMenu, LeftMenu } from "../Component/Template";
import {
  GetLadingTemporary,
  PostOfficeComponent,
  TimelineTransport
} from "../Component/Categorys";

import {
  CustomerComplain,
  CustomerComplainList,
  // CustomerOrder,
  // CustomerOrderlist,
  HomeComponent,
  LadingCreateComponent,
  V2LadingCreateComponent,
  LadingExcelComponent,
  LadingGetPriceComponent,
  LookupLading,
  SearchLading,
  V1LadingCreateComponent,
} from "../Component/Main";

import {
  ChangePasswordComponent,
  CustomerRecipientComponent,
  CustomerSenderComponent,
  ForgotPasswordComponent,
  LadingOutPrint,
  LoginComponent,
  LoginV1Component,
  ProfiveComponent,
  RegisterComponent,
  ResetPasswordComponent,
  TestChart,
  VerificationComponent,
  VideoCallComponent,
} from "../Component/System";

import {
  WareHouseImportReportComponent,
  WareHouseOutputReportComponent,
  WareHouseInventoryReportComponent,
  WareHouseTranportReportComponent,
  WareHouseSupplierReportComponent,
  OverViewReportComponent,
  CustomerPaymentDealineComponent,
  //MyChart
  KpiDeliveryCODReportComponent,
  OutstandingDebtReportComponent,
  PaymentReportComponent,
  RouteVehicleComponent,
  WareHousePersoninChargeReportComponent,
  PaymentCODCustomerComponent
} from "../Component/Reports";

export const Routers = () => {
  const ArrNoLogin = ['/', '/register', '/forgot', '/reset']
  const CustomerID = GetCookie("CustomerID");
  let currentUrl = window.location.href;
  let urlSplit = currentUrl.split("/")[0] + "//" + currentUrl.split("/")[2];
  if ((urlSplit==="/" || (urlSplit!=="/" && ArrNoLogin.indexOf(urlSplit) !== -1)) && CustomerID === null)
    window.location.href = "/";
  /* if (GetCookie("CustomerID") !== null && currentUrl !== (urlSplit + "/") && currentUrl.indexOf("/login") === -1 && currentUrl.indexOf("/register") === -1 && currentUrl.indexOf("/forgot") === -1 && currentUrl.indexOf("/reset") === -1)
    window.location.href = "/"; */
  return (
    <BrowserRouter>
     {/*  {
        CustomerID === null ||
          currentUrl === urlSplit + "/" ||
          currentUrl.indexOf("/register") !== -1 ||
          currentUrl.indexOf("/forgot") !== -1 ||
          currentUrl.indexOf("/print-bill") !==-1 ||
          currentUrl.indexOf("/reset") !== -1 ? null : (
          <Route path="/" component={LeftMenu} />
        )} */}
      {/* <div className="main-panel ps"> */}
        {/* {
          CustomerID === null ||
            currentUrl === urlSplit + "/" ||
            currentUrl.indexOf("/register") !== -1 ||
            currentUrl.indexOf("/forgot") !== -1 ||
            currentUrl.indexOf("/print-bill") !==-1 ||
            currentUrl.indexOf("/reset") !== -1 ? null : (
            <Route path="/" component={HeaderMenu} />
          )} */}

        <Switch>
          //#region TÀI KHOẢN
          <Route exact path="/" component={LoginV1Component} />
          <Route exact path="/home" component={HomeComponent} />
          <Route exact path="/lo-trinh-giao-hang" component={RouteVehicleComponent} />
          <Route exact path="/register" component={RegisterComponent} />
          <Route exact path="/forgot" component={ForgotPasswordComponent} />
          <Route exact path="/reset" component={ResetPasswordComponent} />
          <Route exact path="/thong-tin-ca-nhan" component={ProfiveComponent} />
          <Route exact path="/doi-mat-khau" component={ChangePasswordComponent} />
          <Route exact path="/dia-chi-nhan-thuong-xuyen" component={CustomerRecipientComponent} />
          <Route exact path="/dia-chi-gui-thuong-xuyen" component={CustomerSenderComponent} />
          <Route exact path="/xac-thuc-tai-khoan" component={VerificationComponent} />
          <Route exact path="/mang-luoi-buu-cuc" component={PostOfficeComponent} />
          //#endregion TÀI KHOẢN

          //#region BÁO CÁO
          {/* Router for the system */}
          <Route exact path="/cong-no-tam-tinh" component={GetLadingTemporary} />
          {/* Router for the system */}
          <Route exact path="/thoi-gian-toan-trinh-phat-hang-dich-vu" component={TimelineTransport} />
          {/* Router for the report warehouse */}
          <Route exact path="/bao-cao-nhap-kho" component={WareHouseImportReportComponent} />
          <Route exact path="/bao-cao-xuat-kho" component={WareHouseOutputReportComponent} />
          <Route exact path="/bao-cao-chuyen-kho" component={WareHouseTranportReportComponent} />
          <Route exact path="/bao-cao-ton-kho" component={WareHouseInventoryReportComponent} />
          <Route exact path="/bao-cao-ton-kho-ncc" component={WareHouseSupplierReportComponent} />
          <Route exact path="/bao-cao-ton-kho-npt" component={WareHousePersoninChargeReportComponent} />
          <Route exact path="/bao-cao-tong-quan" component={OverViewReportComponent} />
          <Route exact path="/bao-cao-dealine-thanh-toan" component={CustomerPaymentDealineComponent} />
          <Route exact path="/bao-cao-kpi-giao-hang-cod" component={KpiDeliveryCODReportComponent} />
          <Route exact path="/bao-cao-ton-no" component={OutstandingDebtReportComponent} />
          <Route exact path="/bang-ke-thanh-toan" component={PaymentReportComponent} />
          <Route exact path="/bang-ke-thanh-toan-cod" component={PaymentCODCustomerComponent} />

          //#endregion BÁO CÁO

          //#region KHIẾU NẠI
          {/* Router for the Main */}
          <Route exact path="/ho-tro-don-hang" component={CustomerComplain} />
          <Route exact path="/danh-sach-ho-tro-don-hang" component={CustomerComplainList} />
          //#endregion KHIẾU NẠI

          //#region VẬN ĐƠN
          <Route exact path="/tao-nhanh-van-don" component={LadingCreateComponent} />
          <Route exact path="/tao-nhanh-van-don-v1" component={V1LadingCreateComponent} />
          <Route exact path="/tim-kiem-van-don" component={SearchLading} />
          <Route exact path="/tra-cuu-van-don" component={LookupLading} />
          <Route exact path="/upload-excel-van-don" component={LadingExcelComponent} />
          {/* Router for the system */}
          <Route exact path="/" component={LadingGetPriceComponent} />
          <Route exact path="/uoc-tinh-cuoc-phi" component={LadingGetPriceComponent} />
          <Route exact path="/print-bill" component={LadingOutPrint} />
          //#endregion VẬN ĐƠN

          <Route exact path="/video-call" component={VideoCallComponent} />

          //#region TEST
          {/* Router for the test */}
          {/* <Route exact path="/demo" component={TextBoss} />
          <Route exact path="/test" component={Test} /> */}
          <Route exact path="/chart" component={TestChart} />
          //#endregion TEST

        </Switch>
    </BrowserRouter>
  );
};
