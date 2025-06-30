import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Alerterror,
  FormatDateJson,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import { DataTable } from "../../Common";
import { ExportExcel } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import LayoutMain from "../../Layout/LayoutMain";

export const CustomerPaymentDealineComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [disable, setDisable] = useState(true); // disable button
  const [dataA, setdataA] = useState([]);
  const [dataB, setdataB] = useState([]);
  const [dataC, setdataC] = useState([]);
  const [Code, setCode] = useState("");
  const [Monthyear, setMonthyear] = useState(FormatDateJson(new Date(), 2));
  const [TabActive, setTabActive] = useState(1);
  const [ShowTable, setShowTable] = useState("display-none");
  /* run after render */
  useEffect(() => {
    if (CustomerID === null) {
      history.push("/");
    }
  }, []);
  const Excell = (key) => {
    if (key === 1) {
      ExportExcel(dataA, "Hóa đơn quá hạn thanh toán");
    } else if (key === 2) {
      ExportExcel(dataB, "Hóa đơn đến hạn thanh toán");
    } else {
      ExportExcel(dataC, "Hóa đơn chưa đến hạn trong tháng");
    }
  };
  const APIC_spCustomerPaymentDealine_Report = async () => {
    setDisable(false);
    let _month = Monthyear.split('-')[1], _year = Monthyear.split('-')[0];
    let params = {
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      InvoiceCode: Code,
      Month: _month,
      Year: _year
    };

    try {
    const data = await mainAction.API_spCallServer(
      "APIC_spCustomerPaymentDealine_Report_V1",
      params,
      dispatch
    );
      setdataA(data.DataA);
      setdataB(data.DataB);
      setdataC(data.DataC);
      setDisable(true);
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      setDisable(true);
    }
  };

  const columns = [
    {
      Header: "Tên khách hàng",
      accessor: "CustomerName",
    },
    {
      Header: "Email",
      accessor: "Email",
    },
    {
      Header: "Chi nhánh",
      accessor: "POName",
    },
    {
      Header: "Tháng công nợ",
      accessor: "Day_Collected",
    },
    {
      Header: "Số hóa đơn",
      accessor: "InvoiceCode",
    },

    {
      Header: "Hạn thanh toán",
      accessor: "Dealine",
    },
  ];

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle"> Báo cáo thời hạn thanh toán</div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-3">
                <label>Chọn tháng</label>
                <div className="form-group mt0">
                  <input type="month" format="MM/yyyy" className="form-control borradius3"
                    onChange={(e) => setMonthyear(e.target.value)}
                    value={Monthyear} defaultValue={Monthyear} />
                </div>
              </div>
              <div className="col-md-3">
                <label>Mã hóa đơn</label>
                <div className="form-group mt0">
                  <input
                    type="text"
                    className="form-control borradius3"
                    minLength="0"
                    maxLength="500"
                    placeholder='Nhập mã hóa đơn'
                  />
                </div>
              </div>
              <div className="clearfix"></div>

            </div>
          </div>

        </div>
        <div className="col-md-12 text-center margin-top-10">
          <button
            disabled={!disable}
            onClick={() => {
              APIC_spCustomerPaymentDealine_Report();
              setShowTable("");
            }}
            type="button"
            className="btn btn-sm text-transform btn-save"
          >
            <i className="material-icons">search</i> Xem báo cáo
          </button>
        </div>
        <div className={"col-md-12 text-center cardcus margin-top-20 " + ShowTable}>
          <ul className="nav nav-pills nav-pills-success" style={{ display: "inline-flex" }}>
            <li className="nav-item whiteSpace" onClick={(e) => setTabActive(1)}>
              <a className="nav-link active show" data-toggle="tab" href="#link1">
                Hóa đơn quá hạn thanh toán ({dataA.length})
              </a>
            </li>
            <li className="nav-item whiteSpace" onClick={(e) => setTabActive(2)}>
              <a className="nav-link" data-toggle="tab" href="#link2">
                Hóa đơn đến hạn thanh toán ({dataB.length})
              </a>
            </li>
            <li className="nav-item whiteSpace" onClick={(e) => setTabActive(3)}>
              <a className="nav-link" data-toggle="tab" href="#link3">
                Hóa đơn chưa đến hạn thanh toán ({dataC.length})
              </a>
            </li>
          </ul>
        </div>
        <div className={"tab-content col-md-12 cardcus margin-top-20 " + ShowTable} id="nav-tabContent">
          <div className={"tab-pane fade" + (TabActive === 1 ? " show active" : "")} id="link1">
            <div className="text-right margin-bottom-10">
              <button type="button" className="btn btn-sm text-transform btn-refesh" onClick={() => { Excell(1); }} >
                <img src="../assets/img/iconexcel.png" className='iconex' /> Xuất Excel
              </button>
            </div>
            <DataTable data={dataA} columns={columns} />
          </div>
          <div className={"tab-pane fade" + (TabActive === 2 ? " show active" : "")} id="link2">
            <div className="text-right">
              <button type="button" className="btn btn-sm btn-success" onClick={() => { Excell(2); }} >
                <img src="../assets/img/iconexcel.png" className='iconex' /> Xuất Excel
              </button>
            </div>
            <DataTable data={dataB} columns={columns} />
          </div>
          <div className={"tab-pane fade" + (TabActive === 3 ? " show active" : "")} id="link3">
            <div className="text-right">
              <button type="button" className="btn btn-sm btn-success" onClick={() => { Excell(3); }} >
                <img src="../assets/img/iconexcel.png" className='iconex' /> Xuất Excel
              </button>
            </div>
            <DataTable data={dataC} columns={columns} />
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};