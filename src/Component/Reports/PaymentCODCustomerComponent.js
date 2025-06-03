import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  Alerterror,
  Alertwarning,
  FormatMoney,
  FormatNumber,
  GetCookie,
  FormatDateJson,
  GetCookieGroup
} from "../../Utils";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { DataTable } from "../../Common/DataTable";
import { ExportExcel } from "../../Utils/ExportExcel";
import LayoutMain from "../../Layout/LayoutMain";

export const PaymentCODCustomerComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true); // disable button
  const history = useHistory();

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [FromDate, setFromDate] = useState(new Date());
  const [ToDate, setToDate] = useState(new Date());

  const [ReportData, setReportData] = useState([]);
  const [ShowList, setShowList] = useState("display-none");

  const [DataDetail, setdataDetail] = useState([]);
  const [DataExcelDetail, setDataExcelDetail] = useState([]);
  const [ShowDetail, setShowDetail] = useState("display-none");
  const [CodeBK, setCodeBK] = useState("");


  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
  }, []);

  const [NoData, setNoData] = useState("display-none");


  const changeFromDate = (item) => {
    if (item !== null) {
      setFromDate(item);
      if (Math.abs(ToDate - item) / (1000 * 60 * 60 * 24) > 30)
        setFromDate(
          new Date(item.getFullYear(), item.getMonth() + 1, item.getDate())
        );
    }
  };

  const changeToDate = (item) => {
    if (item !== null) {
      let a = ToDate - item;
      if (Math.abs(ToDate - item) / (1000 * 60 * 60 * 24) > 30)
        setToDate(
          new Date(item.getFullYear(), item.getMonth() - 1, item.getDate())
        );
      setToDate(item);
    }
  };

  const ViewReport = async () => {
    //ScrollTop();
    setDisable(false);
    if (FromDate === "") {
      Alerterror("Chọn từ ngày");
      return false;
    } else if (ToDate === "") {
      Alerterror("Chọn đến ngày");
      return false;
    }
    let params = {
      IdCustomer: CustomerID,//,10266
      CustomerIds: GetCookieGroup("CustomerIds"),
      Fromdate: FromDate.toISOString(),
      Todate: ToDate.toISOString(),
      Status: -1
    };
    let pr = {
      Json: JSON.stringify(params),
      func: "CPN_spPayment_COD_Customer_Report",
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

  const Excell = () => {
    const newData = ReportData.map(element => {
      return {
        'Trạng thái': element.Status,
        'KH xác nhận': FormatDateJson(element.ConfirmTime, 'd/k/y'),
        'KT xác nhận': FormatDateJson(element.AcceptTime, 'd/k/y'),
        'Mã BK': element.Code,
        'Mã KH': element.CustomerCode,
        'Tên KH': element.CustomerName,
        'Tổng bill': element.Totalbill,
        'Tổng COD (vnđ)': element.Totalmoney,
        'Lý do cấn trừ': element.NoteClearing,
        'Tổng D.thu (vnđ)': element.TotalAmount,
        'Tổng đối soát (vnđ)': element.TotalCODReality,
        'Lý do trả': element.NoteReturn,
        'Người tạo': element.CreateName,
        'Ngày tạo': FormatDateJson(element.CreateDate, 'd/k/y'),
        'Người sửa': element.OfficerName,
        'Ngày sửa': FormatDateJson(element.EditTime, 'd/k/y')
      }
    })
    ExportExcel(newData, "Bảng kê thanh toán COD");
  };
  const DownloadExxcel = async (Id) => {
    debugger
    const paramsmail1 = {
      Json: JSON.stringify({
        Id: Id,
        Key: "Cập nhật",
        UserId: 0,
        KeyCheck: 1
      }),
      func: "CPN_spPayment_COD_Customer_SendMail"
    }

    try {
      const resultex = await mainAction.API_spCallServerNoSQL(paramsmail1, dispatch);
      if (resultex.resultCode === 0) {
        window.location.href = "https://api-v4-erp.vps.vn" + resultex.Message
      }
      else {
        Alerterror(resultex.Message);
      }
    }

    catch (e) {
      Alerterror("Lỗi dữ liệu!");
    }
  }
  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 50,
    },
    {
      Header: "Tùy chọn",
      accessor: 'Id',
      filterable: false,
      sortable: false,
      fixed: "left",
      width: 90,
      Cell: (row) => (
        <>
          <i class="fa fa-eye green  button cursor" onClick={e => CPN_spPayment_COD_CustomerDetail_Report(row.value)} title="Chi tiết"></i>
          <i class="fa fa-download orange button cursor" onClick={e => DownloadExxcel(row.value)}></i>
        </>
      ),
      // maxWidth: 50,
      textAlign: "center"
    },
    {
      Header: 'File',
      width: 200,
      accessor: "LinkDocuments",
      Cell: (row) => (
        <div>
          {row.original.LinkDocuments !== undefined && row.original.LinkDocuments !== "" && row.original.LinkDocuments !== null
            ? (row.original.LinkDocuments.split(";")).map((img, index) => {
              return (
                <a class="pr-2" style={{ marginLeft: '10px' }} target="_blank" href={row.original.Links + img}>{(img.split("/"))[5]}</a>
              );
            })
            : null}{" "}
        </div>
      ),
    },
    {
      Header: "Trạng thái",
      accessor: 'Status',
      width: 130,
      Cell: (row) => (
        <label className="btn btn-xs labelradius10px" style={{ backgroundColor: row.original.Color, borderColor: row.original.Color, boxShadow: "none", color: "#fff" }}>{row.value}</label>
      )
    },
    {
      Header: "KH xác nhận/trả",
      width: 180,
      accessor: "ConfirmTime",
      Cell: (obj) => obj.value === undefined ? <label className="btn labelradius10px btn-danger btn-xs">{FormatDateJson(obj.value)}</label> :
        <label className="btn labelradius10px btn-success btn-xs">{FormatDateJson(obj.value)}</label>
    },
    {
      Header: "KT x.nhận chi",
      width: 180,
      accessor: "AcceptTime",
      Cell: (obj) => obj.value === undefined ? <label className="btn labelradius10px btn-danger btn-xs">{FormatDateJson(obj.value)}</label> :
        <label className="btn labelradius10px btn-success btn-xs">{FormatDateJson(obj.value)}</label>
    },
    {
      Header: "Mã BK",
      width: 200,
      accessor: "Code"
    }, {
      Header: "Mã KH",
      width: 200,
      accessor: "CustomerCode"
    },
    {
      Header: "Tên KH",
      width: 200,
      accessor: "CustomerName"
    },
    {
      Header: "Tổng bill",
      width: 200,
      accessor: "Totalbill"
    },
    {
      Header: "Tổng COD (vnđ)",
      width: 200,
      accessor: "Totalmoney",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> "Tổng tiền" : {
          FormatMoney(ReportData.reduce((a, v) => a = a + v.Totalmoney, 0))
        }</span>
      )
    },
    {
      Header: "Lý do cấn trừ",
      width: 200,
      accessor: "NoteClearing"
    },
    {
      Header: "Tiền cấn trừ (vnđ)",
      width: 200,
      accessor: "MoneyClearing",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền: {
          FormatMoney(ReportData.reduce((a, v) => a = a + v.MoneyClearing, 0))
        }</span>
      )
    },
    {
      Header: "Đã cấn trừ (vnđ)",
      width: 200,
      accessor: "CODCurrently",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền : {
          FormatMoney(ReportData.reduce((a, v) => a = a + v.CODCurrently, 0))
        }</span>
      )
    },
    {
      Header: "Tổng doanh thu (vnđ)",
      width: 200,
      accessor: "TotalAmount",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền : {
          FormatMoney(ReportData.reduce((a, v) => a = a + v.TotalAmount, 0))
        }</span>
      )
    },
    {
      Header: "Tổng đối soát (vnđ)",
      width: 200,
      accessor: "TotalCODReality",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền : {
          FormatMoney(ReportData.reduce((a, v) => a = a + v.TotalCODReality, 0))
        }</span>
      )
    },
    {
      Header: "Lý do trả",
      width: 200,
      accessor: "NoteReturn"
    },
    {
      Header: "Người tạo",
      width: 200,
      accessor: "CreateName"
    },
    {
      Header: "Ngày tạo",
      width: 200,
      accessor: "CreateDate",
      Cell: (obj) => FormatDateJson(obj.value)
    }, {
      Header: "Người sửa",
      width: 200,
      accessor: "OfficerName"
    },
    {
      Header: "Ngày sửa",
      width: 200,
      accessor: "EditTime",
      Cell: (obj) => FormatDateJson(obj.value)
    }
  ];

  const columnsDetail = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 50,
    },
    {
      Header: "Trạng thái",
      accessor: 'Status',
      Cell: (row) => (
        <label className="btn labelradius10px btn-danger btn-xs">{row.value}</label>
      )
    },
    {
      Header: "Trạng thái Deadline",
      accessor: 'IsDeadline',
      Cell: (row) => (
        <label className="btn labelradius10px btn-xs" style={{ backgroundColor: row.original.Color, borderColor: row.original.Color, boxShadow: "none", color: "#fff" }}>{row.value}</label>
      )
    },
    {
      Header: "Hình thức trả COD",
      accessor: "TypeCODName",
    },
    {
      Header: "Deadline",
      accessor: "Deadline",
      width: 140,
      Cell: (obj) => <label className="btn labelradius10px btn-success btn-xs">{FormatDateJson(obj.value)}</label>
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateDate",
      width: 140,
      Cell: (obj) => <label className="btn labelradius10px btn-success btn-xs">{FormatDateJson(obj.value)}</label>
    },
    {
      Header: "Ngày xác nhận",
      accessor: "ConfirmTime",
      width: 140,
      Cell: (obj) => <label className="btn labelradius10px btn-success btn-xs">{FormatDateJson(obj.value)}</label>
    },
    {
      Header: "Mã bill",
      accessor: "LadingCode"
    },
    {
      Header: "Mã phiếu thu",
      accessor: 'PaySlipCode',

      Cell: (obj) => obj.value === undefined ? <label className="btn labelradius10px btn-danger btn-xs">{obj.value}</label> :
        <label className="btn labelradius10px btn-success btn-xs">{obj.value}</label>
    },
    {
      Header: "Tiền COD (vnđ)",
      accessor: "CODMoney",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền : {
          FormatMoney(DataDetail.reduce((a, v) => a = a + v.CODMoney, 0))
        }</span>
      )
    },
    {
      Header: "Tiền đối soát (vnđ)",
      accessor: "CODReality",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền : {
          FormatMoney(DataDetail.reduce((a, v) => a = a + v.CODReality, 0))
        }</span>
      )
    },
    {
      Header: "Doanh thu (vnđ)",
      accessor: "Amount",
      Cell: (obj) => FormatMoney(obj.value),
      Footer: (
        <span className="red"> Tổng tiền : {
          FormatMoney(DataDetail.reduce((a, v) => a = a + v.Amount, 0))
        }</span>
      )
    },
    {
      Header: "Mã KH",
      accessor: "CustomerCode"
    },
    {
      Header: "Tên KH",
      accessor: "CustomerName"
    }

  ];

  const CPN_spPayment_COD_CustomerDetail_Report = async (id) => {
    try {
      setDisable(true)
      const params = {
        Json: JSON.stringify({
          Id: id,
          UserId: 128
        }),
        func: "CPN_spPayment_COD_CustomerDetail_Report"
      }
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setdataDetail(result)
        setDisable(false)
        const newData = result.map(element => {
          return {
            'Trạng thái': element.Status,
            'Ngày xác nhận': FormatDateJson(element.ConfirmTime, 'd/k/y'),
            'Mã BK': element.Code,
            'Mã bill': element.LadingCode,
            'Mã phiếu thu': element.PaySlipCode,
            'Mã KH': element.CustomerCode,
            'Tên KH': element.CustomerName,
            'Tiền COD (vnđ)': element.CODMoney,
            'D.thu (vnđ)': element.Amount,
            'Đối soát (vnđ)': element.CODReality
          }
        })
        setDataExcelDetail(newData);
        setCodeBK(result[0].Code);
        setShowDetail("");
        setShowList("display-none");
      } else {
        setShowDetail("display-none");
        Alertwarning("Không có dữ liệu !");
        setDisable(false);
        setDataExcelDetail([]);
        setdataDetail([]);
      }
    } catch (error) {
      Alerterror("Lỗi, vui lòng liên hệ IT !");
      setdataDetail([]);
      setDataExcelDetail([]);
      setDisable(false);
      setShowDetail("display-none");
    }
  }

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle">Bảng kê thanh toán COD</div>
          <form className="form-horizontal col-md-12">
            <div className="row">
              <div className='col-md-3'></div>
              <div className="col-md-3">
                <label>Từ ngày</label>
                <div className="form-group mt0">
                  <DateTimePicker
                    onChange={changeFromDate}
                    value={FromDate}
                    className="form-control borradius3"
                    format="dd-MM-yyyy"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label>Đến ngày</label>
                <div className="form-group mt0">
                  <DateTimePicker
                    onChange={changeToDate}
                    value={ToDate}
                    className="form-control borradius3"
                    format="dd-MM-yyyy"
                  />
                </div>
              </div>
              <div className='col-md-3'></div>
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
        <div className="row">
        <div className="col-md-12">
            <h3>Danh sách bảng kê thanh toán COD</h3>
          </div>
          <div className="col-md-12">
          <DataTable data={ReportData} columns={columns} />
          </div>
            
        </div>
        
      </div>
      <div className={ShowDetail + " col-row cardcus margin-top-20"}>
        <div class="row">
          <div className="col-md-6">
            <h3>Chi tiết bảng kê thanh toán COD</h3>
          </div>
          <div className="col-md-6 text-right">
            <button disabled={!disable} type="button" className="btn btn-sm btn-excel pull-right margin-left-5"
              onClick={e => ExportExcel(DataExcelDetail, "Danh sách chi tiết COD khách hàng")}
            >
              <i class="fa fa-download"></i> Xuất excel
            </button>
            <button type="button" className="btn btn-sm btn-success pull-right margin-left-5" onClick={() => {
              setShowDetail("display-none")
              setShowList("")
            }}>
              <i class="fa fa-undo"></i>
              Trở về
            </button>
          </div>
          <div className="clearfix"></div>
          <div className="col-md-12">
            <DataTable data={DataDetail} columns={columnsDetail} />
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
