import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import {
  Alerterror,
  FormatDate,
  FormatMoney,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import { ReportAction } from "../../Redux/Actions/Reports";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { ChartTemp } from "../../Common";
import LayoutMain from "../../Layout/LayoutMain";

export const KpiDeliveryCODReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true); // disable button
  const history = useHistory();

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [FromDate, setFromDate] = useState(new Date());
  const [ToDate, setToDate] = useState(new Date());

  const [ReportData, setReportData] = useState([]);
  const [ReportDataDetail, setReportDataDetail] = useState([]);
  const [DataChart, setDataChart] = useState([]);
  const [ShowList, setShowList] = useState("display-none");
  const [ShowDetail, setShowDetail] = useState("display-none");
  const [TitleDetail, setTitleDetail] = useState("");
  const [DataChartPie, setDataChartPie] = useState([]);

  /* run after render as document.ready */
  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
  }, []);

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
    /* setDisable(false); */
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
    const pr = {
      Json: JSON.stringify(params),
      func: "APIC_spKpiDeliveryCODReport_V1",
    };
    // call redux saga
    const data = await mainAction.API_spCallServer(pr, dispatch);
    setReportData(data);
    //PaginationTable();
    setShowDetail("display-none");
    setReportDataDetail([]);
    setDisable(true);

    if (data !== []) {
      //chart main
      setShowList("");
      let chart = [];
      data.forEach((element, index) => {
        chart.push([
          new Date(FormatDate(element.CreateDate, "y-k-d h:m")),
          element.TongTien,
        ]);
      });
      setDataChart([{ data: chart, label: "Tong tien" }]);
    }

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const ViewChart = async (item) => {
    setShowDetail("");
    setTitleDetail("ngày " + FormatDate(item.CreateDate, "d-k-y"));
    setDataChartPie([
      { title: "Mới tạo", value: item.MoiTao, color: "#008d4c" },
      { title: "Đang lấy hàng", value: item.DangLayHang, color: "#39cccc" },
      { title: "Đã lấy hàng", value: item.DaLayHang, color: "#555299" },
      {
        title: "Đang trung chuyển",
        value: item.DangTrungChuyen,
        color: "#01ff70",
      },
      { title: "Đã nhận lại", value: item.DaNhanLai, color: "#ff851b" },
      { title: "Đang phát", value: item.DangPhat, color: "#d81b60" },
      { title: "Thành công", value: item.ThanhCong, color: "#005384" },
      { title: "Phát lại", value: item.PhatLai, color: "#db8b0b" },
      { title: "Hoàn gốc", value: item.HoanGoc, color: "#00a7d0" },
    ]);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12 HomeTitle"> Báo cáo KPI báo phát COD</div>
          <div className="col-md-12 margin-top-10">
            <form className="form-horizontal">
              <div className="row">
                <div className="col-md-3"></div>
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
              </div>
              <div className="clearfix"></div>
           
            </form>
          </div>
       
          <div className="col-md-12">
            <div className={ShowDetail + " card"}>
              <div className="card-header card-header-primary">
                <h4 className="card-title">
                  <i class="material-icons mt10">insights</i> Chi tiết{" "}
                  {TitleDetail}
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
        </div>
        <div className="col-md-12 margin-top-10  text-center">
                <button type="reset" className="btn btn-sm text-transform btn-refeshno">
                  <i className="material-icons">undo</i> Hủy
                </button>
                <button
                  disabled={!disable}
                  onClick={ViewReport}
                  type="button"
                  className="btn btn-sm text-transform btn-save margin-left-10"
                >
                  <i className="material-icons">search</i> Xem báo cáo
                </button>
              </div>
      </div>
      <div className="col-md-12">
            <div className={ShowList + " row cardcus margin-top-20"}>
              <div className="col-md-12">
                <div className="table-responsive">
                  <table id="dataTable" className="table text-center">
                    <thead className=" text-primary">
                      <tr>
                        <th className="noExp">Tùy chọn</th>
                        <th>Ngày tạo</th>
                        <th>Tổng tiền</th>
                        <th>Tổng bill</th>
                        <th>Mới tạo</th>
                        <th>Đang lấy hàng</th>
                        <th>Đã lấy hàng </th>
                        <th>Đang trung chuyển</th>
                        <th>Đã nhận lại</th>
                        <th>Đang phát</th>
                        <th>Phát Thành Công</th>
                        <th>Đang Phát Lại</th>
                        <th>Hoàn Gốc</th>
                        <th>Có hình</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ReportData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="noExp">
                              <button
                                onClick={() => ViewChart(item)}
                                type="button"
                                className="btn btn-info btn-xs"
                              >
                                <i className="material-icons">bar_chart</i>{" "}
                                Xem
                              </button>
                            </td>
                            <td>{FormatDate(item.CreateDate, "d-k-y")}</td>
                            <td>{FormatMoney(item.TongTien)} đ</td>
                            <td>{FormatMoney(item.TongBill)}</td>
                            <td>
                              {item.MoiTao}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.MoiTao / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.DangLayHang}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.DangLayHang / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.DaLayHang}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.DaLayHang / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.DangTrungChuyen}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.DangTrungChuyen / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.DaNhanLai}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.DaNhanLai / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.DangPhat}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.DangPhat / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.ThanhCong}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.ThanhCong / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.PhatLai}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.PhatLai / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.HoanGoc}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.HoanGoc / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                            <td>
                              {item.CoHinh}
                              <br />
                              <i className="percent">
                                {"("}
                                {(
                                  (item.CoHinh / item.TongBill) *
                                  100
                                ).toFixed(2)}
                                {"%)"}
                              </i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="col-md-12 mt30">
                <p className="text-center bold">
                  THỐNG KÊ DOANH THU THEO NGÀY
                </p>
                <ChartTemp type="line" data={DataChart} />
              </div> */}
            </div>
          </div>
    </LayoutMain>
  );
};
