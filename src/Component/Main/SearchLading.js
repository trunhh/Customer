import React, { useState, useEffect, useRef } from "react";
import DateTimePicker from "react-datetime-picker";
import { useCookies } from "react-cookie";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { useInput } from "../../Hooks";
import { mainAction } from "../../Redux/Actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { DataTable } from "../../Common/DataTable";
import Barcode from "react-barcode";
import { ExportExcel } from "../../Utils/ExportExcel";
import { Lading } from "../../Redux/Actions/Category";
import { LadingDetail } from "../../Common";
import $ from "jquery";
import {
  Alertsuccess,
  Alerterror,
  FormatDate,
  DecodeString,
  FormatMoney,
  FormatNumber,
  FormatDateJson,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import LayoutMain from "../../Layout/LayoutMain";

export const SearchLading = () => {
  //#region Khai báo biến
  const config = {
    background: "white",
    marginTop: "1px",
    marginBottom: "5px",
    fontOptions: "italic",
    width: 1,
    height: 40,
  };
  const [ModalImg, setModalImg] = useState("");
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const history = useHistory();
  const dispatch = useDispatch();
  const [Fromdate, setFromdate] = useState(new Date());
  const [Todate, setTodate] = useState(new Date());
  const [dataLading, setdataLading] = useState([]);
  const [Status, setStatus] = useState(9);
  const [StatusName, setStatusName] = useState(`Đơn hàng mới tạo`);
  const [Disable, setDisable] = useState(false);
  const [Checked, setChecked] = useState(false);
  const [DataPrint, setDataPrint] = useState([]);
  const [IsChecked, setIsChecked] = useState(false);
  const [sheetprint, bindsheetprint, setsheetprint] = useInput(2);
  const sheetprintRef = useRef();
  const [State, setState] = useState([]);
  const [Ladingcode, bindLadingcode, setLadingcode] = useInput("");
  const LadingcodeRef = useRef();
  //#endregion Khai báo biến

  useEffect(() => {
    if (CustomerID === null) {
      history.push("/");
    }
    APIC_spLadingGetMany(Status);
  }, []);

  //#region Form tìm kiếm vận đơn

  //#region Trạng thái vận đơn
  const [Status1, setStatus1] = useState(0);
  const [Status2, setStatus2] = useState(0);
  const [Status3, setStatus3] = useState(0);
  const [Status4, setStatus4] = useState(0);
  const [Status5, setStatus5] = useState(0);
  const [Status6, setStatus6] = useState(0);
  const [Status7, setStatus7] = useState(0);
  const [Status8, setStatus8] = useState(0);
  const [Status9, setStatus9] = useState(0);
  const [Status50, setStatus50] = useState(0);
  const [Status11, setStatus11] = useState(0);
  //#endregion Trạng thái vận đơn

  const FromDate = (item) => {
    setFromdate(item);
  };

  const ToDate = (item) => {
    setTodate(item);
  };

  const ExportToExcel = () => {
    if (dataLading.length > 0) {
      let dataExcel = dataLading.map((item, index) => {
        return {
          "Mã vận đơn": item.Code,
          "Mã đối tác": item.PartnerCode,
          "Trạng thái": item.StatusName,
          "Trọng lượng (gram)": FormatMoney(item.Weight),
          "Số kiện": item.Number,
          "Dài": item.Length ? item.Length : 0,
          "Rộng": item.Width ? item.Width : 0,
          "Cao": item.Height ? item.Height : 0,
          "Số khối (cbm)": item.Mass,
          "Tiền thu hộ": FormatMoney(item.COD),
          "Tổng cước phí": FormatMoney(item.Amount),
          "Thời gian tạo": FormatDateJson(item.CreateDate),
          "Ngày phát thành công": item.FinishDate === undefined ? "" : FormatDateJson(item.FinishDate),
          "Ước tính nhận": FormatDateJson(item.DealineTime, 1),
          "Hình thức thanh toán": item.PaymentString,
          "Tỉnh đi": item.CitySendCode,
          "Tỉnh đến": item.CityRecipientCode,
          "Quận,huyện đến": item.District,
          "Phường,xã đến": item.Wards,
          "Dịch vụ": item.ServiceName,
          "Người nhận": item.RecipientName,
          "SĐT người nhận": item.RecipientPhone,
          "Công ty nhận": item.RecipientCompany,
          "Địa chỉ người nhận": item.RecipientAddress,
          "Người nhận thực tế": item.Recipient_reality,
          "Nội dung hàng hóa": item.Description,
          "Ghi chú": item.Noted,
        };
      });
      ExportExcel(
        dataExcel,
        "Danh sách " +
        StatusName +
        " từ ngày " +
        FormatDateJson(Fromdate, 1) +
        " đến ngày " +
        FormatDateJson(Todate, 1)
      );
    } else {
      Alerterror("Không có dữ liệu để xuất. Vui lòng tìm kiếm trước !");
    }
  };

  const ExportAllToExcel = async () => {
    setdataLading([]);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      LadingCode: Ladingcode,
      FromDate: Fromdate.toISOString(),
      ToDate: Todate.toISOString(),
      CustomerID: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      CustomerCode: GetCookie("CustomerCode"),
      Status: 0,
      Skip: 0,
      Take: 15000,
    };
    const data = await mainAction.API_spCallServer(
        "APIC_spLadingGetManyJsonAuto",
        params,
        dispatch
    );
    if (data.length > 0) {
      let dataExcel = data.map((item, index) => {
        return {
          "Mã vận đơn": item.Code,
          "Mã đối tác": item.PartnerCode,
          "Trạng thái": item.StatusName,
          "Trọng lượng (gram)": FormatMoney(item.Weight),
          "Số kiện": item.Number,
          "Dài": item.Length ? item.Length : 0,
          "Rộng": item.Width ? item.Width : 0,
          "Cao": item.Height ? item.Height : 0,
          "Số khối (cbm)": item.Mass,
          "Tiền thu hộ": FormatMoney(item.COD),
          "Tổng cước phí": FormatMoney(item.Amount),
          "Thời gian tạo": FormatDateJson(item.CreateDate),
          "Ngày phát thành công": item.FinishDate === undefined ? "" : FormatDateJson(item.FinishDate),
          "Ước tính nhận": FormatDateJson(item.DealineTime, 1),
          "Hình thức thanh toán": item.PaymentString,
          "Tỉnh đi": item.CitySendCode,
          "Tỉnh đến": item.CityRecipientCode,
          "Quận,huyện đến": item.District,
          "Phường,xã đến": item.Wards,
          "Dịch vụ": item.ServiceName,
          "Người nhận": item.RecipientName,
          "SĐT người nhận": item.RecipientPhone,
          "Công ty nhận": item.RecipientCompany,
          "Địa chỉ người nhận": item.RecipientAddress,
          "Ngưởi nhận thực tế": item.Recipient_reality,
          "Nội dung hàng hóa": item.Description,
          "Ghi chú": item.Noted,
        };
      });
      ExportExcel(
        dataExcel,
        "Danh sách vận đơn từ ngày " +
        FormatDateJson(Fromdate, 1) +
        " đến ngày " +
        FormatDateJson(Todate, 1)
      );
    } else {
      Alerterror("Không có dữ liệu để xuất. Vui lòng tìm kiếm trước !");
    }
  };

  const GoToComplain = (item) => {
    window.location.href = "/ho-tro-don-hang?code=" + item.Code;
  };

  //#region HÀM XÓA VẬN ĐƠN
  const CPN_spLading_Delete_All = async (item) => {
    const params = {
      json: '[{"Id":' + item._original.Id + ',"IsDelete":1}]',
      func: "CPN_spLading_Delete_All",
    };
    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      setdataLading(dataLading.filter((p) => p.Id !== item._original.Id));
      Alertsuccess(result.ReturnMess);
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
    }
  };
  //#endregion HÀM XÓA VẬN ĐƠN

  const [ViewDetail, setViewDetail] = useState(null);
  const [DetailId, setDetailId] = useState(0);
  const GoToDetail = async (item) => {
    let LadingDetail = item._original;
    setDetailId(item._original.Id);
  };

  const APIC_spLadingGetMany = async (stt) => {
    setIsChecked(false);
    setChecked(false);
    setdataLading([]);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      LadingCode: Ladingcode,
      FromDate: Fromdate.toISOString(),
      ToDate: Todate.toISOString(),
      CustomerID: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      CustomerCode: GetCookie("CustomerCode"),
      Status: stt,
      Skip: 0,
      Take: 5000,
    };
    setStatus(stt);
    setDisable(true); // disable button
    try {
      //#region Set status name cho tiêu đề

      if (stt === 9) setStatusName(`Đơn hàng mới tạo`);
      else if (stt === 1) setStatusName(`Đơn hàng đang lấy hàng`);
      else if (stt === 2) setStatusName(`Đơn hàng đã lấy hàng`);
      else if (stt === 3) setStatusName(`Đơn hàng đang trung chuyển`);
      else if (stt === 4) setStatusName(`Đơn hàng nhận tại chi nhánh phát`);
      else if (stt === 5) setStatusName(`Đơn hàng đang phát`);
      else if (stt === 50) setStatusName(`Đơn hàng đang phát lại`);
      else if (stt === 6) setStatusName(`Đơn hàng phát thành công`);
      else if (stt === 7) setStatusName(`Đơn hàng khai thác lại`);
      else if (stt === 8) setStatusName(`Đơn hàng hoàn gốc`);
      else if (stt === 11) setStatusName(`Đơn hàng lưu kho`);
      else setStatusName("Danh sách Đơn hàng");

      //#endregion Set status name cho tiêu đề

      //#region Đếm vận đơn theo Status
      const _count = await mainAction.API_spCallServer(
          "APIC_spLading_SumByStatus",
          params,
          dispatch
      );
      _count.map((item, index) => {
        if (item.Status === 1) setStatus1(item.Total);
        if (item.Status === 2) setStatus2(item.Total);
        if (item.Status === 3) setStatus3(item.Total);
        if (item.Status === 4) setStatus4(item.Total);
        if (item.Status === 5) setStatus5(item.Total);
        if (item.Status === 6) setStatus6(item.Total);
        if (item.Status === 7) setStatus7(item.Total);
        if (item.Status === 8) setStatus8(item.Total);
        if (item.Status === 9) setStatus9(item.Total);
        if (item.Status === 50) setStatus50(item.Total);
        if (item.Status === 11) setStatus11(item.Total);
      });

      //#endregion Đếm vận đơn theo Status

      //#region Get danh sách vận đơn
      const data = await mainAction.API_spCallServer(
          "APIC_spLadingGetManyJsonAuto",
          params,
          dispatch
      );
      setdataLading(data);
      setDataPrint([]);
      setViewDetail(null);
      setModalImg("");
      setDisable(false); // disable button
      mainAction.LOADING({ IsLoading: false }, dispatch);
      //#endregion Get danh sách vận đơn
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      setDisable(false); // disable button
    }
  };

  //#endregion Form tìm kiếm vận đơn

  //#region In vận đơn

  const [pageprint, setpageprint] = useState([0, 1]);
  const [HtmlPrint, setHtmlPrint] = useState([]);

  const GetPrintMask = (form, PayType, COD) => {
    if (form === "A5") {
      if (PayType === 1 && COD > 0)
        return (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              opacity: 0.4,
              marginTop: "35vh",
              marginLeft: "20vw",
              fontSize: "120px",
              fontWeight: 600,
              transform: "rotate(70deg)",
              fontFamily: "Arial",
            }}
          >
            COD-TTĐN
          </div>
        );
      else if (PayType !== 1 && COD > 0)
        return (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              opacity: 0.4,
              marginTop: "35vh",
              marginLeft: "30vw",
              fontSize: "120px",
              fontWeight: 600,
              transform: "rotate(60deg)",
              fontFamily: "Arial",
            }}
          >
            COD
          </div>
        );
      else if (PayType === 1 && COD === 0)
        return (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              opacity: 0.4,
              marginTop: "35vh",
              marginLeft: "30vw",
              fontSize: "120px",
              fontWeight: 600,
              transform: "rotate(60deg)",
              fontFamily: "Arial",
            }}
          >
            TTĐN
          </div>
        );
      else return <></>;
    } else if (form === "A6") {
      if (PayType === 1 && COD > 0)
        return (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              opacity: 0.25,
              marginTop: "32vh",
              fontSize: "80px",
              fontWeight: 600,
              transform: "rotate(-40deg)",
              fontFamily: "Arial",
            }}
          >
            COD-TTĐN
          </div>
        );
      else if (PayType !== 1 && COD > 0)
        return (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              opacity: 0.25,
              marginTop: "26vh",
              marginLeft: "15vw",
              fontSize: "103px",
              fontWeight: 600,
              transform: "rotate(-38deg)",
              fontFamily: "Arial",
            }}
          >
            COD
          </div>
        );
      else if (PayType === 1 && COD === 0)
        return (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              opacity: 0.25,
              marginTop: "28vh",
              marginLeft: "10vw",
              fontSize: "100px",
              fontWeight: 600,
              transform: "rotate(-40deg)",
              fontFamily: "Arial",
            }}
          >
            TTĐN
          </div>
        );
      else return <></>;
    }
  };

  const APIC_spLadingGetDataPrint = async (Keys) => {
    if (DataPrint.length === 0) {
      Alerterror("Vui lòng chọn vận đơn cần in");
      return;
    }
    debugger;
    let db = [],
      NumberPack = 0;
    await setHtmlPrint([]);
    //#region SET HTML PRINT

    //#region in bill  A5+ A4
    if (Keys === 1) {
      await setHtmlPrint(
        DataPrint.map((item, index) => {
          return (
            <div>
              {pageprint.map((detail, idele) => {
                return (
                  <div
                    key={index}
                    className="bill"
                    style={{
                      width: "710px",
                      height: "1000px",
                      pageBreakBefore: "always",
                      border: "2px solid #000",
                    }}
                  >
                    {GetPrintMask("A5", item.PaymentType, item.COD)}
                    <table
                      style={{
                        width: "100%",
                        fontWeight: "600",
                        borderBottom: "2px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      <tr>
                        <td style={{ width: "180px", verticalAlign: "top" }}>
                          <img
                            src="/assets/img/logo-gtel.png"
                            style={{ width: "180px", height: "70px" }}
                          />
                        </td>
                        <td>
                          <div
                            style={{
                              width: "100%",
                              position: "relative",
                              display: "inline-block",
                              height: "40px",
                              marginBottom: "5px",
                            }}
                          >
                            <div>
                              <Barcode value={item.Code} height="35" />
                            </div>
                          </div>
                          <br />
                          <br />
                          <p>
                            BIÊN BẢN BÀN GIAO
                            <br />
                            (DELIVERY RECEIPTS)
                          </p>
                        </td>
                        <td
                          style={{
                            width: "160px",
                            verticalAlign: "top",
                            marginRight: "1px",
                          }}
                        >
                          <img
                            src="/assets/img/iso9001.jpg"
                            style={{ width: "160px", height: "70px" }}
                          />
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{ width: "100%", borderBottom: "2px solid #ddd", fontSize: '15px' }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          rowspan="2"
                          style={{
                            borderRight: "1px solid #ddd",
                            width: "20px",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>INFORMATION</b>
                          </div>
                        </td>
                        <td
                          style={{
                            borderBottom: "2px solid #ddd",
                            width: "340px",
                            borderRight: "1px solid #ddd",
                          }}
                        >
                          <b
                            style={{ display: "inline-block", width: "240px" }}
                          >
                            Ngày gửi hàng <i>(Date)</i>
                          </b>
                          : {FormatDateJson(item.CreateDate, 1)}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "240px" }}
                          >
                            Số kiện <i>(Package)</i>
                          </b>
                          : {FormatMoney(item.Number)}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "240px" }}
                          >
                            Nội dung hàng hóa <i>(Document,Goods)</i>
                          </b>
                          :{" "}
                          {item.Description !== undefined
                            ? item.Description
                            : ""}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "240px" }}
                          >
                            Dịch vụ bưu chính <i>((Postal services)</i>
                          </b>
                          : <span>{item.ServiceName}</span>
                          <br />
                          <b
                            style={{ display: "inline-block", width: "240px" }}
                          >
                            Dịch vụ cộng thêm <i>(Extra services)</i>
                          </b>
                          :
                          {item.ServiceGTGTName !== undefined
                            ? item.ServiceGTGTName
                            : ""}
                          <br />
                        </td>
                        <td
                          colspan=""
                          style={{ borderBottom: "2px solid #ddd" }}
                        >
                          <lbl
                            style={{ display: "inline-block", width: "210px" }}
                          >
                            {item.Mass === 0 || item.Mass === undefined
                              ? "Trọng lượng "
                              : "Khối lượng "}{" "}
                            <i>
                              {item.Mass === 0 || item.Mass === undefined
                                ? "(Weight): "
                                : "(Mass): "}
                            </i>
                          </lbl>
                          :
                          <b>
                            {item.Mass === 0 || item.Mass === undefined
                              ? FormatNumber(item.Weight)
                              : item.Mass}{" "}
                            {item.Mass === 0 || item.Mass === undefined
                              ? " (gram)"
                              : " (CBM)"}
                          </b>
                          <br />
                          <lbl
                            style={{ display: "inline-block", width: "210px" }}
                          >
                            HT thanh toán <i>(Payment)</i>
                          </lbl>
                          :{" "}
                          <b>
                            {item.PaymentString !== undefined
                              ? item.PaymentString
                              : "Khác"}
                          </b>
                          <br />
                          <lbl
                            style={{ display: "inline-block", width: "210px" }}
                          >
                            COD
                          </lbl>
                          : <b>{FormatMoney(item.COD)} đ</b>
                          <br />
                          <lbl
                            style={{ display: "inline-block", width: "210px" }}
                          >
                            Số tiền phải thu <i>(Total receivables)</i>
                          </lbl>
                          :
                          <b>
                            {FormatMoney(
                              item.PaymentType == 1
                                ? item.COD + item.Amount
                                : item.COD
                            )}{" "}
                            đ
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" style={{ position: "relative" }}>
                          <b>
                            THÔNG TIN HÀNG HÓA <i>(PARCEL INFORMATION)</i>
                          </b>{" "}
                          : <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Mã sản phẩm 1<i>(Product Code 1)</i>
                          </b>
                          : {item.ProductCode ?? ""}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Tên sản phẩm 1 <i>((Product Name 1)</i>
                          </b>
                          : {item.ProductName ?? ""}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Seri sản phẩm 1<i>(Product Seri 1)</i>
                          </b>
                          : <span>{item.ProductDes ?? ""}</span>
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Tổng SP <i>(Total product)</i>
                          </b>
                          : {item.TotalProduct ?? ""}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Danh sách SP <i>(List of product)</i>
                          </b>
                          : {item.ListProductCode ?? ""}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4">
                          <u>
                            <b>* LƯU Ý GIAO (DELIVERY NOTE): </b>
                          </u>
                          <span>
                            {item.Noted !== undefined ? item.Noted : ""}
                          </span>
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{ width: "100%", borderBottom: "2px solid #ddd", fontSize: '14px' }}
                      cellspacing="0"
                      cellpadding="5"

                    >
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            width: "20px",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>DO</b>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div>
                            <Barcode value={item.PartnerCode} height="33" />
                          </div>
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{ width: "100%", borderBottom: "2px solid #ddd", fontSize: '14px' }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            width: "20px",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>SENDER</b>{" "}
                          </div>
                        </td>
                        <td style={{ position: "relative" }}>
                          <b>THÔNG TIN NGƯỜI GỬI (SENDER INFORMATION)</b>:{" "}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Mã khách hàng <i>(Customer code)</i>
                          </b>
                          : {item.CustomerCode}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Người gửi <i>(Sender's name)</i>
                          </b>
                          : {item.CustomerNamePrint}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Điện thoại <i>(Phone)</i>
                          </b>
                          : <span>{item.CustomerPhonePrint}</span>
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Địa chỉ <i>(Address)</i>
                          </b>
                          : {item.CustomerAddressPrint}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Tỉnh/TP <i>(Province/City)</i>
                          </b>
                          : {item.CitySendCode}
                          <br />
                          <span
                            style={{
                              padding: "2px 10px",
                              fontWeight: "bold",
                              fontSize: "45px",
                              borderTop: "2px solid #000",
                              borderBottom: "2px solid #000",
                              borderLeft: "2px solid #000",
                              top: "-2px",
                              right: 0,
                              position: "absolute",
                            }}
                          >
                            {item.POCodeFrom}
                          </span>
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{ width: "100%", borderBottom: "2px solid #ddd" }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            width: "20px",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>RECEIVER</b>
                          </div>
                        </td>
                        <td style={{ position: "relative" }}>
                          <b>THÔNG TIN NGƯỜI NHẬN (RECEIVER'S INFORMATION)</b>:
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Người nhận <i>(Recipient’s name)</i>
                          </b>
                          : {item.RecipientName}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Điện thoại <i>(Phone)</i>
                          </b>
                          : {item.RecipientPhonePrint}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - C.ty nhận <i>(Recipient’s company)</i>
                          </b>
                          :{" "}
                          <span>
                            {item.RecipientCompany !== undefined
                              ? item.RecipientCompany
                              : ""}
                          </span>
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Số nhà, đường <i>(No., Street)</i>
                          </b>
                          :{" "}
                          {item.Street !== undefined
                            ? item.Street
                            : item.RecipientAddress}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Phường/Xã <i>(Ward/Commune)</i>
                          </b>
                          : {item.Wards}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "250px" }}
                          >
                            - Quận/Huyện <i>(District)</i>
                          </b>
                          : {item.District}
                          <br />
                          <b
                            style={{ display: "inline-block", width: "255px" }}
                          >
                            - Tỉnh/TP <i>(Province/City)</i>
                          </b>
                          : {item.CityRecipientCode}
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{
                        width: "100%",
                        borderBottom: "2px solid #ddd",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td>{item.LocationTo}</td>
                      </tr>
                    </table>
                    <table
                      style={{ width: "100%", fontSize: '12px' }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td colspan="2">
                          Bên nhận hàng xác nhận Bên giao hàng đã giao cho Bên
                          nhận hàng đúng, đủ nội dung như trên/
                          <br />
                          The consigneee confirms that the Delivery company has
                          delivered to the consignee the correct and sufficient
                          content as above.
                          <br />
                          Bên bản được lập thành 02 bản, mỗi bên giữ 01 bản có
                          giá trị như nhau/
                          <br />
                          The Delivery record are made into 02 copies, each
                          party keeps 01 copy with the same value.
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "center", width: "33%" }}>
                          <br />
                          <b>BÊN GIAO HÀNG</b> <br />
                          <i>(Delivery Company)</i>
                        </td>
                        <td style={{ textAlign: "center", width: "33%" }}>
                          <br />
                          <b>BÊN VẬN CHUYỂN</b> <br />
                          <i>(Transport GTEL)</i>
                        </td>
                        <td style={{ textAlign: "center", width: "33%" }}>
                          Ngày (Date) ..... / ..... / 20.....
                          <br />
                          <b>BÊN NHẬN HÀNG</b>
                          <br />
                          <i>(Consignee)</i>
                        </td>
                      </tr>
                    </table>
                  </div>
                );
              })}
            </div>
          );
        })
      );
    }
    //#endregion

    //#region in kiện A5+A4
    else if (Keys === 2) {
    const result = await mainAction.API_spCallServer(
      "CPN_spLading_List_Detail",
      DataPrint,
      dispatch
    );
      debugger;
      await setHtmlPrint(
        DataPrint.map((v, index) => {
          let TotalNumber = result.filter((e) => e.Code === v.Code);
          return (
            <div key={"L" + index}>
              {pageprint.map((detail, ideles) => {
                return TotalNumber.map((v2, idele) => {
                  //đặt biến trùng nhau nhiều
                  NumberPack++;
                  if (NumberPack === 4) NumberPack = 1;
                  debugger;
                  return (
                    <div
                      key={"N" + index + "_" + idele + "_" + ideles}
                      class="bill"
                      style={
                        NumberPack === 3
                          ? {
                            width: "720px",
                            height: "300px",
                            marginTop: "45px",
                            border: "2px solid #000",
                            pageBreakAfter: "always",
                          }
                          : NumberPack === 1
                            ? {
                              width: "720px",
                              height: "300px",
                              marginTop: "0px",
                              border: "2px solid #000",
                            }
                            : {
                              width: "720px",
                              height: "300px",
                              marginTop: "45px",
                              border: "2px solid #000",
                            }
                      }
                    >
                      {GetPrintMask("A5", v2.PaymentType, v2.COD)}
                      <table
                        style={{
                          width: "100%",
                          height: "60px",
                          borderBottom: "2px solid #000",
                        }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            colspan="2"
                            style={{
                              width: "50%",
                              paddingLeft: "5px",
                              textAlign: "center",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <img
                              src="/assets/img/logo-gtel.png"
                              style={{ height: "40px" }}
                            />
                          </td>
                          <td
                            colspan="2"
                            style={{ width: "50%", paddingLeft: "5px" }}
                          >
                            <div
                              style={{
                                padding: "2px 20px",
                                fontWeight: "bold",
                                fontSize: "18px",
                                borderBottom: "1px solid #000",
                                marginTop: "-8px",
                              }}
                            >
                              {" "}
                              MÃ KIỆN:{" "}
                              <span style={{ fontSize: "20px" }}>
                                <b>
                                  {idele + 1}/{v2.Number}
                                </b>
                              </span>
                            </div>
                            <div
                              style={{
                                padding: "2px 20x",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              Ngày tạo đơn : {FormatDateJson(v2.CreateDate, 1)}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table
                        style={{
                          width: "100%",
                          height: "90px",
                          textAlign: "center",
                        }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            colspan="2"
                            style={{ borderBottom: "2px solid black" }}
                          >
                            <div
                              class="doCode"
                              style={{
                                padding: "0px 8px",
                                fontWeight: "bold",
                                fontSize: "45px",
                                right: "0",
                                textAlign: "right",
                                marginRight: "0",
                                height: "75px",
                                padding: 0,
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <Barcode value={v2.NumberCode} height="35" />
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table
                        style={{ width: "100%", height: "110px" }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            colspan="3"
                            style={{
                              width: "25%",
                              paddingLeft: "5px",
                              textAlign: "center",
                              borderBottom: "2px solid #000",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <div
                              style={{
                                padding: "2px 20px",
                                fontWeight: "bold",
                                fontSize: "19px",
                              }}
                            >
                              {v2.POCodeFrom}
                            </div>
                          </td>
                          <td
                            colspan="3"
                            style={{
                              width: "25%",
                              paddingLeft: "5px",
                              textAlign: "center",
                              borderBottom: "2px solid #000",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <div
                              style={{
                                padding: "2px 20x",
                                fontWeight: "bold",
                                fontSize: "19px",
                              }}
                            >
                              {v2.POCodeTo}
                            </div>
                          </td>
                          <td
                            colspan="3"
                            style={{
                              width: "50%",
                              paddingLeft: "5px",
                              borderBottom: "2px solid #000",
                            }}
                          >
                            <div
                              style={{
                                padding: "2px 20x",
                                fontSize: "17px",
                                marginTop: "-5px",
                              }}
                            >
                              Địa chỉ nhận: {v2.Street}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table
                        style={{ width: "100%", height: "40px" }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            colspan="4"
                            style={{ width: "20%", paddingLeft: "5px" }}
                          >
                            <lbl
                              style={{
                                display: "inline-block",
                                fontSize: "16px",
                              }}
                            >
                              <b> Trọng lượng:</b>
                            </lbl>
                            <br />
                          </td>
                          <td
                            colspan="4"
                            style={{
                              width: "30%",
                              paddingLeft: "5px",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <span style={{ fontSize: "16px" }}>
                              <b>{FormatNumber(v2.Weight)} (gram)</b>
                            </span>{" "}
                            <br />
                          </td>
                          <td
                            colspan="4"
                            style={{ width: "20%", paddingLeft: "5px" }}
                          >
                            <lbl
                              style={{
                                display: "inline-block",
                                fontSize: "16px",
                              }}
                            >
                              <b>Loại dịch vụ:</b>
                            </lbl>
                          </td>
                          <td
                            colspan="4"
                            style={{ width: "30%", paddingLeft: "5px" }}
                          >
                            <span style={{ fontSize: "16px" }}>
                              {" "}
                              <b>{v2.ServiceCode}</b>
                            </span>
                            <br />
                          </td>
                        </tr>
                      </table>
                    </div>
                  );
                });
              })}
            </div>
          );
        })
      );
    }
    //#endregion

    //#region  in bill và kiện  A5+A4
    else if (Keys === 0) {
      const result = await mainAction.API_spCallServer(
          "CPN_spLading_List_Detail",
          DataPrint,
          dispatch
      );
      await setHtmlPrint(
        DataPrint.map((item, index) => {
          let TotalNumber = result.filter((e) => e.Code === item.Code);
          return (
            <div key={"L" + index}>
              {pageprint.map((detail, ideles) => {
                NumberPack = 0;
                return TotalNumber.map((v2, idele) => {
                  if (idele === 0) {
                    return (
                      <div
                        key={index}
                        className="bill"
                        style={{
                          width: "710px",
                          height: "1050px",
                          pageBreakBefore: "always",
                          border: "2px solid #000",
                        }}
                      >
                        {GetPrintMask("A5", item.PaymentType, item.COD)}
                        <table
                          style={{
                            width: "100%",
                            fontWeight: "600",
                            borderBottom: "2px solid #ddd",
                            textAlign: "center",
                          }}
                        >
                          <tr>
                            <td
                              style={{ width: "180px", verticalAlign: "top" }}
                            >
                              <img
                                src="/assets/img/logo-gtel.png"
                                style={{ width: "180px", height: "70px" }}
                              />
                            </td>
                            <td>
                              <div
                                style={{
                                  width: "100%",
                                  position: "relative",
                                  display: "inline-block",
                                  height: "40px",
                                  marginBottom: "5px",
                                }}
                              >
                                <div>
                                  <Barcode value={item.Code} height="35" />
                                </div>
                              </div>
                              <br />
                              <br />
                              <p>
                                BIÊN BẢN BÀN GIAO
                                <br />
                                (DELIVERY RECEIPTS)
                              </p>
                            </td>
                            <td
                              style={{
                                width: "160px",
                                verticalAlign: "top",
                                marginRight: "1px",
                              }}
                            >
                              <img
                                src="/assets/img/iso9001.jpg"
                                style={{ width: "160px", height: "70px" }}
                              />
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #ddd",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              rowspan="2"
                              style={{
                                borderRight: "1px solid #ddd",
                                width: "20px",
                              }}
                            >
                              <div
                                style={{
                                  marginLeft: "--20px",
                                  writingMode: "tb-rl",
                                }}
                              >
                                <b>INFORMATION</b>
                              </div>
                            </td>
                            <td
                              style={{
                                borderBottom: "2px solid #ddd",
                                width: "340px",
                                borderRight: "1px solid #ddd",
                              }}
                            >
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "240px",
                                }}
                              >
                                Ngày gửi hàng <i>(Date)</i>
                              </b>
                              : {FormatDateJson(item.CreateDate, 1)}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "240px",
                                }}
                              >
                                Số kiện <i>(Package)</i>
                              </b>
                              : {FormatMoney(item.Number)}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "240px",
                                }}
                              >
                                Nội dung hàng hóa <i>(Document,Goods)</i>
                              </b>
                              :{" "}
                              {item.Description !== undefined
                                ? item.Description
                                : ""}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "240px",
                                }}
                              >
                                Dịch vụ bưu chính <i>((Postal services)</i>
                              </b>
                              : <span>{item.ServiceName}</span>
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "240px",
                                }}
                              >
                                Dịch vụ cộng thêm <i>(Extra services)</i>
                              </b>
                              :
                              {item.ServiceGTGTName !== undefined
                                ? item.ServiceGTGTName
                                : ""}
                              <br />
                            </td>
                            <td
                              colspan=""
                              style={{ borderBottom: "2px solid #ddd" }}
                            >
                              <lbl
                                style={{
                                  display: "inline-block",
                                  width: "210px",
                                }}
                              >
                                {item.Mass === 0 || item.Mass === undefined
                                  ? "Trọng lượng "
                                  : "Khối lượng "}{" "}
                                <i>
                                  {item.Mass === 0 || item.Mass === undefined
                                    ? "(Weight): "
                                    : "(Mass): "}
                                </i>
                              </lbl>
                              :
                              <b>
                                {item.Mass === 0 || item.Mass === undefined
                                  ? FormatNumber(item.Weight)
                                  : item.Mass}{" "}
                                {item.Mass === 0 || item.Mass === undefined
                                  ? " (gram)"
                                  : " (CBM)"}
                              </b>
                              <br />
                              <lbl
                                style={{
                                  display: "inline-block",
                                  width: "210px",
                                }}
                              >
                                HT thanh toán <i>(Payment)</i>
                              </lbl>
                              :{" "}
                              <b>
                                {item.PaymentString !== undefined
                                  ? item.PaymentString
                                  : "Khác"}
                              </b>
                              <br />
                              <lbl
                                style={{
                                  display: "inline-block",
                                  width: "210px",
                                }}
                              >
                                COD
                              </lbl>
                              : <b>{FormatMoney(item.COD)} đ</b>
                              <br />
                              <lbl
                                style={{
                                  display: "inline-block",
                                  width: "210px",
                                }}
                              >
                                Số tiền phải thu <i>(Total receivables)</i>
                              </lbl>
                              :
                              <b>
                                {FormatMoney(
                                  item.PaymentType == 1
                                    ? item.COD + item.Amount
                                    : item.COD
                                )}{" "}
                                đ
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="4" style={{ position: "relative" }}>
                              <b>
                                THÔNG TIN HÀNG HÓA <i>(PARCEL INFORMATION)</i>
                              </b>{" "}
                              : <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Mã sản phẩm 1<i>(Product Code 1)</i>
                              </b>
                              : {item.ProductCode ?? ""}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Tên sản phẩm 1 <i>((Product Name 1)</i>
                              </b>
                              : {item.ProductName ?? ""}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Seri sản phẩm 1<i>(Product Seri 1)</i>
                              </b>
                              : <span>{item.ProductDes ?? ""}</span>
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Tổng SP <i>(Total product)</i>
                              </b>
                              : {item.TotalProduct ?? ""}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Danh sách SP <i>(List of product)</i>
                              </b>
                              : {item.ListProductCode ?? ""}
                              <br />
                            </td>
                          </tr>
                          <tr>
                            <td colspan="4">
                              <u>
                                <b>* LƯU Ý GIAO (DELIVERY NOTE): </b>
                              </u>
                              <span>
                                {item.Noted !== undefined ? item.Noted : ""}
                              </span>
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #ddd",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                borderRight: "1px solid #ddd",
                                width: "20px",
                              }}
                            >
                              <div
                                style={{
                                  marginLeft: "--20px",
                                  writingMode: "tb-rl",
                                }}
                              >
                                <b>DO</b>
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div>
                                <Barcode value={item.PartnerCode} height="33" />
                              </div>
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #ddd",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                borderRight: "1px solid #ddd",
                                width: "20px",
                              }}
                            >
                              <div
                                style={{
                                  marginLeft: "--20px",
                                  writingMode: "tb-rl",
                                }}
                              >
                                <b>SENDER</b>{" "}
                              </div>
                            </td>
                            <td style={{ position: "relative" }}>
                              <b>THÔNG TIN NGƯỜI GỬI (SENDER INFORMATION)</b>:{" "}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Mã khách hàng <i>(Customer code)</i>
                              </b>
                              : {item.CustomerCode}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Người gửi <i>(Sender's name)</i>
                              </b>
                              : {item.CustomerNamePrint}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Điện thoại <i>(Phone)</i>
                              </b>
                              : <span>{item.CustomerPhonePrint}</span>
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Địa chỉ <i>(Address)</i>
                              </b>
                              : {item.CustomerAddressPrint}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Tỉnh/TP <i>(Province/City)</i>
                              </b>
                              : {item.CitySendCode}
                              <br />
                              <span
                                style={{
                                  padding: "2px 10px",
                                  fontWeight: "bold",
                                  fontSize: "45px",
                                  borderTop: "2px solid #000",
                                  borderBottom: "2px solid #000",
                                  borderLeft: "2px solid #000",
                                  top: "-2px",
                                  right: 0,
                                  position: "absolute",
                                }}
                              >
                                {item.POCodeFrom}
                              </span>
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #ddd",
                            fontSize:'14px'
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                borderRight: "1px solid #ddd",
                                width: "20px",
                              }}
                            >
                              <div
                                style={{
                                  marginLeft: "--20px",
                                  writingMode: "tb-rl",
                                }}
                              >
                                <b>RECEIVER</b>
                              </div>
                            </td>
                            <td style={{ position: "relative" }}>
                              <b>
                                THÔNG TIN NGƯỜI NHẬN (RECEIVER'S INFORMATION)
                              </b>
                              :
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Người nhận <i>(Recipient’s name)</i>
                              </b>
                              : {item.RecipientName}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Điện thoại <i>(Phone)</i>
                              </b>
                              : {item.RecipientPhonePrint}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Công ty nhận <i>(Recipient’s company)</i>
                              </b>
                              :{" "}
                              <span>
                                {item.RecipientCompany !== undefined
                                  ? item.RecipientCompany
                                  : ""}
                              </span>
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Số nhà, đường <i>(No., Street)</i>
                              </b>
                              :{" "}
                              {item.Street !== undefined
                                ? item.Street
                                : item.RecipientAddress}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Phường/Xã <i>(Ward/Commune)</i>
                              </b>
                              : {item.Wards}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "250px",
                                }}
                              >
                                - Quận/Huyện <i>(District)</i>
                              </b>
                              : {item.District}
                              <br />
                              <b
                                style={{
                                  display: "inline-block",
                                  width: "255px",
                                }}
                              >
                                - Tỉnh/TP <i>(Province/City)</i>
                              </b>
                              : {item.CityRecipientCode}
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #ddd",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "25px",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td>{item.LocationTo}</td>
                          </tr>
                        </table>
                        <table
                          style={{ width: "100%",fontSize:'12px' }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td colspan="2">
                              Bên nhận hàng xác nhận Bên giao hàng đã giao cho
                              Bên nhận hàng đúng, đủ nội dung như trên/
                              <br />
                              The consigneee confirms that the Delivery company
                              has delivered to the consignee the correct and
                              sufficient content as above.
                              <br />
                              Bên bản được lập thành 02 bản, mỗi bên giữ 01 bản
                              có giá trị như nhau/
                              <br />
                              The Delivery record are made into 02 copies, each
                              party keeps 01 copy with the same value.
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "center", width: "33%" }}>
                              <br />
                              <b>BÊN GIAO HÀNG</b> <br />
                              <i>(Delivery Company)</i>
                            </td>
                            <td style={{ textAlign: "center", width: "33%" }}>
                              <br />
                              <b>BÊN VẬN CHUYỂN</b> <br />
                              <i>(Transport NETCO)</i>
                            </td>
                            <td style={{ textAlign: "center", width: "33%" }}>
                              Ngày (Date) ..... / ..... / 20.....
                              <br />
                              <b>BÊN NHẬN HÀNG</b>
                              <br />
                              <i>(Consignee)</i>
                            </td>
                          </tr>
                        </table>
                      </div>
                    );
                  } else {
                    NumberPack++;
                    if (NumberPack === 4) NumberPack = 1;
                    debugger;
                    return (
                      <div
                        key={"N" + index + "_" + idele + "_" + ideles}
                        class="bill"
                        style={
                          NumberPack === 3
                            ? {
                              width: "720px",
                              height: "300px",
                              marginTop: "45px",
                              border: "2px solid #000",
                              pageBreakAfter: "always",
                            }
                            : NumberPack === 1
                              ? {
                                width: "720px",
                                height: "300px",
                                marginTop: "0px",
                                border: "2px solid #000",
                                pageBreakBefore: "always",
                              }
                              : {
                                width: "720px",
                                height: "300px",
                                marginTop: "45px",
                                border: "2px solid #000",
                              }
                        }
                      >
                        {v2.PaymentType === 1 && v2.COD > 0 ? (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              opacity: 0.4,
                              marginTop: "35vh",
                              marginLeft: "20vw",
                              fontSize: "120px",
                              fontWeight: 600,
                              transform: "rotate(70deg)",
                              fontFamily: "Arial",
                            }}
                          >
                            COD-TTĐN
                          </div>
                        ) : null}
                        {v2.PaymentType !== 1 && v2.COD > 0 ? (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              opacity: 0.4,
                              marginTop: "35vh",
                              marginLeft: "30vw",
                              fontSize: "120px",
                              fontWeight: 600,
                              transform: "rotate(60deg)",
                              fontFamily: "Arial",
                            }}
                          >
                            COD
                          </div>
                        ) : null}
                        {v2.PaymentType === 1 && v2.COD === 0 ? (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              opacity: 0.4,
                              marginTop: "35vh",
                              marginLeft: "30vw",
                              fontSize: "120px",
                              fontWeight: 600,
                              transform: "rotate(60deg)",
                              fontFamily: "Arial",
                            }}
                          >
                            TTĐN
                          </div>
                        ) : null}
                        <table
                          style={{
                            width: "100%",
                            height: "60px",
                            borderBottom: "2px solid #000",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              colspan="2"
                              style={{
                                width: "50%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <img
                                src="/assets/img/logo-gtel.png"
                                style={{ height: "40px" }}
                              />
                            </td>
                            <td
                              colspan="2"
                              style={{ width: "50%", paddingLeft: "5px" }}
                            >
                              <div
                                style={{
                                  padding: "2px 20px",
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                  borderBottom: "1px solid #000",
                                  marginTop: "-8px",
                                }}
                              >
                                {" "}
                                MÃ KIỆN:{" "}
                                <span style={{ fontSize: "20px" }}>
                                  <b>
                                    {idele + 1}/{v2.Number}
                                  </b>
                                </span>
                              </div>
                              <div
                                style={{
                                  padding: "2px 20x",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                Ngày tạo đơn :{" "}
                                {FormatDateJson(v2.CreateDate, 1)}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{
                            width: "100%",
                            height: "90px",
                            textAlign: "center",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              colspan="2"
                              style={{ borderBottom: "2px solid black" }}
                            >
                              <div
                                class="doCode"
                                style={{
                                  padding: "0px 8px",
                                  fontWeight: "bold",
                                  fontSize: "45px",
                                  right: "0",
                                  textAlign: "right",
                                  marginRight: "0",
                                  height: "75px",
                                  padding: 0,
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <Barcode value={v2.NumberCode} height="35" />
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{ width: "100%", height: "110px" }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              colspan="3"
                              style={{
                                width: "25%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                borderBottom: "2px solid #000",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <div
                                style={{
                                  padding: "2px 20px",
                                  fontWeight: "bold",
                                  fontSize: "19px",
                                }}
                              >
                                {v2.POCodeFrom}
                              </div>
                            </td>
                            <td
                              colspan="3"
                              style={{
                                width: "25%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                borderBottom: "2px solid #000",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <div
                                style={{
                                  padding: "2px 20x",
                                  fontWeight: "bold",
                                  fontSize: "19px",
                                }}
                              >
                                {v2.POCodeTo}
                              </div>
                            </td>
                            <td
                              colspan="3"
                              style={{
                                width: "50%",
                                paddingLeft: "5px",
                                borderBottom: "2px solid #000",
                              }}
                            >
                              <div
                                style={{
                                  padding: "2px 20x",
                                  fontSize: "17px",
                                  marginTop: "-5px",
                                }}
                              >
                                Địa chỉ nhận: {v2.Street}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{ width: "100%", height: "40px" }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              colspan="4"
                              style={{ width: "20%", paddingLeft: "5px" }}
                            >
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "16px",
                                }}
                              >
                                <b> Trọng lượng:</b>
                              </lbl>
                              <br />
                            </td>
                            <td
                              colspan="4"
                              style={{
                                width: "30%",
                                paddingLeft: "5px",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                <b>{FormatNumber(v2.Weight)} (gram)</b>
                              </span>{" "}
                              <br />
                            </td>
                            <td
                              colspan="4"
                              style={{ width: "20%", paddingLeft: "5px" }}
                            >
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "16px",
                                }}
                              >
                                <b>Loại dịch vụ:</b>
                              </lbl>
                            </td>
                            <td
                              colspan="4"
                              style={{ width: "30%", paddingLeft: "5px" }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {" "}
                                <b>{v2.ServiceCode}</b>
                              </span>
                              <br />
                            </td>
                          </tr>
                        </table>
                      </div>
                    );
                  }
                });
              })}
            </div>
          );
        })
      );
    }
    //#endregion
    //#region in a6
    else if (Keys === 3) {
      await setHtmlPrint(
        DataPrint.map((v, index) => {
          return (
            <div>
              {pageprint.map((detail, idele) => {
                return (
                  <div
                    class="bill' + v.Code + '"
                    style={{
                      width: "470px",
                      height: "650px",
                      pageBreakBefore: "always",
                      pageBreakAfter: "always",
                      border: "2px solid #000",
                    }}
                  >
                    {GetPrintMask("A6", v.PaymentType, v.COD)}
                    <table
                      style={{
                        width: "100%",
                        fontWeight: "600",
                        borderBottom: "2px solid #000",
                        textAlign: "center",
                        height: "55px",
                      }}
                    >
                      <tr>
                        <td style={{ width: "50%", verticalAlign: "top" }}>
                          <img
                            src="/assets/img/logo-gtel.png"
                            style={{ height: "46px" }}
                          />
                        </td>
                        <td style={{ width: "50%", verticalAlign: "top" }}>
                          <div>
                            <p> PHIẾU GIAO HÀNG </p>
                          </div>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                              fontSize: "13px",
                            }}
                          >
                            {" "}
                            Ngày tạo : {FormatDateJson(v.CreateDate, 1)}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table
                      style={{
                        width: "100%",
                        fontWeight: "600",
                        borderBottom: "2px solid #000",
                        textAlign: "center",
                        height: "90px",
                      }}
                    >
                      <tr>
                        <td>
                          <div
                            style={{
                              padding: "0px 5px",
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <div class="code" style={{ width: "25%" }}>
                              <Barcode value={v.Code} height="35" />{" "}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table
                      style={{
                        width: "0100%",
                        borderBottom: "2px solid #000",
                        fontSize: "13px",
                        height: "140px",
                      }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          style={{
                            borderRight: "2px solid #000",
                            width: "50%",
                            paddingLeft: "10px",
                            fontSize: "12px",
                            verticalAlign: "top",
                            height: "140px",
                          }}
                        >
                          <lbl style={{ display: "inline-block" }}>
                            {" "}
                            <b>Tên KH gửi</b>
                          </lbl>
                          : <span>{v.CustomerName}</span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Mã khách hàng</b>
                          </lbl>
                          : <span>{v.CustomerCode} </span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Người gửi </b>
                          </lbl>
                          : <span>{v.CustomerName}</span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Điện thoại </b>
                          </lbl>
                          : <span>{v.CustomerPhonePrint}</span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Địa chỉ</b>
                          </lbl>
                          :{" "}
                          <span style={{ wordbreak: "break-all" }}>
                            {v.CustomerAddressPrint}
                          </span>
                          <br />
                        </td>
                        <td
                          style={{
                            width: "50%",
                            paddingLeft: "10px",
                            fontSize: "12px",
                            verticalAlign: "top",
                            height: "140px",
                          }}
                        >
                          <lbl style={{ display: "inline-block" }}>
                            {" "}
                            <b>Tên KH nhận</b>
                          </lbl>
                          : <span>{v.RecipientCompany}</span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            {" "}
                            <b>
                              {" "}
                              {v.RecipientType !== "" ? (
                                "Loại khách nhận : "
                              ) : (
                                <></>
                              )}
                            </b>
                          </lbl>
                          <span>
                            {v.RecipientType !== "" ? v.RecipientType : <></>}
                          </span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Người nhận</b>
                          </lbl>
                          : <span>{v.RecipientName}</span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Điện thoại</b>
                          </lbl>
                          : <span>{v.RecipientPhonePrint}</span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            <b>Địa chỉ </b>
                          </lbl>
                          :{" "}
                          <span style={{ wordBreak: "break-all" }}>
                            {v.NewStreet}
                          </span>
                          <br />
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{
                        width: "100%",
                        borderBottom: "2px solid #000",
                        height: "85px",
                      }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          style={{
                            borderRight: "2px solid #000",
                            width: "2%",
                            paddingLeft: "5px",
                            textAlign: "center",
                            height: "85px",
                          }}
                        >
                          <div
                            style={{
                              padding: "0px 0px 9px 0px",
                              fontWeight: "bold",
                              fontSize: "20px",
                              borderBottom: "2px solid black",
                            }}
                          >
                            {v.POCodeFrom}
                          </div>
                          <div
                            style={{
                              padding: "2px 5x",
                              fontWeight: "bold",
                              fontSize: "20px",
                              paddingTop: "7px",
                            }}
                          >
                            {v.POCodeTo}
                          </div>
                        </td>
                        <td
                          colspan="2"
                          style={{
                            width: "100%",
                            height: "70px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            class="doCode"
                            style={{
                              display: "block",
                              textAlign: "center",
                              top: "-17px",
                              height: "80px",
                            }}
                          >
                            {v.PartnerCode !== "" ? (
                              <Barcode value={v.PartnerCode} height="33" />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{
                        width: "100%",
                        borderBottom: "2px solid #000",
                        fontSize: "13px",
                        height: "130px",
                      }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          style={{
                            borderRight: "2px solid #000",
                            width: "50%",
                            height: "130px",
                            paddingLeft: "10px",
                            fontSize: "12px",
                            verticalAlign: "top",
                          }}
                        >
                          <lbl style={{ display: "inline-block" }}>
                            {" "}
                            Số kiện
                          </lbl>
                          :{" "}
                          <span style={{ fontsize: "16px" }}>
                            <b>
                              {1} / {v.Number}
                            </b>
                          </span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            Khối lượng
                          </lbl>
                          :{" "}
                          <span style={{ fontsize: "16px" }}>
                            <b>{FormatNumber(v.Weight)} (gram)</b>
                          </span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            Loại dịch vụ
                          </lbl>
                          :{" "}
                          <span style={{ fontsize: "16px" }}>
                            <b>{v.ServiceName}</b>
                          </span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            Dịch vụ cộng thêm
                          </lbl>
                          :{" "}
                          <span style={{ fontsize: "16px" }}>
                            <b>{v.ServiceGTGTName}</b>
                          </span>
                          <br />
                          <lbl style={{ display: "inline-block" }}>
                            Chỉ dẫn hàng hóa
                          </lbl>
                          :{" "}
                          <span>
                            <b>{v.Description}</b>
                          </span>
                          <br />
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "50%",
                            height: "130px",
                          }}
                        >
                          <div
                            style={{
                              verticalAlign: "top",
                              width: "100%",
                              borderBottom: "2px solid #000",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            {" "}
                            <lbl style={{ display: "inline-block" }}>
                              {" "}
                              <b>Thu COD</b>
                            </lbl>
                            :{" "}
                            <span style={{ fontsize: "16px" }}>
                              <b>{FormatNumber(v.COD)} đ</b>
                            </span>
                            <br />{" "}
                          </div>
                          <div
                            style={{
                              verticalAlign: "top",
                              width: "100%",
                              borderBottom: "2px solid #000",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            {" "}
                            <lbl style={{ display: "inline-block" }}>
                              {" "}
                              <b>Thu NNTT</b>
                            </lbl>
                            :{" "}
                            <span style={{ fontsize: "16px" }}>
                              <b>{FormatNumber(v.AmountPrint)} đ</b>
                            </span>
                            <br />{" "}
                          </div>
                          <div
                            style={{
                              verticalAlign: "top",
                              width: "100%",
                              paddingTop: "10px",
                              paddingBottom: "5px",
                            }}
                          >
                            {" "}
                            <lbl style={{ display: "inline-block" }}>
                              {" "}
                              <b>Tổng thu</b>
                            </lbl>
                            :{" "}
                            <span style={{ fontsize: "16px" }}>
                              <b>{FormatNumber(v.TotalMoneyPrint)} đ</b>
                            </span>
                            <br />{" "}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <table
                      style={{ width: "100%", height: "130px" }}
                      cellspacing="0"
                      cellpadding="5"
                    >
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            paddingLeft: "5px",
                            height: "130px",
                            verticalAlign: "top",
                            borderRight: "2px solid #000",
                          }}
                        >
                          <lbl
                            style={{
                              display: "inline-block",
                              fontSize: "13px",
                              paddingBottom: "10px",
                              paddingLeft: "40px",
                            }}
                          >
                            <b>Sản phẩm và số lượng</b>
                          </lbl>
                          <br />
                          {v.ProductName != null ? (
                            <lbl
                              style={{
                                display: "inline-block",
                                marginTop: "3px",
                                paddingLeft: "5px",
                              }}
                            >
                              <span>{v.ProductName}</span>
                              <span>{v.ProductQuanlity}</span>
                              <br />
                            </lbl>
                          ) : (
                            <lbl
                              style={{
                                display: "inline-block",
                                marginTop: "3px",
                                paddingLeft: "5px",
                              }}
                            >
                              <span>{v.ProductName}</span>
                              <span>{v.ProductQuanlity}</span>
                              <br />
                            </lbl>
                          )}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "50%",
                            height: "130px",
                            paddingLeft: "5px",
                            textAlign: "center",
                          }}
                        >
                          <lbl
                            style={{
                              display: "inline-block",
                              fontSize: "13px",
                            }}
                          >
                            <b>Chữ ký người nhận</b>
                          </lbl>
                          <br />
                          <lbl
                            style={{
                              display: "inline-block",
                              fontSize: "11px",
                            }}
                          ></lbl>
                          <span style={{ fontSize: "11px" }}>
                            (Xác nhận hàng nguyên vẹn,không móp méo, bể/vỡ)
                          </span>
                          <br />
                          <lbl
                            style={{
                              display: "inline-block",
                              fontSize: "13px",
                              marginTop: "70px",
                            }}
                          ></lbl>
                          <span style={{ fontSize: "13px" }}>
                            {" "}
                            Đã nhận đủ tổng{" "}
                            <b>
                              <span style={{ fontSize: "14px" }}>
                                {v.Number}
                              </span>
                            </b>{" "}
                            kiện
                          </span>
                          <br />
                        </td>
                      </tr>
                    </table>
                  </div>
                );
              })}
            </div>
          );
        })
      );
    }
    //#endregion

    //#region in kiện a6
    else if (Keys === 5) {
    const result = await mainAction.API_spCallServer(
      "CPN_spLading_List_Detail",
      DataPrint,
      dispatch
    );
      debugger;
      await setHtmlPrint(
        DataPrint.map((v, index) => {
          let TotalNumber = result.filter((e) => e.Code === v.Code);
          return (
            <div key={"L" + index}>
              {pageprint.map((detail, ideles) => {
                return TotalNumber.map((v3, idele3) => {
                  //đặt biến trùng nhau nhiều
                  NumberPack++;
                  if (NumberPack === 4) NumberPack = 1;
                  debugger;
                  return (
                    <div
                      class="bill"
                      style={
                        NumberPack === 3
                          ? {
                            width: "470px",
                            height: "208px",
                            border: "2px solid #000",
                            marginBottom: "0px",
                            marginTop: "35px",
                            pageBreakAfter: "always",
                          }
                          : NumberPack === 1
                            ? {
                              width: "470px",
                              height: "208px",
                              border: "2px solid #000",
                              marginTop: "0px",
                            }
                            : {
                              width: "470px",
                              height: "208px",
                              border: "2px solid #000",
                              marginTop: "40px",
                            }
                      }
                    >
                      <table
                        style={{
                          width: "100%",
                          height: "40px",
                          borderBottom: "2px solid #000",
                        }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            style={{
                              width: "50%",
                              paddingLeft: "5px",
                              textAlign: "center",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <img
                              src="/assets/img/logo-gtel.png"
                              style={{ height: "30px" }}
                            />
                          </td>
                          <td style={{ width: "50%", paddingLeft: "5px" }}>
                            <div
                              style={{
                                padding: "2px 20px",
                                fontWeight: "bold",
                                fontSize: "15px",
                                borderBottom: "1px solid #000",
                                marginTop: "-8px",
                              }}
                            >
                              {" "}
                              MÃ KIỆN:{" "}
                              <span style={{ fontSize: "16px" }}>
                                <b>
                                  {idele3 + 1}/ {v3.Number}
                                </b>
                              </span>
                            </div>
                            <div
                              style={{
                                padding: "2px 20px",
                                fontWeight: "bold",
                                fontSize: "11px",
                              }}
                            >
                              Ngày tạo đơn : {FormatDateJson(v3.CreateDate, 1)}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table
                        style={{
                          width: "100%",
                          height: "85px",
                          textAlign: "center",
                        }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            colspan="2"
                            style={{ borderBottom: "2px solid black" }}
                          >
                            <div
                              class="doCode"
                              style={{
                                padding: "0px 8px",
                                fontWeight: "bold",
                                fontSize: "45px",
                                right: "0",
                                textAlign: "right",
                                marginRight: "0",
                                height: "75px",
                                padding: 0,
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <Barcode value={v3.NumberCode} height="35" />
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table
                        style={{ width: "100%", height: "55px" }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td
                            style={{
                              width: "25%",
                              paddingLeft: "5px",
                              textAlign: "center",
                              borderBottom: "2px solid #000",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <div
                              style={{
                                padding: "2px 10px",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {v3.POCodeFrom}
                            </div>
                          </td>
                          <td
                            style={{
                              width: "25%",
                              paddingLeft: "5px",
                              textAlign: "center",
                              borderBottom: "2px solid #000",
                              borderRight: "2px solid #000",
                            }}
                          >
                            <div
                              style={{
                                padding: "2px 50x",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {v3.POCodeTo}
                            </div>
                          </td>
                          <td
                            style={{
                              width: "50%",
                              paddingLeft: "5px",
                              borderBottom: "2px solid #000",
                            }}
                          >
                            <div
                              style={{
                                padding: "2px 20x",
                                fontSize: "12px",
                                marginTop: "-5px",
                                wordBreak: "break-all",
                              }}
                            >
                              Địa chỉ nhận: {v3.Street}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table
                        style={{ width: "100%", height: "28px" }}
                        cellspacing="0"
                        cellpadding="5"
                      >
                        <tr>
                          <td style={{ width: "20%", paddingLeft: "5px" }}>
                            <lbl
                              style={{
                                display: "inline-block",
                                fontSize: "12px",
                              }}
                            >
                              <b> Trọng lượng: </b>
                            </lbl>
                            <br />
                          </td>
                          <td
                            style={{
                              width: "30%",
                              paddingLeft: "5px",
                              borderRight: "2px solid #000",
                              fontSize: "12px",
                            }}
                          >
                            <span>
                              <b>{v3.Weight} (gram)</b>
                            </span>{" "}
                            <br />
                          </td>

                          <td style={{ width: "20%", paddingLeft: "5px" }}>
                            <lbl
                              style={{
                                display: "inline-block",
                                fontSize: "12px",
                              }}
                            >
                              <b>Loại dịch vụ:</b>
                            </lbl>
                          </td>
                          <td
                            style={{
                              width: "30%",
                              paddingLeft: "5px",
                              fontSize: "10px",
                            }}
                          >
                            <span>
                              <b>{v3.ServiceCode}</b>
                            </span>
                            <br />
                          </td>
                        </tr>
                      </table>
                    </div>
                  );
                });
              })}
            </div>
          );
        })
      );
    }
    //#endregion

    //#region  in bill và kiện  a6
    else if (Keys === 4) {
    const result = await mainAction.API_spCallServer(
      "CPN_spLading_List_Detail",
      DataPrint,
      dispatch
    );
      debugger;
      await setHtmlPrint(
        DataPrint.map((item, index) => {
          let TotalNumber = result.filter((e) => e.Code === item.Code);
          return (
            <div key={"L" + index}>
              {pageprint.map((detail, ideles) => {
                NumberPack = 0;
                return TotalNumber.map((v3, idele) => {
                  if (idele === 0) {
                    return (
                      <div
                        class="bill' + v.Code + '"
                        style={{
                          width: "470px",
                          height: "650px",
                          pageBreakBefore: "always",
                          pageBreakAfter: "always",
                          border: "2px solid #000",
                        }}
                      >
                        {GetPrintMask("A6", v3.PaymentType, v3.COD)}
                        <table
                          style={{
                            width: "100%",
                            fontWeight: "600",
                            borderBottom: "2px solid #000",
                            textAlign: "center",
                            height: "55px",
                          }}
                        >
                          <tr>
                            <td style={{ width: "50%", verticalAlign: "top" }}>
                              <img
                                src="/assets/img/logo-gtel.png"
                                style={{ height: "46px" }}
                              />
                            </td>
                            <td style={{ width: "50%", verticalAlign: "top" }}>
                              <div>
                                <p> PHIẾU GIAO HÀNG </p>
                              </div>
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  fontSize: "13px",
                                }}
                              >
                                {" "}
                                Ngày tạo : {FormatDateJson(v3.CreateDate, 1)}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{
                            width: "100%",
                            fontWeight: "600",
                            borderBottom: "2px solid #000",
                            textAlign: "center",
                            height: "90px",
                          }}
                        >
                          <tr>
                            <td>
                              <div
                                style={{
                                  padding: "0px 5px",
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <div class="code" style={{ width: "25%" }}>
                                  <Barcode value={v3.Code} height="35" />{" "}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #000",
                            fontSize: "13px",
                            height: "140px",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                borderRight: "2px solid #000",
                                width: "50%",
                                paddingLeft: "10px",
                                fontSize: "12px",
                                verticalAlign: "top",
                                height: "140px",
                              }}
                            >
                              <lbl style={{ display: "inline-block" }}>
                                {" "}
                                <b>Tên KH gửi</b>
                              </lbl>
                              : <span>{v3.CustomerName}</span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Mã khách hàng</b>
                              </lbl>
                              : <span>{v3.CustomerCode} </span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Người gửi </b>
                              </lbl>
                              : <span>{v3.CustomerName}</span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Điện thoại </b>
                              </lbl>
                              : <span>{v3.CustomerPhonePrint}</span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Địa chỉ</b>
                              </lbl>
                              :{" "}
                              <span style={{ wordbreak: "break-all" }}>
                                {v3.CustomerAddressPrint}
                              </span>
                              <br />
                            </td>
                            <td
                              style={{
                                width: "50%",
                                paddingLeft: "10px",
                                fontSize: "12px",
                                verticalAlign: "top",
                                height: "140px",
                              }}
                            >
                              <lbl style={{ display: "inline-block" }}>
                                {" "}
                                <b>Tên KH nhận</b>
                              </lbl>
                              : <span>{v3.RecipientCompany}</span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                {" "}
                                <b>
                                  {" "}
                                  {v3.RecipientType !== "" ? (
                                    "Loại khách nhận : "
                                  ) : (
                                    <></>
                                  )}
                                </b>
                              </lbl>
                              <span>
                                {v3.RecipientType !== "" ? (
                                  v3.RecipientType
                                ) : (
                                  <></>
                                )}
                              </span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Người nhận</b>
                              </lbl>
                              : <span>{v3.RecipientName}</span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Điện thoại</b>
                              </lbl>
                              : <span>{v3.RecipientPhonePrint}</span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                <b>Địa chỉ </b>
                              </lbl>
                              :{" "}
                              <span style={{ wordBreak: "break-all" }}>
                                {v3.Street}
                              </span>
                              <br />
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #000",
                            height: "85px",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                borderRight: "2px solid #000",
                                width: "2%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                height: "85px",
                              }}
                            >
                              <div
                                style={{
                                  padding: "0px 0px 9px 0px",
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                  borderBottom: "2px solid black",
                                }}
                              >
                                {v3.POCodeFrom}
                              </div>
                              <div
                                style={{
                                  padding: "2px 5x",
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                  paddingTop: "7px",
                                }}
                              >
                                {v3.POCodeTo}
                              </div>
                            </td>
                            <td
                              colspan="2"
                              style={{
                                width: "100%",
                                height: "70px",
                                textAlign: "center",
                              }}
                            >
                              <div
                                class="doCode"
                                style={{
                                  display: "block",
                                  textAlign: "center",
                                  top: "-17px",
                                  height: "80px",
                                }}
                              >
                                {v3.PartnerCode !== "" ? (
                                  <Barcode value={v3.PartnerCode} height="33" />
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{
                            width: "100%",
                            borderBottom: "2px solid #000",
                            fontSize: "13px",
                            height: "130px",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                borderRight: "2px solid #000",
                                width: "50%",
                                height: "130px",
                                paddingLeft: "10px",
                                fontSize: "12px",
                                verticalAlign: "top",
                              }}
                            >
                              <lbl style={{ display: "inline-block" }}>
                                {" "}
                                Số kiện
                              </lbl>
                              :{" "}
                              <span style={{ fontsize: "16px" }}>
                                <b>
                                  {1} / {v3.Number}
                                </b>
                              </span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                Khối lượng
                              </lbl>
                              :{" "}
                              <span style={{ fontsize: "16px" }}>
                                <b>{FormatNumber(v3.Weight)} (gram)</b>
                              </span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                Loại dịch vụ
                              </lbl>
                              :{" "}
                              <span style={{ fontsize: "16px" }}>
                                <b>{v3.ServiceName}</b>
                              </span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                Dịch vụ cộng thêm
                              </lbl>
                              :{" "}
                              <span style={{ fontsize: "16px" }}>
                                <b>{v3.ServiceGTGTName}</b>
                              </span>
                              <br />
                              <lbl style={{ display: "inline-block" }}>
                                Chỉ dẫn hàng hóa
                              </lbl>
                              :{" "}
                              <span>
                                <b>{v3.Description}</b>
                              </span>
                              <br />
                            </td>
                            <td
                              style={{
                                verticalAlign: "top",
                                width: "50%",
                                height: "130px",
                              }}
                            >
                              <div
                                style={{
                                  verticalAlign: "top",
                                  width: "100%",
                                  borderBottom: "2px solid #000",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                }}
                              >
                                {" "}
                                <lbl style={{ display: "inline-block" }}>
                                  {" "}
                                  <b>Thu COD</b>
                                </lbl>
                                :{" "}
                                <span style={{ fontsize: "16px" }}>
                                  <b>{FormatNumber(v3.COD)} đ</b>
                                </span>
                                <br />{" "}
                              </div>
                              <div
                                style={{
                                  verticalAlign: "top",
                                  width: "100%",
                                  borderBottom: "2px solid #000",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                }}
                              >
                                {" "}
                                <lbl style={{ display: "inline-block" }}>
                                  {" "}
                                  <b>Thu NNTT</b>
                                </lbl>
                                :{" "}
                                <span style={{ fontsize: "16px" }}>
                                  <b>{FormatNumber(v3.AmountPrint)} đ</b>
                                </span>
                                <br />{" "}
                              </div>
                              <div
                                style={{
                                  verticalAlign: "top",
                                  width: "100%",
                                  paddingTop: "10px",
                                  paddingBottom: "5px",
                                }}
                              >
                                {" "}
                                <lbl style={{ display: "inline-block" }}>
                                  {" "}
                                  <b>Tổng thu</b>
                                </lbl>
                                :{" "}
                                <span style={{ fontsize: "16px" }}>
                                  <b>{FormatNumber(v3.TotalMoneyPrint)} đ</b>
                                </span>
                                <br />{" "}
                              </div>
                            </td>
                          </tr>
                        </table>
                        <table
                          style={{ width: "100%", height: "130px" }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                width: "50%",
                                paddingLeft: "5px",
                                height: "130px",
                                verticalAlign: "top",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "13px",
                                  paddingBottom: "10px",
                                  paddingLeft: "40px",
                                }}
                              >
                                <b>Sản phẩm và số lượng</b>
                              </lbl>
                              <br />
                              {v3.ProductName != null ? (
                                <lbl
                                  style={{
                                    display: "inline-block",
                                    marginTop: "3px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  <span>{v3.ProductName}</span>
                                  <span>{v3.ProductQuanlity}</span>
                                  <br />
                                </lbl>
                              ) : (
                                <lbl
                                  style={{
                                    display: "inline-block",
                                    marginTop: "3px",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  <span>{v3.ProductName}</span>
                                  <span>{v3.ProductQuanlity}</span>
                                  <br />
                                </lbl>
                              )}
                            </td>
                            <td
                              style={{
                                verticalAlign: "top",
                                width: "50%",
                                height: "130px",
                                paddingLeft: "5px",
                                textAlign: "center",
                              }}
                            >
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "13px",
                                }}
                              >
                                <b>Chữ ký người nhận</b>
                              </lbl>
                              <br />
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "11px",
                                }}
                              ></lbl>
                              <span style={{ fontSize: "11px" }}>
                                (Xác nhận hàng nguyên vẹn,không móp méo, bể/vỡ)
                              </span>
                              <br />
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "13px",
                                  marginTop: "70px",
                                }}
                              ></lbl>
                              <span style={{ fontSize: "13px" }}>
                                {" "}
                                Đã nhận đủ tổng{" "}
                                <b>
                                  <span style={{ fontSize: "14px" }}>
                                    {v3.Number}
                                  </span>
                                </b>{" "}
                                kiện
                              </span>
                              <br />
                            </td>
                          </tr>
                        </table>
                      </div>
                    );
                  } else {
                    NumberPack++;
                    if (NumberPack === 4) NumberPack = 1;
                    debugger;
                    return (
                      <div
                        class="bill"
                        style={
                          NumberPack === 3
                            ? {
                              width: "470px",
                              height: "208px",
                              border: "2px solid #000",
                              marginBottom: "0px",
                              marginTop: "35px",
                              pageBreakAfter: "always",
                            }
                            : NumberPack === 1
                              ? {
                                width: "470px",
                                height: "208px",
                                border: "2px solid #000",
                                marginTop: "0px",
                              }
                              : {
                                width: "470px",
                                height: "208px",
                                border: "2px solid #000",
                                marginTop: "40px",
                              }
                        }
                      >
                        <table
                          style={{
                            width: "100%",
                            height: "40px",
                            borderBottom: "2px solid #000",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                width: "50%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <img
                                src="/assets/img/logo-gtel.png"
                                style={{ height: "30px" }}
                              />
                            </td>
                            <td style={{ width: "50%", paddingLeft: "5px" }}>
                              <div
                                style={{
                                  padding: "2px 20px",
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  borderBottom: "1px solid #000",
                                  marginTop: "-8px",
                                }}
                              >
                                {" "}
                                MÃ KIỆN:{" "}
                                <span style={{ fontSize: "16px" }}>
                                  <b>
                                    {idele + 1}/ {v3.Number}
                                  </b>
                                </span>
                              </div>
                              <div
                                style={{
                                  padding: "2px 20px",
                                  fontWeight: "bold",
                                  fontSize: "11px",
                                }}
                              >
                                Ngày tạo đơn :{" "}
                                {FormatDateJson(v3.CreateDate, 1)}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{
                            width: "100%",
                            height: "85px",
                            textAlign: "center",
                          }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              colspan="2"
                              style={{ borderBottom: "2px solid black" }}
                            >
                              <div
                                class="doCode"
                                style={{
                                  padding: "0px 8px",
                                  fontWeight: "bold",
                                  fontSize: "45px",
                                  right: "0",
                                  textAlign: "right",
                                  marginRight: "0",
                                  height: "75px",
                                  padding: 0,
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <Barcode value={v3.NumberCode} height="35" />
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{ width: "100%", height: "55px" }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td
                              style={{
                                width: "25%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                borderBottom: "2px solid #000",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <div
                                style={{
                                  padding: "2px 10px",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {v3.POCodeFrom}
                              </div>
                            </td>
                            <td
                              style={{
                                width: "25%",
                                paddingLeft: "5px",
                                textAlign: "center",
                                borderBottom: "2px solid #000",
                                borderRight: "2px solid #000",
                              }}
                            >
                              <div
                                style={{
                                  padding: "2px 50x",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {v3.POCodeTo}
                              </div>
                            </td>
                            <td
                              style={{
                                width: "50%",
                                paddingLeft: "5px",
                                borderBottom: "2px solid #000",
                              }}
                            >
                              <div
                                style={{
                                  padding: "2px 20x",
                                  fontSize: "12px",
                                  marginTop: "-5px",
                                  wordBreak: "break-all",
                                }}
                              >
                                Địa chỉ nhận: {v3.Street}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          style={{ width: "100%", height: "28px" }}
                          cellspacing="0"
                          cellpadding="5"
                        >
                          <tr>
                            <td style={{ width: "20%", paddingLeft: "5px" }}>
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                }}
                              >
                                <b> Trọng lượng: </b>
                              </lbl>
                              <br />
                            </td>
                            <td
                              style={{
                                width: "30%",
                                paddingLeft: "5px",
                                borderRight: "2px solid #000",
                                fontSize: "12px",
                              }}
                            >
                              <span>
                                <b>{v3.Weight} (gram)</b>
                              </span>{" "}
                              <br />
                            </td>

                            <td style={{ width: "20%", paddingLeft: "5px" }}>
                              <lbl
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                }}
                              >
                                <b>Loại dịch vụ:</b>
                              </lbl>
                            </td>
                            <td
                              style={{
                                width: "30%",
                                paddingLeft: "5px",
                                fontSize: "10px",
                              }}
                            >
                              <span>
                                <b>{v3.ServiceCode}</b>
                              </span>
                              <br />
                            </td>
                          </tr>
                        </table>
                      </div>
                    );
                  }
                });
              })}
            </div>
          );
        })
      );
    }
    //#endregion

    //#endregion SET HTML PRINT

    //#region Khởi tạo form in
    let _timeout = 1000;
    if (DataPrint.length > 100 && DataPrint.length < 200) _timeout = 2000;
    else if (DataPrint.length > 200) _timeout = 3000;
    let html = $("#barcodeTarget").html();
    html += `<script type="text/javascript">window.focus();setTimeout(function(){window.print();window.close();},${_timeout});</script>`;
    var myWindow = window.open("", "_blank");
    myWindow.document.write(
      '<html><head></head><body style="margin:0">' + html + "</body></html>"
    );
    //#endregion
  };

  const ChangeSheetPrint = (event) => {
    const sheetNumber = event.target.value;
    let db = [];
    setpageprint([]);
    if (sheetNumber !== "" && sheetNumber !== "0") {
      //setshowpage(sheetNumber);
      setsheetprint(sheetNumber);
      for (var i = 0; i < parseInt(sheetNumber); i++) {
        db.push(i);
      }
      setpageprint(db);
    }
  };

  const handleChange = (row) => {
    dataLading.find((p) => p.Id == row.original.Id).Checked =
      row.original.Checked == false ? true : false;
    setState({ list: dataLading });
    setDataPrint(dataLading.filter((p) => p.Checked === true));
  };

  const handleCheckAll = (e) => {
    let allChecked = IsChecked;
    setIsChecked(!IsChecked);
    dataLading.forEach((item) => {
      item.Checked = e.target.checked;
    });
    setState({ list: dataLading });
    setDataPrint(dataLading.filter((p) => p.Checked === true));
  };

  //#endregion In vận đơn

  //#region Danh sách vận đơn
  const GoToEdit = async (item) => {
    let LadingDetail = item._original;
    localStorage.setItem("LadingEdit", JSON.stringify(LadingDetail));
    history.push("/tao-nhanh-van-don");
  };

  const columns = [
    {
      Cell: (row) => (
        <div className="form-check" style={{ padding: "0 15px" }}>
          <label className="form-check-label" style={{ position: "unset" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id={row.original.Id}
              value={row.original.Id}
              checked={row.original.Checked}
              onChange={(e) => handleChange(row)}
            />
            <span className="form-check-sign" htmlFor={row.original.Id}>
              <span className="check"></span>
            </span>
          </label>
        </div>
      ),
      maxWidth: 40,
      textAlign: "center",
      filterable: false,
    },
    {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <span>
          <i
            className="fa fa-eye green"
            data-toggle="modal"
            data-target="#modalDetail"
            onClick={() => GoToDetail(row)}
            title="Chi tiết"
          ></i>{" "}
          {row._original.Status === 9 ? (
            <>
              <i
                className="fa fa-edit orange button"
                onClick={() => GoToEdit(row)}
                title="Sửa"
              ></i>
              <i
                className="fa fa-trash red button"
                onClick={() =>
                  window.confirm("Xác nhận xóa vận đơn " + row.Code + "?") &&
                  CPN_spLading_Delete_All(row)
                }
                title="Xóa"
              ></i>
            </>
          ) : (
            <i
              className="material-icons fontsizeicon14 orange"
              onClick={() => GoToComplain(row)}
              title="Khiếu nại"
            >
              description
            </i>
          )}
        </span>
      ),
      minWidth: 80,
      filterable: false,
    },
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
      filterable: false,
    },
    {
      Header: "Hình lấy hàng",
      accessor: "ImageOrderList",
      minWidth: 120,
      Cell: (item) => (
        <div>
          {item.value !== undefined && item.value !== "" && item.value !== null
            ? JSON.parse(item.value).map((img, index) => {
              return (
                <a
                  className="cursor"
                  data-toggle="modal"
                  data-target="#modalImg"
                  onClick={(e) => {
                    setModalImg(img.splitdata);
                  }}
                  title="Click để xem hình lớn"
                >
                  <img src={img.splitdata} width="50" />
                </a>
              );
            })
            : null}{" "}
        </div>
      ),
      filterable: false,
    },
    {
      Header: "Hình báo phát",
      accessor: "ImageDeliveryList",
      minWidth: 120,
      Cell: (item) => (
        <div>
          {item.value !== undefined && item.value !== "" && item.value !== null
            ? JSON.parse(item.value).map((img, index) => {
              return (
                <a
                  className="cursor"
                  data-toggle="modal"
                  data-target="#modalImg"
                  onClick={(e) => {
                    setModalImg(img.splitdata);
                  }}
                  title="Click để xem hình lớn"
                >
                  <img src={img.splitdata} width="50" />
                </a>
              );
            })
            : null}{" "}
        </div>
      ),
      filterable: false,
    },
    {
      Header: "Mã vận đơn",
      accessor: "Code",
      minWidth: 160,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Mã đối tác",
      accessor: "PartnerCode",
      minWidth: 150,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Thời gian gửi",
      accessor: "CreateDate",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Ước tính nhận",
      accessor: "DealineTime",
      minWidth: 140,
      Cell: (item) => <span>{FormatDateJson(item.value, 1)}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tình trạng",
      accessor: "StatusName",
      width: 190,
      Cell: (item) => (
        <span
          style={{
            background: "#65B168",
            color: "white",
            padding: "3px 7px",
            borderRadius: "4px",
          }}
        >
          {item.value}
        </span>
      ),
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Người nhận",
      accessor: "RecipientName",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tỉnh đi",
      accessor: "CitySendCode",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tỉnh đến",
      accessor: "CityRecipientCode",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Quận,Huyện đến",
      accessor: "District",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Phường,xã đến",
      accessor: "Wards",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Dịch vụ",
      accessor: "ServiceName",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Trọng lượng",
      accessor: "Weight",
      Cell: (item) => <span>{FormatNumber(item.value)} (gram)</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Số kiện",
      accessor: "Number",
      Cell: (item) => <span>{FormatNumber(item.value)}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Dài",
      accessor: "Length",
      Cell: (item) => <span>{item.value ? FormatNumber(item.value) : 0}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Rộng",
      accessor: "Width",
      Cell: (item) => <span>{item.value ? FormatNumber(item.value) : 0}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Cao",
      accessor: "Height",
      Cell: (item) => <span>{item.value ? FormatNumber(item.value) : 0}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Số khối",
      accessor: "Mass",
      Cell: (item) => <span>{item.value} (cbm)</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Thu hộ",
      accessor: "COD",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Khai giá",
      accessor: "Insured",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tổng tiền",
      accessor: "Amount",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Hình thức thanh toán",
      accessor: "PaymentString",
      minWidth: 160,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Thông tin nhận",
      minWidth: 140,
      accessor: "Recipient_reality",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Nội dung hàng hóa",
      minWidth: 140,
      accessor: "Description",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Ghi chú",
      minWidth: 140,
      accessor: "Noted",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
  ];

  //#endregion Danh sách vận đơn

  //#region Hình báo phát

  const ViewImg = (
    <div
      class="modal fade"
      id="modalImg"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalImg"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Hình ảnh báo phát</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center">
            <img src={ModalImg} width="100%" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-default btn-sm"
              data-dismiss="modal"
            >
              <i className="fa fa-close"></i> Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  //#endregion Hình báo phát

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus ">
          <div className="row margin-left-0">
            <div className="col-md-12 HomeTitle">Danh sách vận đơn</div>
          </div>
          <div className="row margin-left-0 width100 new margin-top-10">
            <div className="col-md-4 col-sm-4">
              <div className="form-group">
                <label>Từ ngày </label>
                <DateTimePicker
                  className="form-control listsearch"
                  onChange={(date) => FromDate(date)}
                  value={Fromdate}
                  format="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-4">
              <div className="form-group">
                <label>Đến ngày </label>
                <DateTimePicker
                  className="form-control listsearch"
                  onChange={(date) => ToDate(date)}
                  value={Todate}
                  format="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-4" style={{ marginTop: "8px" }}>
              <div className="">
                <label> Tìm theo mã vận đơn</label>
                <input
                  type="text"
                  className="form-control listsearch"
                  ref={LadingcodeRef}
                  {...bindLadingcode}
                  value={Ladingcode}
                  placeholder="Nhập mã vận đơn ..."
                />
              </div>
            </div>
            <div className="col-md-12 col-sm-12 text-center margin-top-10">
              <button
                disabled={Disable}
                onClick={() => {
                  APIC_spLadingGetMany(Status);
                }}
                type="button"
                className="btn text-transform btn-save btn-sm"
              >
                <i className="material-icons">search</i>
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={ExportAllToExcel}
                className="btn text-transform btn-refesh btn-sm"
                style={{ margin: "0 5px" }}
              >
                <img src="../assets/img/iconexcel.png" className="iconex" />
                Xuất excel tất cả vận đơn
              </button>
            </div>
          </div>
        </div>

        <div className="row cardcus Ladingstatus margin-top-20">
          <div className="col-md-8 row text-center margin-left-0">
            <span
              style={{
                color: "3A3A44",
                fontSize: "14px",
                fontWeight: "500",
                marginTop: "5px",
              }}
            >
              Trạng thái đơn hàng
            </span>
            <select
              className="form-control col-md-4 col-sm-4  listsearch col-xs-12 margin-left-15 margin-left"
              onChange={(e) => {
                APIC_spLadingGetMany(parseInt(e.target.value));
              }}
            >
              <option value="9">Mới tạo ({Status9})</option>
              <option value="1">Đang lấy hàng ({Status1})</option>
              <option value="2">Đã lấy hàng ({Status2})</option>
              <option value="3">Đang trung chuyển ({Status3})</option>
              <option value="4">Nhận tại CN phát ({Status4})</option>
              <option value="5">Đang phát ({Status5})</option>
              <option value="50">Đang phát lại ({Status50})</option>
              <option value="6">Phát thành công ({Status6})</option>
              <option value="7">Khai thác lại ({Status7})</option>
              <option value="8">Hoàn gốc ({Status8})</option>
              <option value="11">Lưu kho ({Status11})</option>
              <option value="0">
                Tất cả (
                {Status1 +
                  Status2 +
                  Status3 +
                  Status4 +
                  Status5 +
                  Status6 +
                  Status7 +
                  Status8 +
                  Status9 +
                  Status50 +
                  Status11}
                )
              </option>
            </select>
            <i
              class="fa fa-caret-down hide-sm"
              aria-hidden="true"
              style={{ marginTop: "13px", marginLeft: "-25px" }}
            ></i>
            {/*       <ul className="nav nav-pills nav-pills-warning hide-sm mt10" style={{ display: "inline-flex" }}>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link active show"
                  data-toggle="tab"
                  href="#link1"
                  onClick={() => {
                    APIC_spLadingGetMany(9);
                  }}
                >
                  Mới tạo&nbsp; ({Status9})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link2"
                  onClick={() => {
                    APIC_spLadingGetMany(1);
                  }}
                >
                  Đang lấy hàng&nbsp; ({Status1})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(2);
                  }}
                >
                  Đã lấy hàng&nbsp; ({Status2})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(3);
                  }}
                >
                  Đang trung chuyển&nbsp; ({Status3})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(4);
                  }}
                >
                  Nhận tại CN phát&nbsp; ({Status4})
                </a>
              </li>

              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(5);
                  }}
                >
                  Đang phát&nbsp; ({Status5})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(50);
                  }}
                >
                  Đang phát lại&nbsp; ({Status50})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link nav-linkpadding "
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(6);
                  }}
                >
                  Phát thành công&nbsp; ({Status6})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(7);
                  }}
                >
                  Khai thác lại&nbsp; ({Status7})
                </a>
              </li>
              <li className="nav-item whiteSpace">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#link3"
                  onClick={() => {
                    APIC_spLadingGetMany(8);
                  }}
                >
                  Hoàn gốc&nbsp; ({Status8})
                </a>
              </li>
            </ul> */}
          </div>
          <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
          <div
            className="col-md-12"
            style={{ color: "3A3A44", fontSize: "20px", fontWeight: "500" }}
          >
            {StatusName}
          </div>
          <div className="row width100 margin-left-0">
            <div className="col-md-3 margin-top-10">
              <div className="pull-left">
                <div className="form-check top0">
                  <label className="form-check-label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="checkAll"
                      checked={IsChecked}
                      onChange={handleCheckAll}
                    />
                    <span className="form-check-sign">
                      <span className="check"> </span>
                    </span>
                    Chọn tất cả
                  </label>
                </div>
              </div>
            </div>

            <div className="col-md-9 margin-bottom-10">
              <div className="pull-right">
                <div className="input-group text-right">
                  <div
                    class="input-group-prepend"
                    style={{ marginRight: "5px", marginTop: "8px" }}
                  >
                    Số liên cần in{" "}
                  </div>
                  <input
                    type="number"
                    value={sheetprint}
                    ref={sheetprintRef}
                    {...bindsheetprint}
                    onChange={(event) => ChangeSheetPrint(event)}
                    min="1"
                    max="10"
                    className="form-control maxwidth100"
                    placeholder="Số liên in"
                    style={{
                      height: "35px",
                      margin: "6px 5px",
                      borderRadius: "3px",
                    }}
                  />
                  <div class="Print dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      style={{ height: "36px" }}
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Chọn mẫu in
                    </button>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a
                        class="dropdown-item"
                        onClick={(e) => {
                          APIC_spLadingGetDataPrint(1);
                        }}
                      >
                        In bill (A5 + A4)
                      </a>
                      <a
                        class="dropdown-item"
                        onClick={(e) => {
                          APIC_spLadingGetDataPrint(0);
                        }}
                      >
                        In bill + kiện (A5 + A4)
                      </a>
                      <a
                        class="dropdown-item"
                        onClick={(e) => {
                          APIC_spLadingGetDataPrint(2);
                        }}
                      >
                        In kiện (A5 + A4)
                      </a>

                      <a
                        class="dropdown-item"
                        onClick={(e) => {
                          APIC_spLadingGetDataPrint(3);
                        }}
                      >
                        In bill A6
                      </a>
                      <a
                        class="dropdown-item"
                        onClick={(e) => {
                          APIC_spLadingGetDataPrint(4);
                        }}
                      >
                        In bill + kiện A6
                      </a>
                      <a
                        class="dropdown-item"
                        onClick={(e) => {
                          APIC_spLadingGetDataPrint(5);
                        }}
                      >
                        In kiện A6
                      </a>
                    </div>
                  </div>
                  <div className="form-group-append">
                    {/*    <select
                      className="form-control listsearch col-xs-12 margin-left-15 margin-left"
                      onChange={(e) => {
                        APIC_spLadingGetDataPrint(parseInt(e.target.value));
                      }}
                    >
                      <option value="-1">Vui lòng chọn form in</option>

                      <option value="0">In bill + kiện (A5 + A4) </option>
                      <option value="1">In bill (A5 + A4)</option>
                      <option value="2">In kiện (A5 + A4)</option>
                      <option value="0">In bill + kiện A6</option>
                      <option value="1">In bill A6</option>
                      <option value="2">In kiện A6</option>
                      <i class="fa fa-caret-down hide-sm" aria-hidden="true" style={{ marginTop: '13px', marginLeft: '-25px' }}></i>
                    </select> */}

                    {/*  <button
                      onClick={() => {
                        APIC_spLadingGetDataPrint(0);
                      }}
                      type="button"
                      className="btn btn-sm btn-save text-transform listsearch col-xs-12"
                      style={{ margin: '0 5px' }}
                    >
                      <i className="material-icons">print</i>
                      &nbsp; In bill + kiện
                    </button>
                    <button
                      onClick={() => {
                        APIC_spLadingGetDataPrint(1);
                      }}
                      type="button"
                      className="btn btn-sm btn-danger text-transform listsearch col-xs-12"
                      style={{ margin: '0 5px', fontSize: '14px' }}
                    >
                      <i className="material-icons">print</i>
                      &nbsp; In bill
                    </button>
                    <button
                      onClick={() => {
                        APIC_spLadingGetDataPrint(2);
                      }}
                      type="button"
                      className="btn btn-sm btn-info text-transform listsearch col-xs-12"
                      style={{ margin: '0 5px', fontSize: '14px' }}
                    >
                      <i className="material-icons">print</i>
                      &nbsp; In kiện
                    </button> */}
                  </div>
                  <button
                    type="button"
                    onClick={ExportToExcel}
                    className="btn btn-sm btn-refesh text-transform listsearch"
                    style={{ marginLeft: "30px" }}
                  >
                    <img src="../assets/img/iconexcel.png" className="iconex" />
                    Xuất excel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <DataTable data={dataLading} columns={columns} />
          </div>
        </div>
      </div>
      <img
        src="/assets/img/logo-gtel.png"
        style={{ display: "none" }}
      />
      <img
        src="/assets/img/iso9001.jpg"
        style={{ display: "none" }}
      />
      {ViewImg}
      <div
        class="modal"
        id="modalDetail"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modalDetail"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết vận đơn</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body scroller">
              {/* {ViewDetail} */}
              <LadingDetail LadingCode="" LadingId={DetailId} />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-default btn-sm"
                data-dismiss="modal"
              >
                <i className="fa fa-close"></i> Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="barcodeTarget" style={{ display: "none" }}>
        {HtmlPrint}
      </div>
    </LayoutMain>
  );
};
