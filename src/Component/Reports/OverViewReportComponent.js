import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import {
  Alertsuccess,
  Alerterror,
  DecodeString,
  FormatDate,
  PaginationTable,
  FormatDateJson,
  FormatMoney,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import { ReportAction } from "../../Redux/Actions/Reports";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { ChartTemp, CanvasChart } from "../../Common";
import { DataTable } from "../../Common/DataTable";
import { ExportExcel } from "../../Utils/ExportExcel";
import { useInput } from "../../Hooks";
import LayoutMain from "../../Layout/LayoutMain";

/* Load CSS */

export const OverViewReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true); // disable button
  const history = useHistory();

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [FromDate, bindFromDate, setFromDate] = useInput(new Date());
  const [ToDate, bindToDate, setToDate] = useInput(new Date());
  const FromDateRef = useRef();
  const ToDateRef = useRef();

  const [ReportData, setReportData] = useState([]);
  const [DataChart, setDataChart] = useState([]);
  const [ShowList, setShowList] = useState("");
  const [ShowData, setShowData] = useState("display-none");
  const [ShowDetail, setShowDetail] = useState("display-none");
  const [TitleDetail, setTitleDetail] = useState("");
  const [DataChartPie, setDataChartPie] = useState([]);

  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
  }, []);

  const changeFromDate = (item) => {
    if (item !== null) {
      setFromDate(item);
      if (Math.abs(ToDate - item) / (1000 * 60 * 60 * 24) > 30)
        setToDate(
          new Date(item.getFullYear(), item.getMonth() + 1, item.getDate())
        );
    }
  };

  const changeToDate = (item) => {
    if (item !== null) {
      let a = ToDate - item;
      if (Math.abs(ToDate - item) / (1000 * 60 * 60 * 24) > 30)
        setFromDate(
          new Date(item.getFullYear(), item.getMonth() - 1, item.getDate())
        );
      setToDate(item);
    }
  };

  const columns = [
    {
      Header: "Tùy chọn",
      accessor: "item",
      Cell: (row) => (
        <button
          onClick={(e) => ViewChart(row)}
          type="button"
          className="btn btn-info btn-xs"
        >
          <i className="material-icons">bar_chart</i>
        </button>
      ),
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateDate",
      Cell: (obj) => FormatDateJson(obj.value, 1),
      // Cell: ({row})  => (<button className="btn btn-sm btn-danger" onClick={e => clickRow({row})}>Edit</button>)
    },
    {
      Header: "Tổng tiền",
      accessor: "TongTien",
      Cell: (obj) => FormatMoney(obj.value) + " đ",
    },
    {
      Header: "Tổng bill",
      accessor: "TongBill",
    },
    {
      Header: "Mới tạo",
      accessor: "MoiTao",
    },
    {
      Header: "Đang lấy hàng",
      accessor: "DangLayHang",
    },
    {
      Header: "Đã lấy hàng",
      accessor: "DaLayHang",
    },
    {
      Header: "Đang trung chuyển",
      accessor: "DangTrungChuyen",
    },
    {
      Header: "Đã nhận lại",
      accessor: "DaNhanLai",
    },
    {
      Header: "Đang phát",
      accessor: "DangPhat",
    },
    {
      Header: "Phát thành công",
      accessor: "ThanhCong",
    },
    {
      Header: "Đang phát lại",
      accessor: "PhatLai",
    },
    {
      Header: "Hoàn gốc",
      accessor: "HoanGoc",
    },
    {
      Header: "Có hình",
      accessor: "CoHinh",
    },
  ];

  const ExportToExcel = () => {
    let dataExcel = ReportData.map((item, index) => {
      return {
        "Ngày tạo": FormatDate(item.CreateDate, "k-d-y"),
        "Tổng tiền": FormatMoney(item.TongTien),
        "Tổng số vận đơn": item.TongBill,
        "Mới tạo": item.MoiTao,
        "Đang lấy hàng": item.DangLayHang,
        "Đã lấy hàng": item.DaLayHang,
        "Đang trung chuyển": item.DangTrungChuyen,
        "Đã nhận lại chi nhánh phát": item.DaNhanLai,
        "Đang phát": item.DangPhat,
        "Thành công": item.ThanhCong,
        "Đang phát lại": item.PhatLai,
        "Hoàn gốc": item.HoanGoc,
        "Vận đơn có hình": item.CoHinh,
      };
    });
    ExportExcel(
      dataExcel,
      "Thống kê kết quả giao hàng từ ngày " +
      FormatDateJson(FromDate, 1) +
      " đến ngày " +
      FormatDateJson(ToDate, 1)
    );
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
      CustomerID: CustomerID,
      FromDate: FromDate.toISOString(),
      ToDate: ToDate.toISOString(),
      CustomerIds: GetCookieGroup("CustomerIds"),
    };
    const data = await mainAction.API_spCallServer(
      "APIC_spLadingReportDelivery_V1",
      params,
      dispatch
    );
    //
    setReportData(data);
    setShowDetail("display-none");
    setShowList("");
    setShowData("");
    setDisable(true);
    if (data.length > 0) {
      let chart = [];
      data.forEach((element, index) => {
        chart.push({
          label: "Ngày " + FormatDate(element.CreateDate, "d-k-y"),
          y: element.TongTien,
        });
      });
      setDataChart([{
        type: "spline",
        name: "Doanh thu",
        legendText: "Doanh thu",
        showInLegend: true,
        dataPoints: chart,
      },]);
    } else {
      setDataChart([{
        type: "spline",
        name: "Doanh thu",
        legendText: "Doanh thu",
        showInLegend: true,
        dataPoints: [],
      }]);
    }

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const ViewChart = async (row) => {
    setShowList("display-none");
    setShowData("display-none");
    setShowDetail("");
    setTitleDetail("ngày " + FormatDate(row.original.CreateDate, "d-k-y"));
    setDataChartPie([
      { title: "Mới tạo", value: row.original.MoiTao, color: "#008d4c" },
      { title: "Đang lấy hàng", value: row.original.DangLayHang, color: "#39cccc" },
      { title: "Đã lấy hàng", value: row.original.DaLayHang, color: "#555299" },
      { title: "Đang trung chuyển", value: row.original.DangTrungChuyen, color: "#01ff70" },
      { title: "Đã nhận lại", value: row.original.DaNhanLai, color: "#ff851b" },
      { title: "Đang phát", value: row.original.DangPhat, color: "#d81b60" },
      { title: "Thành công", value: row.original.ThanhCong, color: "#005384" },
      { title: "Phát lại", value: row.original.PhatLai, color: "#db8b0b" },
      { title: "Hoàn gốc", value: row.original.HoanGoc, color: "#00a7d0" },
    ]);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle"> Kết quả giao hàng</div>
          <div className={ShowList + " col-md-12"}>
            <form className="form-horizontal">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-3">
                  <label>Từ ngày</label>
                  <div className="form-group mt0">
                    {/* <input type="date" className="form-control" format="dd/MM/yyyy" value={FromDate} ref={FromDateRef} {...bindFromDate} /> */}
                    <DateTimePicker className="form-control borradius3" onChange={(date) => changeFromDate(date)} value={FromDate} format="dd/MM/yyyy" />
                  </div>
                </div>
                <div className="col-md-3">
                  <label>Đến ngày</label>
                  <div className="form-group mt0">
                    {/* <input type="date" className="form-control" format="dd/MM/yyyy" value={ToDate} ref={ToDateRef} {...bindToDate} /> */}
                    <DateTimePicker className="form-control borradius3" onChange={(date) => changeToDate(date)} value={ToDate} format="dd/MM/yyyy" />
                  </div>
                </div>

              </div>
            </form>

          </div>
          <div className={ShowDetail + " col-md-12"}>
            <div className="card-header card-header-primary">
              <h4 className="card-title">
                <i class="material-icons mt10">insights</i> Chi tiết{" "}
                {TitleDetail}
                <button
                  onClick={(e) => {
                    setShowList("");
                    setShowData("");
                    setShowDetail("display-none");
                  }}
                  type="button"
                  className="btn btn-sm text-transform btn-refesh pull-right"
                >
                  <i className="material-icons">undo</i> Trở về
                </button>
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ChartTemp type="pie" data={DataChartPie} />
                </div>
                <div className="col-md-3">
                  <p>
                    <span className="chart-color bg-green"> </span> Mới tạo
                  </p>
                  <p>
                    <span className="chart-color bg-teal"> </span> Đang lấy
                    hàng
                  </p>
                  <p>
                    <span className="chart-color bg-purple"> </span> Đã lấy
                    hàng
                  </p>
                  <p>
                    <span className="chart-color bg-lime"> </span> Đang trung
                    chuyển
                  </p>
                  <p>
                    <span className="chart-color bg-orange"> </span> Đã nhận
                    lại
                  </p>
                </div>
                <div className="col-md-3">
                  <p>
                    <span className="chart-color bg-maroon"> </span> Đang phát
                  </p>
                  <p>
                    <span className="chart-color bg-blue"> </span> Phát thành
                    công
                  </p>
                  <p>
                    <span className="chart-color bg-yellow"> </span> Đang phát
                    lại
                  </p>
                  <p>
                    <span className="chart-color bg-aqua"> </span> Hoàn gốc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={ShowList + " col-md-12 text-center margin-top-10"}>
          <button
            disabled={!disable}
            onClick={ViewReport}
            type="button"
            className="btn btn-sm text-transform btn-save"
          >
            <i className="material-icons">search</i> Xem báo cáo
          </button>
          <button
            type="button"
            onClick={ExportToExcel}
            className="btn btn-sm text-transform btn-refeshno margin-left-10"
          >
            <img src="../assets/img/iconexcel.png" className='iconex' />
            Xuất Excel
          </button>
        </div>
        <div className={ShowData + " row cardcus margin-top-20"}>
          <div className="col-md-12">
            <div className="table-responsive">
              <DataTable data={ReportData} columns={columns} />
            </div>
          </div>
          <div className="col-md-12 mt30">
            <p className="text-center bold">
              THỐNG KÊ DOANH THU THEO NGÀY
            </p>
            {/* <ChartTemp type="line" data={DataChart} /> */}
            <CanvasChart data={DataChart} />
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
