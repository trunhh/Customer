import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import {
  Alertsuccess,
  Alerterror,
  DecodeString,
  FormatDate,
  PaginationTable,
  FormatMoney,
  FormatDateJson,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import { ReportAction } from "../../Redux/Actions/Reports";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { useInput } from "../../Hooks";
import LayoutMain from "../../Layout/LayoutMain";

export const OutstandingDebtReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true); // disable button
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const history = useHistory();

  /* get and set parameter from form and sub common */
  const [SelectMonth, setSelectMonth] = useState(FormatDateJson(new Date(), 2));

  const [ReportData, setReportData] = useState({});
  const [TotalDebt, setTotalDebt] = useState(0);
  const [TotalDebtBefore, setTotalDebtBefore] = useState(0);
  const [DebtList, setDebtList] = useState([]);
  const [ShowList, setShowList] = useState("display-none");

  /* run after render as document.ready */
  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
  }, []);

  const [ArrMonth, setArrMonth] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [ArrYear, setArrYear] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const setListMonth = (month, year) => {
    let arr = [],
      att = [];
    for (let i = 1; i <= 12; i++) {
      if (i - month > 0) {
        arr.push(13 - i + month);
        att.push(year - 1);
      } else {
        arr.push(month + 1 - i);
        att.push(year);
      }
    }
    setArrMonth(arr);
    setArrYear(att);
  };

  const changeSelectMonth = (item) => {
    if (item !== null) {
      setSelectMonth(item);
      setDisable(true);
      setListMonth(item._a[1] + 1, item._a[0]);
    }
  };

  const ViewReport = async () => {
    //ScrollTop();
    setDisable(false);
    if (SelectMonth === null) {
      Alerterror("Chọn tháng");
      return false;
    }
    let params = {
      CustomerId: CustomerID,
      ToDate: SelectMonth,
      CustomerIds: GetCookieGroup("CustomerIds"),
    };
    const data = await mainAction.API_spCallServer(
      "APIC_spOutstandingDebtReport_V1",
      params,
      dispatch
    );
    let obj = new Object();
    obj.TotalDebt = 0;
    let _debtList = [],
      _totalDebt = 0,
      _totalDebtBefore = 0;
      data.map((item, index) => {
      if (index === 0) {
        obj.CustomerCode = item.CustomerCode;
        obj.CustomerName = item.CustomerName;
        obj.Adress_CT = item.Adress_CT;
        obj.AddressBill = item.AddressBill;
        obj.Phone = item.Phone;
        obj.CompanyName = item.CompanyName;
        obj.OfficerName = item.OfficerName;
        obj.OfficerNamePostman = item.OfficerNamePostman;
        obj.Tax_Code = item.Tax_Code;
      }
      if (index < 12) {
        _debtList.push({ TotalDebt: item.TotalDebt, MonthBK: item.MonthBK });
      } else {
        _totalDebtBefore += item.TotalDebt;
      }
      _totalDebt += item.TotalDebt;
    });
    setTotalDebtBefore(_totalDebtBefore);
    setDebtList(_debtList);
    setTotalDebt(_totalDebt);
    setReportData(obj);
    setDisable(true);

    if (data !== []) setShowList("");

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle">Báo cáo tồn nợ</div>
          <form className="form-horizontal col-md-12">
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <label>Chọn tháng</label>
                <div className="form-group mt0">
                  <input type="month" className="form-control borradius3" value={SelectMonth} onChange={(e) => setSelectMonth(e.target.value)} />
                </div>
              </div>

            </div>
          </form>

        </div>
        <div className="col-md-12 text-center margin-top-10 ">
          <button
            disabled={!disable}
            onClick={ViewReport}
            type="button"
            className="btn btn-sm text-transform btn-save"
          >
            <i className="material-icons">search</i> Xem báo cáo
          </button>
        </div>
        <div className={ShowList + " col-md-12 cardcus margin-top-20"}>
          <div className="table-responsive">
            <table id="dataTable" className="table text-center">
              <thead className=" text-primary">
                <tr>
                  <th>Mã KH</th>
                  <th>Tên KH</th>
                  <th>Địa chỉ</th>
                  <th>SĐT</th>
                  <th>Người liên hệ</th>
                  <th>Công nợ</th>
                  <th>Giao dịch</th>
                  <th>Địa chỉ HĐ</th>
                  <th>MST</th>
                  <th>Nợ trước {ArrMonth[11] + "/" + ArrYear[11]}</th>
                  <th>Tháng {ArrMonth[11] + "/" + ArrYear[11]}</th>
                  <th>Tháng {ArrMonth[10] + "/" + ArrYear[10]}</th>
                  <th>Tháng {ArrMonth[9] + "/" + ArrYear[9]}</th>
                  <th>Tháng {ArrMonth[8] + "/" + ArrYear[8]}</th>
                  <th>Tháng {ArrMonth[7] + "/" + ArrYear[7]}</th>
                  <th>Tháng {ArrMonth[6] + "/" + ArrYear[6]}</th>
                  <th>Tháng {ArrMonth[5] + "/" + ArrYear[5]}</th>
                  <th>Tháng {ArrMonth[4] + "/" + ArrYear[4]}</th>
                  <th>Tháng {ArrMonth[3] + "/" + ArrYear[3]}</th>
                  <th>Tháng {ArrMonth[2] + "/" + ArrYear[2]}</th>
                  <th>Tháng {ArrMonth[1] + "/" + ArrYear[1]}</th>
                  <th>Tháng {ArrMonth[0] + "/" + ArrYear[0]}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ReportData.CustomerCode}</td>
                  <td>{ReportData.CustomerName}</td>
                  <td>
                    {ReportData.Adress_CT == "null"
                      ? "N/A"
                      : ReportData.Adress_CT}
                  </td>
                  <td>{ReportData.Phone}</td>
                  <td>{ReportData.CompanyName}</td>
                  <td>{ReportData.OfficerName}</td>
                  <td>{ReportData.OfficerNamePostman}</td>
                  <td>{ReportData.AddressBill}</td>
                  <td>{ReportData.Tax_Code}</td>
                  <td>{FormatMoney(TotalDebtBefore)} đ</td>
                  {DebtList.map((item, index) => {
                    return (
                      <td key={index}>
                        {FormatMoney(item.TotalDebt)} đ
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-12 sum-debt">
            Tổng tồn nợ: {FormatMoney(TotalDebt)} đ
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
