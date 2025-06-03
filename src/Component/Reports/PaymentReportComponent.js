import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import $, { parseJSON } from "jquery";
import { put, takeEvery, take, cancel, delay, takeLatest } from 'redux-saga/effects';
import {
  Alertsuccess,
  Alerterror,
  DecodeString,
  FormatDate,
  FormatMoney,
  FormatNumber,
  FormatDateJson,
  GetCookie,
  GetCookieGroup,
  FirstOrLastDayinMonth,
  Alertwarning
} from "../../Utils";
import Axios from 'axios'
import { ReportAction } from "../../Redux/Actions/Reports";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { useInput } from "../../Hooks";
import { DataTable } from "../../Common/DataTable";
import { FormDataInCustomer } from "../../Common";
import { ExportExcel } from "../../Utils/ExportExcel";
import LayoutMain from "../../Layout/LayoutMain";

export const PaymentReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true); // disable button
  const history = useHistory();
  const [Invoiceview, setInvoiceview] = useState(true)
  const [DataGetInvoiceCheck, setDataGetInvoiceCheck] = useState(true)
  const [ListDatacheckEx, setListDatacheckEx] = useState([])
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [SelectMonth, setSelectMonth] = useState(FormatDateJson(new Date(), 2));
  const [hiddenmain, sethiddenmain] = useState(false)
  const [ReportData, setReportData] = useState([]);
  const [ReportDataDetail, setReportDataDetail] = useState([]);
  const [ShowList, setShowList] = useState("display-none");
  const [Code_Payment, setCode_Payment] = useState("");
  const [DataPrints, setDataPrints] = useState([])
  const [Hiddencheck, setHiddencheck] = useState(true)
  const [HiddenTableDT, setHiddenTableDT] = useState(true)
  const [IdListDT, setIdListDT] = useState(-1)
  const [IdList, setIdList] = useState(-1)
  const [HiddenTable, setHiddenTable] = useState(true)
  const [ListDatacheckPrint, setListDatacheckPrint] = useState([])
  let Firstday = FirstOrLastDayinMonth(new Date(), 1);
  const [DataExcelExport, setDataExcelExport] = useState([])
  const [DataGetInvoice, setDataGetInvoice] = useState([])
  const [Deadline, setDeadline] = useState(FirstOrLastDayinMonth(new Date(), 2, 30))
  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
  }, []);

  const [NoData, setNoData] = useState("display-none");
  const ViewReport = async () => {
    //ScrollTop();
    setDisable(false);
    if (SelectMonth === null) {
      Alerterror("Chọn tháng");
      return false;
    }
    let time = SelectMonth.split('-');
    let params = {
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      Month: parseInt(time[1]),
      Year: parseInt(time[0])
    };
    debugger
    let pr = {
      Json: JSON.stringify(params),
      func: "APIC_spPaymentReportJson",
      API_key: APIKey,
      TokenDevices: TOKEN_DEVICE,
    };
    const data = await mainAction.API_spCallServer(pr, dispatch);
    setReportData(data);
    if (data.length === 0) setNoData("");
    else setNoData("display-none");
    setDisable(true);
    //PaginationTable();
    setShowList("");

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };
  const FRM_spPaymentRevenue_GetInvoice = async (code) => {
    try {
      setCode_Payment(code)
      const params = {
        Json: JSON.stringify({
          BkpaymentCode: code
        }),
        func: "FRM_spPaymentRevenue_GetInvoice",
        API_key: "netcoApikey2025"
      }
      debugger
      mainAction.LOADING({ IsLoading: true }, dispatch);
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        setDataGetInvoice(result)
        setDataGetInvoiceCheck(false)
        sethiddenmain(!hiddenmain)
        mainAction.LOADING({ IsLoading: false }, dispatch);
      } else {
        Alerterror("Không có dữ liệu hóa đơn!")
        setDataGetInvoice([])
        mainAction.LOADING({ IsLoading: false }, dispatch);
      }
    } catch (error) {
      console.log(error);
      mainAction.LOADING({ IsLoading: false }, dispatch);
    }
  }
  const CPN_spGetBkPaymentCustomerDetailExport = async (Ojb) => {
    debugger
    try {
      setCode_Payment(Ojb.Code)
      const pr = {
        IdBK: Ojb.Id,
        CustomerId: CustomerID,
        FromDate: Ojb.Start_date,
        ToDate: Ojb.End_date,
        IsCheck: 0,
        KeyCheckPayment: 0
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "CPN_spGetBkPaymentCustomerDetailExport",
        API_key: "netcoApikey2025"
      }
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        setReportDataDetail(result)
        sethiddenmain(!hiddenmain)
        setDataExcelExport(JSON.stringify(pr))
        setIdListDT(0)
        setIdList(-1)
      } else {
        Alerterror("Không có dữ liệu!")
        setIdListDT(-1)
        setIdList(-1)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const FRM_spPaySlipImport_ElectronicBillDraft = async (Id, user, pass) => {
    try {
      var axios = require('axios');
      var data = JSON.stringify({
        "ImportPlayslipId": Id,
        "ViettelUser": user,
        "ViettelPass": pass
      });
      mainAction.LOADING({ IsLoading: true }, dispatch);
      var config = {
        method: 'post',
        url: 'https://erp-ac.vps.vn/api/InvoiceAPI/FRM_spPaySlipImport_ElectronicBillDraft',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*"
        },
        data: data
      };
      axios(config).then(function (response) {
        mainAction.LOADING({ IsLoading: false }, dispatch);
        $('.previewbill').html('')
        setInvoiceview(false)
        setDataGetInvoiceCheck(true)
        $.each(response.data, function (k, v) {
          $('.previewbill').append('<object style="width:1000px;height:700px;" type="application/pdf" data="data:application/pdf;base64,' + v.fileToBytes + '"></object>');
        });
      }).catch(function (error) {
        mainAction.LOADING({ IsLoading: false }, dispatch);
        Alerterror("Không có dữ liệu hóa đơn!");
        console.log(error, "FRM_spPaySlipImport_ElectronicBillDraft");
      });
    }
    catch (e) {
      mainAction.LOADING({ IsLoading: false }, dispatch);
      Alerterror("Lỗi dữ liệu, Vui lòng liên hệ CSKH!");
    }
  }

  const ShowExcel = async () => {
    try {
      debugger
      var settings = {
        "url": "https://api-v4-erp.vps.vn/api/ApiMain/CPN_spGetBkPaymentCustomerDetailExport",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "x-api-key": "we-l0v3-v1et-qr",
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "Json": JSON.stringify({
            Month: parseFloat(SelectMonth.split("-")[1]),
            Year: parseFloat(SelectMonth.split("-")[0]),
            ListDatacheck: ListDatacheckEx.filter(e => e.KeyCheck === true),
            OfficerId: 0,
            OfficerName: '',
            PostOfficeCreateId: 0,
            PostOfficeName: '',
            KeyCheck: 0,
            Deadline: Deadline,
            KeyCheckPayment: 0
          }),
          "DetailEPJson": DataExcelExport,
          "func": "CPN_spGetBkPaymentCustomerDetailExport_V2",
          "API_key": "netcoApikey2025"
        }),
      };
      $.ajax(settings).done(function (response) {
        let _data = JSON.parse(response)
        if (_data.resultCode === 0) {
          window.location.href = "https://api-v4-erp.vps.vn" + _data.Message;
        }
      });
    }
    catch (e) {
      Alerterror("Lỗi dữ liệu, Vui lòng liên hệ CSKH!");
    }
  }

  const Print = (e) => {
    debugger
    let Ojb = e.row._original
    setDataPrints(Ojb)
    setHiddencheck(false)
    setReportDataDetail([])
    setIdList(0)
  }
  //#region  Print biên bản
  const [HtmlPrint, setHtmlPrint] = useState([]);
  const PrintSelect = async () => {
    await setHtmlPrint([]);
    debugger
    const pr = {
      IdBK: DataPrints.Id,
      CustomerId: DataPrints.CustomerId,
      FromDate: DataPrints.Start_date,
      ToDate: DataPrints.End_date,
      IsCheck: 0,
      KeyCheckPayment: 0
    }
    const params = {
      Json: JSON.stringify(pr),
      func: "CPN_spGetBkPaymentCustomerDetailExport",
      API_key: "netcoApikey2025"
    }
    const result = await mainAction.API_spCallServer(params, dispatch);
    //#region 
    let DataPrint = [],
      CustomerCode = "",
      CustomerName = "",
      Tax_Code = "",
      Adress_CT = "",
      Address = "",
      Phone = "",
      Officer_Postman = "",//
      Branch = "",
      BranchName = "",
      POAddress = "",
      POPhone = "",
      BankName = "",
      Officer_Liabilities = "",//
      Phone_Liabilities = "",//
      Email_Liabilities = "",//
      Business_Office = "",//
      Phone_Business = "",//
      Email_Business = "",//
      OfficerNameDebt = "",
      PhoneOfficerDebt = "",
      EmailOfficerDebt = "",
      TotalWeight = 0, // tổng trọng lượng
      TotalNumber = 0, // số kiện
      TotalMass = 0, // số khối
      TotalPriceMain = 0, //cước phí
      TotalPackPrice = 0, // pp đóng gói
      TotalCOD = 0, // tiền COD
      TotalCODPrice = 0, // phí COD
      TotalInsuredPrice = 0, // phí khai giá
      ToatlTHBBPrice = 0, // phí thu hồi biên bản , báo phát
      ToatlAllowance = 0, // phí đi phát
      TotalPPXD = 0, // phí XD
      TotalVAT = 0, //phí VAT
      TotalCPHI = 0, // Tổng cước phí 
      TotalDiscountAmount = 0, // giảm giá
      TotalCTT = 0, // Cần Thanh toán
      TotalBPPrice = 0, // tiền báo phát
      TotalOnSiteDeliveryMoney = 0, // phụ cấp ngoại tuyến
      TotalHDPrice = 0, // phí hóa đơn
      TotalNPDKPrice = 0, //Phí N/P đồng kiểm
      TotalPTTPrice = 0, // Phí phát tận tay
      TotalHQKPrice = 0, //Phí hàng quá khổ
      TotalPSTPrice = 0, // Phí phát siêu thị
      TotalPDPQPrice = 0, // Phí phát đảo phú quốc
      TotalDiscountLading = 0,// Tổng giảm giá
      TotalFloorPrice = 0, // Phí bê tầng
      newdate = new Date();
    //#endregion
    let daylast = new Date(parseFloat(SelectMonth.split("-")[0]), parseFloat(SelectMonth.split("-")[1]), 0);
    let dayin = daylast;
    let thu = dayin.getDay();
    let dayprint = dayin.getDate();
    if (thu === 0) {
      dayprint = dayprint - 1;
    }
    else {
      dayprint = dayprint;
    }

    result.forEach(v => {
      TotalWeight += v.Weight; // tổng KG
      TotalNumber += v.Number; //tổng số kiện
      TotalMass += v.Mass; //tổng số khối
      TotalPriceMain += v.PriceMain - v.OnSiteDeliveryMoney ?? 0;// cước phí
      TotalPackPrice += v.PackPrice;// phí đóng gói
      TotalCOD += v.COD; // tiền COD
      TotalCODPrice += v.CODPrice; //phí COD
      TotalInsuredPrice += v.InsuredPrice; // phí khai giá  báo phát
      ToatlTHBBPrice += v.THBBPrice + v.BPPrice;// phụ cấp thbb báo phát
      ToatlAllowance += v.Allowance;// phụ cấp đi phát
      TotalPPXD += v.PPXDMoney; // tổng PPXD
      TotalVAT += v.VATMoney; // tổng VAT
      TotalDiscountAmount += v.DiscountAmount;// giảm giá
      TotalOnSiteDeliveryMoney += v.OnSiteDeliveryMoney; // phát ngoại tuyến
      TotalHDPrice += v.HDPrice; // phí hóa đơn
      TotalNPDKPrice += v.NPDKPrice; //Phí N/P đồng kiểm
      TotalPTTPrice += v.PTTPrice; // Phí phát tận tay
      TotalHQKPrice += v.HQKPrice; //Phí hàng quá khổ
      TotalPSTPrice += v.PSTPrice; // Phí phát siêu thị
      TotalPDPQPrice += v.PDPQPrice; // Phí phát đảo phú quốc
      TotalDiscountLading += v.DiscountAmount;
      TotalFloorPrice += v.FloorPrice;
      TotalCPHI += v.Amount;
      CustomerCode = v.CustomerCode;
      CustomerName = v.CustomerName;
      Adress_CT = v.Adress_CT === null ? '' : v.Adress_CT;
      Tax_Code = v.Tax_Code;
      Address = v.Address;
      Phone = v.Phone;
      Branch = v.Branch;
      BranchName = v.BranchName;
      POAddress = v.POAddress;
      POPhone = v.POPhone;
      BankName = v.PoBankName;
      Officer_Liabilities = v.Officer_LiabilitiesName;
      Phone_Liabilities = v.Officer_LiabilitiesPhone;
      Email_Liabilities = v.Officer_LiabilitiesAddress;
      Business_Office = v.Officer_ServiceName;
      Phone_Business = v.Phone_Business;
      Email_Business = v.Email_Business;
      Officer_Postman = v.OfficerNamePostman;
      OfficerNameDebt = v.OfficerNameDebt;
      PhoneOfficerDebt = v.PhoneOfficerDebt;
      EmailOfficerDebt = v.EmailOfficerDebt
    })
    DataPrint.push(
      <div className="bill" style={{ width: "100%", height: "98%", pageBreakBefore: "always", pageBreakAfter: "always" }}>
        <table style={{ marginBottom: "30px", width: "100%" }}>
          <tr>
            <td style={{ width: "200px", verticalAlign: "top" }}>
              <table>
                <tr><td><img src="../../assets/img/logo-gtel.png" style={{ width: "200px" }} /></td></tr>
                <tr><td style={{ fontStyle: "italic", fontSize: "13px" }}>Ngày in: {FormatDateJson(newdate)}</td></tr>
              </table>
            </td>
            <td style={{ marginLeft: "10px", width: "100%", position: "relative", verticalAlign: "top" }}>
              <table style={{ fontSize: "12px", width: "100%", marginLeft: "10px" }}>
                <tr><td style={{ textAlign: "center" }}><b>CÔNG TY CỔ PHẦN THƯƠNG MẠI & CHUYỂN PHÁT NHANH NỘI BÀI</b></td></tr>
                <tr><td style={{ textAlign: "center" }}><b>Địa chỉ : Tầng 8, Tháp B, Tòa nhà Sông Đà, Phường Mỹ Đình, Quận Nam Từ Liêm, Hà Nội</b></td></tr>
                <tr><td style={{ textAlign: "center" }}><b>Email : <i>info@netco.com.vn</i> - Website: <i>www.netco.com.vn</i> - Hotline : <i>19006463</i></b></td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "30px" }}>
          <tr><td style={{ textAlign: "center", fontSize: "20px", textTransform: "uppercase" }}><b>{`BẢNG KÊ CÔNG NỢ THÁNG ${parseFloat(SelectMonth.split("-")[1])} NĂM ${parseFloat(SelectMonth.split("-")[0])}`}</b></td></tr>
        </table>

        <table style={{ width: "100%", marginBottom: "5px", marginTop: '30px' }}>
          <tr>
            <td style={{ width: "50%", verticalAlign: "top" }}>
              <table>
                <tr><td colSpan={2}><b>THÔNG TIN KHÁCH HÀNG</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Mã Khách Hàng:</td><td style={{ fontSize: "10px" }}><b>{CustomerCode}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Tên Khách Hàng:</td><td style={{ fontSize: "10px" }}><b>{CustomerName}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Địa Chỉ:</td><td style={{ fontSize: "10px" }}><b>{Adress_CT}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Mã Số Thuế:</td><td style={{ fontSize: "10px" }}><b>{Tax_Code}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Địa Chỉ Giao Dịch:</td><td style={{ fontSize: "10px" }}><b>{Address}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Người Liên Hệ:</td><td style={{ fontSize: "10px" }}></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Điện Thoại:</td><td style={{ fontSize: "10px" }}><b>{Phone}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Tuyến Giao Dịch:</td><td style={{ fontSize: "10px" }}><b>{Officer_Postman}</b></td></tr>
              </table>
            </td>
            <td style={{ width: "50%", verticalAlign: "top" }}>
              <table>
                <tr><td colSpan={2}><b>THÔNG TIN THANH TOÁN</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Chi Nhánh:</td><td style={{ fontSize: "10px" }}><b>{Branch}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Tên Chi Nhánh:</td><td style={{ fontSize: "10px" }}><b>{BranchName}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Địa Chỉ:</td><td style={{ fontSize: "10px" }}><b>{POAddress}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Điện Thoại:</td><td style={{ fontSize: "10px" }}><b>{POPhone}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Số TK:</td><td style={{ fontSize: "10px" }}><b>Ghi trên hóa đơn</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Ngân Hàng:</td><td style={{ fontSize: "10px" }}><b>{BankName}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Tuyến C.Nợ:</td><td style={{ fontSize: "10px" }}><b>{`${OfficerNameDebt}/ ${PhoneOfficerDebt}/ ${EmailOfficerDebt}`}</b></td></tr>
                <tr><td style={{ width: "100px", fontSize: "10px" }}>Tuyến CSKH:</td><td style={{ fontSize: "10px" }}><b>{`${Business_Office}/ ${Phone_Business}/ ${Email_Business}`}</b></td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", fontSize: "10px" }}>
          <tr style={{ float: 'right' }}>
            <td style={{ width: "100%", fontSize: "10px" }}>
              <b>Đơn Vị Tính: VNĐ</b>
              <div style={{ position: 'relative', paddingTop: '-100px', clear: 'left' }}>
                <img src="../../assets/img/logo-gtel.png" style={{ position: 'fixed', width: '30%', opacity: '0.1', marginTop: '85px', right: '180px', transform: 'rotate(45deg)' }} />
                <img src="../../assets/img/logo-gtel.png" style={{ position: 'fixed', width: '30%', opacity: '0.1', marginTop: '85px', left: '40px', transform: 'rotate(45deg)' }} />

              </div>
            </td>
          </tr>
        </table>

        <table style={{ marginTop: "5px", width: "99%", fontSize: "10px", borderCollapse: "collapse" }} border={1} cellPadding={4}>
          <thead>
            <th>STT</th>
            <th style={{ width: "30px" }}>Ngày Gửi</th>
            <th>Mã Bill</th>
            <th>Tĩnh Đến</th>
            <th>Dịch Vụ</th>
            <th>Trọng Lượng (gram)</th>
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Số kiện" && e.KeyCheck === true)
                return <th>Số Kiện</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Sô khối" && e.KeyCheck === true)
                return <th>Số Khối</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Cước phí" && e.KeyCheck === true)
                return <th>Cước Phí</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "PP Đóng gói" && e.KeyCheck === true)
                return <th>Đóng Gói</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Tiền COD" && e.KeyCheck === true)
                return <th>Tiền COD</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Tiền COD" && e.KeyCheck === true)
                return <th>Tiền COD</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí COD" && e.KeyCheck === true)
                return <th>Phí COD</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí khai giá" && e.KeyCheck === true)
                return <th>Phí Khai Giá</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí THBB, BP" && e.KeyCheck === true)
                return <th>Phí THBB, BP</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí hóa đơn" && e.KeyCheck === true)
                return <th>Phí HĐ</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí N/P đồng kiểm" && e.KeyCheck === true)
                return <th>Phí N/P Đồng Kiểm</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí phát tận tay" && e.KeyCheck === true)
                return <th>Phát Tận Tay</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí hàng quá khổ" && e.KeyCheck === true)
                return <th>Hàng Quá Khổ</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí phát siêu thị" && e.KeyCheck === true)
                return <th>Phát ST</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí phát đảo phú quốc" && e.KeyCheck === true)
                return <th>Phát Đảo Phú Quốc</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phụ cấp đi phát" && e.KeyCheck === true)
                return <th>Phụ Cấp</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Phí ngoại tuyến" && e.KeyCheck === true)
                return <th>Phí Ngoại Tuyến</th>
            })}

            {ListDatacheckPrint.map(e => {
              if (e.Name === "PPXD" && e.KeyCheck === true)
                return <th>PPXD</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "VAT" && e.KeyCheck === true)
                return <th>VAT</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Tổng cước" && e.KeyCheck === true)
                return <th>Tổng Cước</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Giảm giá" && e.KeyCheck === true)
                return <th>Giảm Giá</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Cần thanh toán" && e.KeyCheck === true)
                return <th>Cần Thanh Toán</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Tên người gửi" && e.KeyCheck === true)
                return <th>Tên Người Gửi</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Tên người nhận" && e.KeyCheck === true)
                return <th>Tên Người Nhận</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Địa chỉ phát" && e.KeyCheck === true)
                return <th>Đ/C Phát</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Người nhận thực tế" && e.KeyCheck === true)
                return <th>Người Nhận Thực Tế</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Ngày nhận thực tế" && e.KeyCheck === true)
                return <th>Ngày Nhận Thực Tế</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Tên Ng gửi thực tế" && e.KeyCheck === true)
                return <th>Ng Gửi TT</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Đ/C Ng gửi thực tế" && e.KeyCheck === true)
                return <th>Đ/C Ng Gửi TT</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "SĐT Ng gửi thực tế" && e.KeyCheck === true)
                return <th>SĐT Ng Gửi TT</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Mã đối tác" && e.KeyCheck === true)
                return <th>Mã Đối Tác</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Ghi chú" && e.KeyCheck === true)
                return <th>Ghi Chú</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Số phiếu thu" && e.KeyCheck === true)
                return <th>Số Phiếu Thu</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Nội dung hàng hóa" && e.KeyCheck === true)
                return <th>Nội Dung HH</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "N.V đi phát" && e.KeyCheck === true)
                return <th>N.V Phát</th>
            })}
            {ListDatacheckPrint.map(e => {
              if (e.Name === "Huyện đến" && e.KeyCheck === true)
                return <th>Huyện Đến</th>
            })}
            {ListDatacheckPrint.map(e => {

              if (e.Name === "Phí bê tầng" && e.KeyCheck === true)
                return <th>Phí bê tầng</th>
            })}
          </thead>
          <tbody>
            {
              result.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "center" }}>{FormatDateJson(item.CreateDate, 6)}</td>
                    <td style={{ textAlign: "center" }}>{item.Code}</td>
                    <td style={{ textAlign: "center" }}>{item.CityRecipientName}</td>
                    <td style={{ textAlign: "center" }}>{item.ServiceCode}</td>
                    <td style={{ textAlign: "center" }}>{item.Weight}</td>
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Số kiện" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.Number}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Sô khối" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.Mass}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Cước phí" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{FormatMoney(item.PriceMain, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "PP Đóng gói" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PackPrice === 0 ? '-' : FormatMoney(item.PackPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Tiền COD" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.COD === 0 ? '-' : FormatMoney(item.COD, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí COD" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.CODPrice === 0 ? '-' : FormatMoney(item.CODPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí khai giá" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.InsuredPrice === 0 ? '-' : FormatMoney(item.InsuredPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí THBB, BP" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.THBBPrice + item.BPPrice === 0 ? '-' : FormatMoney((item.THBBPrice + item.BPPrice), 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí hóa đơn" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.HDPrice === 0 ? '-' : FormatMoney(item.HDPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí N/P đồng kiểm" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.NPDKPrice === 0 ? '-' : FormatMoney(item.NPDKPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí phát tận tay" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PTTPrice === 0 ? '-' : FormatMoney(item.PTTPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí hàng quá khổ" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.HQKPrice === 0 ? '-' : FormatMoney(item.HQKPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí phát siêu thị" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PSTPrice === 0 ? '-' : FormatMoney(item.PSTPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí phát đảo phú quốc" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PDPQPrice === 0 ? '-' : FormatMoney(item.PDPQPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phụ cấp đi phát" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.Allowance === 0 ? '-' : FormatMoney(item.Allowance, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí ngoại tuyến" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.OnSiteDeliveryMoney === 0 ? '-' : FormatMoney(item.OnSiteDeliveryMoney, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Phí bê tầng" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.FloorPrice === 0 ? '-' : FormatMoney(item.FloorPrice, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "PPXD" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PPXDMoney === 0 ? '-' : FormatMoney(item.PPXDMoney, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "VAT" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.VATMoney === 0 ? '-' : FormatNumber(item.VATMoney)}</td>
                    })}

                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Tổng cước" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center", backgroundColor: "#eae9e9" }}><b>{FormatMoney(item.Amount, 0)}</b></td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Giảm giá" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{FormatMoney(item.DiscountAmount, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Cần thanh toán" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center", backgroundColor: "#eae9e9" }}>{FormatMoney((item.Amount - item.DiscountAmount), 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Tên người gửi" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.SenderName}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Tên người nhận" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.RecipientName}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Địa chỉ phát" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.RecipientAddress}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Người nhận thực tế" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.Recipient_reality}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Ngày nhận thực tế" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{FormatDateJson(item.FinishDate, 0)}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Tên Ng gửi thực tế" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.NameSender}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Đ/C Ng gửi thực tế" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.AddressSender}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "SĐT Ng gửi thực tế" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PhoneSender}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Mã đối tác" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.PartnerCode}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Ghi chú" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.Noted}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Số phiếu thu" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.ReceiptsDebt_Code}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Nội dung hàng hóa" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.Description}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "N.V đi phát" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.OfficerDelivery}</td>
                    })}
                    {ListDatacheckPrint.map(e => {
                      if (e.Name === "Huyện đến" && e.KeyCheck === true)
                        return <td style={{ textAlign: "center" }}>{item.DistrictTo}</td>
                    })}
                  </tr>
                )
              })
            }
            <tr rowspan={2}>
              <td style={{ textAlign: "center", fontSize: "20px", backgroundColor: "#bdbcbc6b" }} colSpan={5} ><b>Tổng Cộng</b></td>
              <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{TotalWeight}</b></td>
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Số kiện" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{TotalNumber}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Sô khối" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{TotalMass}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Cước phí" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalPriceMain, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "PP Đóng gói" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalPackPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Tiền COD" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalCOD, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí COD" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalCODPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí khai giá" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalInsuredPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí THBB, BP" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(ToatlTHBBPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí hóa đơn" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalHDPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí N/P đồng kiểm" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalNPDKPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí phát tận tay" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalPTTPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí hàng quá khổ" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalHQKPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí phát siêu thị" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalPSTPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí phát đảo phú quốc" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalPDPQPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phụ cấp đi phát" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(ToatlAllowance, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí ngoại tuyến" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalOnSiteDeliveryMoney, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Phí bê tầng" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalFloorPrice, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "PPXD" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalPPXD, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "VAT" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatNumber(TotalVAT, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Tổng cước" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b", fontWeight: 'bolder' }}><b>{FormatMoney(TotalCPHI, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Giảm giá" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney(TotalDiscountLading, 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Cần thanh toán" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}><b>{FormatMoney((TotalCPHI - TotalDiscountLading), 0)}</b></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Tên người gửi" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Tên người nhận" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Địa chỉ phát" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Người nhận thực tế" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Ngày nhận thực tế" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Tên Ng gửi thực tế" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Đ/C Ng gửi thực tế" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "SĐT Ng gửi thực tế" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Mã đối tác" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Ghi chú" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Số phiếu thu" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Nội dung hàng hóa" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "N.V đi phát" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
              {ListDatacheckPrint.map(e => {
                if (e.Name === "Huyện đến" && e.KeyCheck === true)
                  return <td style={{ textAlign: "center", fontSize: "13px", backgroundColor: "#bdbcbc6b" }}></td>
              })}
            </tr>
          </tbody>
        </table>
        <table style={{ width: "100%", marginTop: "10px", paddingLeft: '50px', fontSize: '12px' }}>
          <tr><td> <b>Ghi Chú</b></td></tr>
          <tr><td>- Phụ phí xăng dầu sẽ thay đổi theo từng tháng.</td></tr>
          <tr><td>- Quý khách hàng vui lòng kiểm tra và thanh toán trong 07 ngày kể từ ngày nhận được bảng kê thông báo.</td></tr>
          <tr><td>- Mọi thắc mắc xin vui lòng liên hệ với nhân viên kế toán công nợ hoặc nhân viên CSKH <b>(Thông tin liên hệ ở trên)</b></td></tr>
          <tr><td>- Mọi ý kiến đóng góp để nâng cao chất lượng dịch vụ, Quý khách hàng vui lòng gửi Email về điạ chỉ: <b>CEO@netco.com.vn</b>.</td></tr>
        </table>
        <table style={{ width: "100%", marginTop: "20px", verticalAlign: "top" }}>
          <tr>
            <td style={{ width: "40%" }}>
              <table style={{ width: "100%", marginTop: "5px", textAlign: "center", fontSize: "12px" }}>
                <tr><td colSpan={2}></td></tr>
                <tr><td colSpan={2}><b>ĐẠI DIỆN KHÁCH HÀNG</b></td></tr>
                <tr><td style={{ fontStyle: 'italic' }}>(Ký,ghi rõ họ tên)</td></tr>
              </table>
            </td>
            <td style={{ width: "10%" }}>
              <table style={{ width: "100%", marginTop: "5px", textAlign: "center", fontSize: "12px" }}>
                <tr><td colSpan={2}></td></tr>
                <tr><td colSpan={2}></td></tr>
                <tr><td colSpan={2}></td></tr>
              </table>
            </td>

            <td style={{ width: "40%" }}>
              <table style={{ width: "100%", marginTop: "5px", textAlign: "center", fontSize: "12px" }}>
                <tr><td ><a>{Branch},Ngày {dayprint} tháng {parseFloat(SelectMonth.split("-")[1])} năm {parseFloat(SelectMonth.split("-")[0])}</a></td></tr>
                <tr><td colSpan={2}><b>ĐẠI DIỆN NETCO</b></td></tr>
                <tr><td style={{ fontStyle: 'italic' }}>(Ký,ghi rõ họ tên)</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    )
    setHtmlPrint(DataPrint)
    //#region Khởi tạo form in
    let html = $("#barcodeTarget").html();
    const iframe = document.createElement('iframe')
    iframe.name = 'printf'
    iframe.id = 'printf'
    iframe.height = 0;
    iframe.width = 0;
    document.body.appendChild(iframe)
    var newWin = window.frames["printf"];
    newWin.document.write(`<body onload="window.print()">${html}</body>`);
    newWin.document.close();


  }
  const columns = [
    {
      Header: "Tùy chọn",
      fixed: "left",
      width: 300,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button className="btn btn-xs btn-primary" onClick={(e) => FRM_spPaymentRevenue_GetInvoice(row.original.Code)}><i className="material-icons">download</i> Hóa đơn</button>
            <button className="btn btn-xs btn-success" onClick={(e) => CPN_spGetBkPaymentCustomerDetailExport(row.original)}><i className="material-icons">visibility</i> Xem</button>
            <button className="btn btn-xs btn-info" onClick={(e) => Print(row)}><i class="fa fa-print"></i> In</button>
          </span>
        </div>
      ),
    },
    {
      Header: "Mã bảng kê",
      accessor: "Code",
    },
    {
      Header: "Từ ngày",
      accessor: "Start_date",
    },
    {
      Header: "Đến ngày",
      accessor: "End_date",
    },
    {
      Header: "Trạng thái",
      accessor: "StatusName",
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateDate",
    },
    {
      Header: "Người tạo",
      accessor: "CreateByName",
    },
    {
      Header: "Ngày chốt",
      accessor: "ConfirmDate",
    },
    {
      Header: "Người chốt",
      accessor: "ConfirmName",
    },
    {
      Header: "NV công nợ",
      accessor: "OfficerName",
    },
    {
      Header: "Tổng vận đơn",
      accessor: "NumberLading",
      Cell: (obj) => (<span>{FormatNumber(obj.value)}</span>)
    },
    {
      Header: "Tổng tiền",
      accessor: "TotalMoney",
      Cell: (obj) => (<span>{FormatMoney(obj.value)} đ</span>)
    },
    {
      Header: "Tổng tiền giảm",
      accessor: "TotalDiscount",
      Cell: (obj) => (<span>{FormatMoney(obj.value)} đ</span>)
    },
    {
      Header: "Tiền phải thu",
      Cell: ({ row }) => (<span>{FormatMoney(row.TotalMoney - row.TotalDiscount)} đ</span>)
    },
  ];
  const columnsDetail = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 60,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Mã bill",
      accessor: 'Code',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Ngày gửi",
      accessor: 'CreateDate',
      Cell: ({ row }) => (<span>{FormatDateJson(row._original.CreateDate, 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Tỉnh đến",
      accessor: 'CityRecipientName',
      fixed: "left",
      Minwidth: 350,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Dịch vụ",
      accessor: 'ServiceName',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Trọng lượng",
      accessor: 'Weight',
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Số kiện",
      accessor: 'Number',
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Khối lượng",
      accessor: 'Mass',
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Cước phí",
      accessor: 'PriceMain',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.PriceMain, 0)}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      )
    },
    {
      Header: "Phí đóng gói",
      accessor: 'PackPrice',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.PackPrice, 0)}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Tiền COD",
      accessor: 'COD',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.COD, 0)}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Phí COD",
      accessor: 'CODPrice',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.CODPrice, 0)}</span>),
      fixed: "left",
      width: 150,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: 'Phí khai giá',
      accessor: 'InsuredPrice',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.InsuredPrice, 0)}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: `Phí THBB,BP`,
      accessor: 'Prices',
      Cell: ({ row }) => (<span>{`${FormatMoney(row._original.BPPrice + row._original.THBBPrice, 0)}`}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Phí ngoại tuyến",
      accessor: 'OnSiteDeliveryPrice',
      Cell: ({ row }) => (<span>{FormatMoney(((row._original.OnSiteDeliveryPrice * row._original.PriceMain) / 100), 0)}</span>),
      fixed: "left",
      width: 150,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "PPXD",
      accessor: 'PPXDPercent',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.PPXDPercent, 0)}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "VAT %",
      accessor: 'VATPercent',
      Cell: ({ row }) => (<span>{row._original.VATPercent}</span>),
      fixed: "left",
      width: 100,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Tổng tiền",
      accessor: 'Amount',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.Amount, 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      )
    },
    {
      Header: "Tiền giảm giá",
      accessor: 'DiscountAmount',
      Cell: ({ row }) => (<span>{FormatMoney(row._original.DiscountAmount, 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: 'Cần thanh toán',
      accessor: 'DiscountAmount',
      Cell: ({ row }) => (<span>{FormatMoney((row._original.Amount - row._original.DiscountAmount), 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      )
    },
    {
      Header: "Tên người gửi",
      accessor: 'SenderName',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Tên người nhận",
      accessor: 'RecipientName',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Địa chỉ nhận",
      accessor: 'RecipientAddress',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
  ]
  const columnsinvoice = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 60,
      textAlign: "center",
      filterable: false,
      sortable: false,
    }, {
      Header: "Tùy chọn",
      fixed: "left",
      width: 150,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button className="btn btn-xs btn-primary" onClick={(e) => FRM_spPaySlipImport_ElectronicBillDraft(row.original.Id, row.original.ViettelUser, row.original.ViettelPass)}><i class="material-icons">download</i> Tải HĐ</button>
          </span>
        </div>
      ),
    },
    {
      Header: "Mã chứng từ",
      accessor: 'CodeNumber',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Chi nhánh",
      accessor: 'BranchName',
      fixed: "left",
      Minwidth: 350,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Ngày chứng từ",
      accessor: 'CreateTimeWaybill',
      Cell: ({ row }) => (<span>{FormatDateJson(row._original.CreateTimeWaybill, 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Tỷ giá",
      accessor: 'ExchangeRate',
      fixed: "left",
      Minwidth: 350,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Đại diện",
      accessor: 'Payers',
      fixed: "left",
      Minwidth: 350,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Ghi chú",
      accessor: 'Notes',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Người tạo",
      accessor: 'OfficerName',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Ngày Tạo",
      accessor: 'CreateTime',
      Cell: ({ row }) => (<span>{FormatDateJson(row._original.CreateTime, 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Người sửa",
      accessor: 'Editer',
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    },
    {
      Header: "Ngày Sửa",
      accessor: 'EditTime',
      Cell: ({ row }) => (<span>{FormatDateJson(row._original.EditTime, 0)}</span>),
      fixed: "left",
      width: 200,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
        />
      ),
    }
  ]
  const Excell = () => {
    let dataExcel = ReportData.map((item, index) => {
      return {
        "Mã bảng kê": item.Code,
        "Từ ngày": item.Start_date,
        "Đến ngày": item.End_date,
        "Trạng thái": item.StatusName,
        "Ngày tạo": item.CreateDate,
        "Người tạo": item.CreateByName,
        "Ngày chốt": item.ConfirmDate,
        "Người chốt": item.ConfirmName,
        "Nhân viên công nợ": item.OfficerName,
        "Tổng số vận đơn": FormatNumber(item.NumberLading),
        "Tổng tiền": FormatMoney(item.TotalMoney),
        "Tổng tiền giảm": FormatMoney(item.TotalDiscount),
        "Tiền phải thu": FormatMoney(item.TotalMoney - item.TotalDiscount),
      };
    });
    ExportExcel(dataExcel, "Bảng kê thanh toán");
  };

  return (
    <LayoutMain>
      <div className={Hiddencheck !== true ? "display-none" : "display-block"}>
        <div className={hiddenmain === true ? "display-none margin-top-25s" : "display-block margin-top-25s"}>
          <div className="container-fluid">
            <div className="row cardcus">
              <div className="col-md-12 HomeTitle">Bảng kê thanh toán</div>
              <form className="form-horizontal col-md-12">
                <div className="row">
                  <div className='col-md-4'></div>
                  <div className="col-md-4">
                    <label className=''>Chọn tháng</label>
                    <div className="form-group mt0">
                      <input type="month" className="form-control borradius3" value={SelectMonth} format="yyyy-MM" onChange={(e) => setSelectMonth(e.target.value)} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-12 text-center margin-top-10">
              <button
                disabled={!disable}
                onClick={ViewReport}
                type="button"
                className="btn btn-sm text-transform btn-save"
              >
                <i className="material-icons">search</i> Xem báo cáo
              </button>
              <button
                disabled={!disable}
                onClick={() => {
                  Excell();
                }}
                type="button"
                className="btn btn-sm text-transform btn-refeshno margin-left-10"
              >
                <img src="../assets/img/iconexcel.png" className='iconex' /> Xuất Excel
              </button>
            </div>
          </div>
          <div className={ShowList + " col-row cardcus margin-top-20"}>
            <DataTable data={ReportData} columns={columns} />
          </div>
        </div>
        <div className={ReportDataDetail.length === 0 ? "display-none margin-top-25s" : "display-block margin-top-25s"}>
          <div class="card-header">
            <div class="row">
              <div class="col-sm-12 col-md-6" >
                <h3 class="card-title  Titleuppercase uppercase font-size-lg text-capitalize font-weight-normal bg-ripe-malin icon-gradient"><i class="nav-icon fa fa-list  bg-ripe-malin icon-gradient"></i> Chi tiết {Code_Payment} ({ReportDataDetail.length})</h3>
              </div>
              <div class="col-sm-12 col-md-6 margin-top-5s">
                <button type="button" class="btn btn-sm btn-success pull-right" onClick={a => ShowExcel(0)} >
                  <i class="fa fa-download pr-2"></i>
                  Xuất Excel
                </button>
                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={a => {
                  setReportDataDetail([])
                  sethiddenmain(!hiddenmain)
                }}>
                  <i class="material-icons">undo</i>
                  Trở về
                </button>
              </div>
            </div>
          </div>
          <div>
            <div class="card-body">
              <div className="row">
                <FormDataInCustomer
                  Type={0}
                  CustomerId={IdListDT}
                  onListCheck={(item) => {
                    setListDatacheckEx(item)
                  }}
                />
              </div>
            </div>
            <div class="row margin-left-15">
              <div className='col-md-2'>
              </div>
              <div className='col-md-2'>
                <i class="titlecenter labelSum">Tổng cước trắng (VNĐ)</i>
                <div className='text-center valueSum'>{FormatNumber(ReportDataDetail.reduce((a, v) => a = a + v.PriceMain, 0))}</div>
              </div>
              <div className='col-md-2'>
                <i class="titlecenter labelSum">Tổng tiền (VNĐ)</i>
                <div className='text-center valueSum'>{FormatNumber(ReportDataDetail.reduce((a, v) => a = a + v.Amount, 0))}</div>
              </div>
              <div className='col-md-2'>
                <i class="titlecenter labelSum">Tổng tiền giảm giá (VNĐ)</i>
                <div className='text-center valueSum'>{FormatNumber(ReportDataDetail.reduce((a, v) => a = a + v.DiscountAmount, 0))}</div>
              </div>
              <div className='col-md-2'>
                <i class="titlecenter labelSum">Cần thanh toán (VNĐ)</i>
                <div className='text-center valueSum'>{FormatNumber(ReportDataDetail.reduce((a, v) => a = a + (v.Amount - v.DiscountAmount), 0))}</div>
              </div>

              <div className='col-md-2'>
              </div>
            </div>
            <div class="card-body">
              <div class="form-group">
                <DataTable
                  data={ReportDataDetail}
                  columns={columnsDetail}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={DataGetInvoiceCheck === true ? "display-none margin-top-25s" : "display-block margin-top-25s"}>
          <div class="card-header">
            <div class="row">
              <div class="col-sm-12 col-md-6" >
                <h3 class="card-title  Titleuppercase uppercase font-size-lg text-capitalize font-weight-normal bg-ripe-malin icon-gradient"><i class="nav-icon fa fa-list  bg-ripe-malin icon-gradient"></i> Hóa đơn {Code_Payment} ({DataGetInvoice.length})</h3>
              </div>
              <div class="col-sm-12 col-md-6 margin-top-5s">
                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={a => {
                  sethiddenmain(!hiddenmain)
                  setDataGetInvoice([])
                  setDataGetInvoiceCheck(true)
                }}>
                  <i class="material-icons">undo</i>
                  Trở về
                </button>
              </div>
            </div>
          </div>
          <div>
            <div class="card-body">
              <div class="form-group">
                <DataTable
                  data={DataGetInvoice}
                  columns={columnsinvoice}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={Hiddencheck === true ? "display-none" : "display-block"}>
        <div class="card-header">
          <div class="row">
            <div class="col-sm-12 col-md-6" >
              <h3 class="card-title  Titleuppercase uppercase font-size-lg text-capitalize font-weight-normal bg-ripe-malin icon-gradient"><i class="nav-icon fa fa-list  bg-ripe-malin icon-gradient"></i> In bảng kê</h3>
            </div>
            <div class="col-sm-12 col-md-6 margin-top-5s">
              <button type="button" class="btn btn-sm btn-info pull-right" onClick={a => PrintSelect()} >
                <i class="fa fa-download pr-2"></i>
                In
              </button>
              <button type="button" class="btn btn-sm btn-danger pull-right"
                onClick={a => {
                  setHiddencheck(true)
                  setIdList(-1)
                }}>
                <i class="fa fa-undo pr-2"></i>
                Trở về
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div className="row">
            <FormDataInCustomer
              TitleCommon={"CHI TIẾT IN"}
              Type={0}
              CustomerId={IdList}
              onListCheck={(item) => {
                setListDatacheckPrint(item)
              }}
            />
          </div>
        </div>
      </div>
      <div className={Invoiceview === true ? "display-none" : "display-block"}>
        <div class="card-header">
          <div class="row">
            <div class="col-sm-12 col-md-6" >
              <h3 class="card-title  Titleuppercase uppercase font-size-lg text-capitalize font-weight-normal bg-ripe-malin icon-gradient"><i class="nav-icon fa fa-list  bg-ripe-malin icon-gradient"></i> Hóa đơn điện tử</h3>
            </div>
            <div class="col-sm-12 col-md-6 margin-top-5s">
              <button type="button" class="btn btn-sm btn-danger pull-right"
                onClick={a => {
                  setInvoiceview(true)
                  setDataGetInvoiceCheck(false)
                  setIdList(-1)
                }}>
                <i class="fa fa-undo pr-2"></i>
                Trở về
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div className="row">
            <div className="col-md-12 text-center previewbill"></div>
          </div>
        </div>
      </div>
      <div id="barcodeTarget" style={{ display: "none" }}>
        {HtmlPrint}
      </div>
    </LayoutMain>
  );
};
