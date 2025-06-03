import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import {
  Alerterror,
  FormatDateJson,
  PaginationTable,
  GetCookie,
  Alertinfo,
  GetCookieGroup,
} from "../../Utils";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { ExportExcel } from "../../Utils/ExportExcel";
import LayoutMain from "../../Layout/LayoutMain";

/* Load CSS */

export const WareHouseOutputReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();

  const [IsShowDetail, setIsShowDetail] = useState(false);

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [FromDate, setFromDate] = useState(new Date());
  const [ToDate, setToDate] = useState(new Date());
  const [WareHouseList, setWareHouseList] = useState([{ value: 0, label: "Chọn kho" }]);
  const [Parcels, setParcels] = useState([{ value: 0, label: "Chọn lô" }]);
  const [WareHouse, setWareHouse] = useState({ value: 0, label: "Chọn kho" });
  const [Parcel, setParcel] = useState({ value: 0, label: "Chọn lô" });
  const [ReportData, setReportData] = useState([]);
  const [ReportDataDetail, setReportDataDetail] = useState([]);

  /* run after render as document.ready */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null)
      history.push("/");
    _Init();
  }, []);

  const changeFromDate = (item) => {
    setFromDate(item);
  };

  const changeToDate = (item) => {
    setToDate(item);
  };

  const _Init = async () => {
    setDisable(false);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
    };
    
    let prList = {
      Json: JSON.stringify(params),
      func: "WH_spWareHouse_List_V1",
    };
    const data = await mainAction.API_spCallServer(prList, dispatch);

    let _wareHouseList = [{ value: 0, label: "Chọn kho" }];
    setWareHouse({ value: 0, label: "Chọn kho" });
    data.forEach((element, index) => {
      let option = { value: element.WareHouseId, label: element.WareHouseName };
      _wareHouseList.push(option);
    });
    setWareHouseList(_wareHouseList);
    setDisable(true);
  };
  
  const onChangeWareHouseList = async (item) => {
    setDisable(false);
    setWareHouse(item);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      WhId: item.value,
    };
    
    let prList = {
      Json: JSON.stringify(params),
      func: "WH_spWareHouse_Area_List_V1",
    };
    const data = await mainAction.API_spCallServer(prList, dispatch);

    let _parcelList = [{ value: 0, label: "Chọn lô" }];
    setParcel({ value: 0, label: "Chọn lô" });
    data.forEach((element, index) => {
      let option = {
        value: element.WareHouseAreaId,
        label: element.WareHouseAreaName,
      };
      _parcelList.push(option);
    });
    setParcels(_parcelList);
    setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const onChangeParcel = async (item) => {
    setDisable(false);
    setParcel(item);
    setDisable(true);
  };

  const ViewReport = async () => {
    setDisable(false);

    let params = {
      CustomerId: CustomerID, //17478
      CustomerIds: GetCookieGroup("CustomerIds"),
      WareHouseId: WareHouse.value,
      WareHouseAreaId: Parcel.value,
      FromDate: FromDate.toISOString(),
      ToDate: ToDate.toISOString(),
    };

    let prList = {
      Json: JSON.stringify(params),
      func: "APIC_spWareHouse_Output_Report",
    };
    const data = await mainAction.API_spCallServer(prList, dispatch);
    setReportData(data);

    setReportDataDetail([]);
    //PaginationTable();

    if(data.length===0)
      Alertinfo("Không có dữ liệu");

    setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const ViewReportDetail = async (item) => {
    setDisable(false);

    let params = {
      CustomerID: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      WhId: item.WHWareHouse_OutputID,
    };

    let prList = {
      Json: JSON.stringify(params),
      func: "APIC_spWareHouse_Output_Report_Detail",
      API_key: APIKey,
    };
    const data = await mainAction.API_spCallServer(prList, dispatch);
    setReportDataDetail(data);
    setIsShowDetail(true);
    PaginationTable();
    setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  //#region Xuất excel

  const ExportToExcel = () => {
    let dataExcel = ReportData.map((item, index) => {
      return {
        "STT": (index + 1),
        "Mã phiếu xuất": item.WHWareHouse_OutputCode,
        "Thời gian xuất": FormatDateJson(item.CreateTimeOutput,1),
        "Người xuất": item.OfficerName,
        "Tên NCC": item.SupplierName,
        "Mã khách hàng":item.CustomerCode,
        "Tên khách hàng": item.CustomerName,
        "Mã PO": item.POCode,
        "Mã kho": item.WareHouseCode,
        "Mã lô":item.WareHouseAreaCode,
        "Tổng sản phẩm":item.TotalProducts,
        "Tổng số lượng": item.TotalNumber,
      };
    });
    ExportExcel(dataExcel, "Báo cáo xuất kho");
  };

  //#endregion


  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12">
            {!IsShowDetail &&
              <div className="card">
                <div className="card-header card-header-primary">
                  <h4 className="card-title">
                    <i className="material-icons">bubble_chart</i> BÁO CÁO XUẤT
                    KHO
                  </h4>
                </div>
                <div className="card-body">
                  <form className="form-horizontal">
                    <div className="row">
                      <div className="col-md-3">
                        <label>Từ ngày</label>
                        <div className="form-group bmd-form-group mt0">
                          <DateTimePicker
                            onChange={changeFromDate}
                            value={FromDate}
                            className="form-control"
                            format={"dd/MM/yyyy"}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label>Đến ngày</label>
                        <div className="form-group bmd-form-group mt0">
                          <DateTimePicker
                            onChange={changeToDate}
                            value={ToDate}
                            className="form-control"
                            format={"dd/MM/yyyy"}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label>Chọn kho</label>
                        <div className="form-group bmd-form-group mt0">
                          <Select
                            value={WareHouse}
                            onChange={onChangeWareHouseList}
                            options={WareHouseList}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label>Chọn lô</label>
                        <div className="form-group bmd-form-group mt0">
                          <Select
                            value={Parcel}
                            onChange={onChangeParcel}
                            options={Parcels}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="col-md-12 text-center">
                      {/* <button type="reset" className="btn btn-default">
                        <i className="material-icons">undo</i> Hủy
                      </button> */}
                      <button
                        disabled={!disable}
                        onClick={ViewReport}
                        type="button"
                        className="btn btn-danger"
                      >
                        <i className="material-icons">search</i> Xem báo cáo
                      </button>
                      <button
                      disabled={!disable}
                      type="button"
                      onClick={ExportToExcel}
                      className="btn btn-sm text-transform btn-refeshno margin-left-10"
                    >
                      <img src="../assets/img/iconexcel.png" className='iconex' />
                      Xuất Excel
                    </button>
                    </div>
                  </form>
                  <div className="table-responsive">
                    <table id="dataTable" className="table">
                      <thead className=" text-primary">
                        <tr>
                          <th>STT</th>
                          <th>Tùy chọn</th>
                          <th>Mã phiếu xuất</th>
                          <th>Thời gian xuất</th>
                          <th>Người xuất</th>
                          <th>Tên NCC</th>
                          <th>Mã khách hàng</th>
                          <th>Tên khách hàng</th>
                          <th>Mã PO</th>
                          <th>Mã kho</th>
                          <th>Mã lô</th>
                          <th>Tổng sản phẩm</th>
                          <th>Tổng số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ReportData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <button onClick={() => ViewReportDetail(item)} type="button" className="btn btn-success btn-sm">
                                  <i className="fa fa-eye"></i>
                                </button>
                              </td>
                              <td>{item.WHWareHouse_OutputCode} </td>
                              <td>{FormatDateJson(item.CreateTimeOutput, 1)}</td>
                              <td>{item.OfficerName}</td>
                              <td>{item.SupplierName}</td>
                              <td>{item.CustomerCode}</td>
                              <td>{item.CustomerName}</td>
                              <td>{item.POCode}</td>
                              <td>{item.WareHouseCode}</td>
                              <td>{item.WareHouseAreaCode}</td>
                              <td>{item.TotalProducts}</td>
                              <td>{item.TotalNumber}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
            {IsShowDetail &&
              <div className="card">
                <div className="card-header card-header-primary">
                  <h4 className="card-title">
                    <i className="material-icons">bubble_chart</i> CHI TIẾT XUẤT KHO
                    <div class="pull-right">
                      <button type="button" class="btn btn-sm btn-default" onClick={(e) => setIsShowDetail(false)}><i class="fa fa-undo"></i> Về danh sách</button>
                    </div>
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table id="dataTable" className="table">
                          <thead className=" text-primary">
                            <tr>
                              <th>STT</th>
                              <th>Mã sản phẩm</th>
                              <th>Tên sản phẩm</th>
                              <th>Số lượng xuất</th>
                              <th>Gía sản phẩm</th>
                              <th>Tên màu</th>
                              <th>Tên kích thước</th>
                              <th>Tên đơn vị tính</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ReportDataDetail.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.ProductCode} </td>
                                  <td>{item.ProductName}</td>
                                  <td>{item.PackageNumber}</td>
                                  <td>{item.ProductPrice}</td>
                                  <td>{item.ColorName}</td>
                                  <td>{item.SizeName}</td>
                                  <td>{item.UnitName}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
