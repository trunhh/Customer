import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import {
  Alerterror,
  FormatDate,
  GetCookie,
  GetCookieGroup,
  PaginationTable,
} from "../../Utils";
import { ReportAction } from "../../Redux/Actions/Reports";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import LayoutMain from "../../Layout/LayoutMain";

export const WareHouseTranportReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();

  const [ViewList, setViewList] = useState("");
  const [ViewDetail, setViewDetail] = useState("display-none");

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [FromDate, setFromDate] = useState(new Date());
  const [ToDate, setToDate] = useState(new Date());

  const [WareHouseList, setWareHouseList] = useState([]);
  const [WareHouse, setWareHouse] = useState({ value: 0, label: "Chọn kho" });

  const [Parcels, setParcels] = useState([]);
  const [Parcel, setParcel] = useState({ value: 0, label: "Chọn lô" });

  const [ParcelsRecipient, setParcelsRecipient] = useState([]);

  const [WareHouseRecipient, setWareHouseRecipient] = useState({
    value: 0,
    label: "Chọn kho",
  });
  const [ParcelRecipient, setParcelRecipient] = useState({
    value: 0,
    label: "Chọn lô",
  });

  const [ReportData, setReportData] = useState([]);
  const [ReportDataDetail, setReportDataDetail] = useState([]);

  useEffect(() => {
    if (CustomerID === null)
      history.push("/");
    _Init();
  }, []);

  const _Init = async () => {
    setDisable(false);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
    };
    const data = await ReportAction.APIC_spWareHouse_List(params, dispatch);
    let _wareHouseList = [{ value: 0, label: "Chọn kho" }];
    setWareHouse({ value: 0, label: "Chọn kho" });
    JSON.parse(data.data).forEach((element, index) => {
      let option = { value: element.WareHouseId, label: element.WareHouseName };
      _wareHouseList.push(option);
    });
    setWareHouseList(_wareHouseList);
    setDisable(true);
  };

  const changeFromDate = (item) => {
    setFromDate(item);
    let _date = new Date(
      item.getFullYear(),
      item.getMonth() + 1,
      item.getDate()
    );
    setToDate(_date);
  };

  const changeToDate = (item) => {
    let _date = new Date(item);
    setFromDate(
      new Date(item.getFullYear(), item.getMonth() - 1, item.getDate())
    );
    setToDate(item);
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
    const data = await ReportAction.APIC_spWareHouse_Area_list(
      params,
      dispatch
    );
    let _parcelList = [{ value: 0, label: "Chọn lô" }];
    setParcel({ value: 0, label: "Chọn lô" });
    JSON.parse(data.data).forEach((element, index) => {
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

  const onChangeWareHouseListRecipient = async (item) => {
    setDisable(false);
    setWareHouseRecipient(item);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      WhId: item.value,
    };
    const data = await ReportAction.APIC_spWareHouse_Area_list(
      params,
      dispatch
    );
    debugger;
    let _parcelList = [{ value: 0, label: "Chọn lô" }];
    setParcelRecipient({ value: 0, label: "Chọn lô" });
    JSON.parse(data.data).forEach((element, index) => {
      let option = {
        value: element.WareHouseAreaId,
        label: element.WareHouseAreaName,
      };
      _parcelList.push(option);
    });
    setParcelsRecipient(_parcelList);
    setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const onChangeParcelRecipient = async (item) => {
    setDisable(false);
    setParcelRecipient(item);
    setDisable(true);
  };

  const ViewReport = async () => {
    //ScrollTop();
    //setDisable(false);
    debugger;
    if (WareHouse === null || WareHouse.value === 0) {
      Alerterror("Chọn kho chuyển");
      return false;
    } else if (Parcel === null || Parcel.value === 0) {
      Alerterror("Chọn lô chuyển");
      return false;
    } else if (WareHouseRecipient === null || WareHouseRecipient.value === 0) {
      Alerterror("Chọn kho nhận");
      return false;
    } else if (ParcelRecipient === null || ParcelRecipient.value === 0) {
      Alerterror("Chọn lô nhận");
      return false;
    }

    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerID: CustomerID, //17478
      CustomerIds: GetCookieGroup("CustomerIds"),
      WhId: WareHouse.value,
      ParcelId: Parcel.value,
      WhIdRecipient: WareHouseRecipient.value,
      ParcelIdRecipient: ParcelRecipient.value,
      FromDate: FromDate.toISOString(),
      ToDate: ToDate.toISOString(),
    };
    let a = JSON.stringify(params);
    const data = await ReportAction.APIC_spWareHouse_Tranport_Report(
      params,
      dispatch
    );
    setReportData(JSON.parse(data.data));
    setReportDataDetail([]);
    PaginationTable();
    //setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const ViewReportDetail = async (item) => {
    //ScrollTop();
    //setDisable(false);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerID: 17478,
      CustomerIds: GetCookieGroup("CustomerIds"),
      WhId: item.WHWareHouse_ImportID,
    };
    let a = JSON.stringify(params);
    const data = await ReportAction.APIC_spWareHouse_Tranport_Report_Detail(
      params,
      dispatch
    );
    setReportDataDetail(JSON.parse(data.data));
    PaginationTable();
    //setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12">
            <div className={ViewList + " card"}>
              <div className="card-header card-header-primary">
                <h4 className="card-title">
                  <i className="material-icons">bubble_chart</i> BÁO CÁO CHUYỂN
                  KHO
                </h4>
              </div>
              <div className="card-body">
                <form className="form-horizontal">
                  <div className="row">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                      <label>Chọn kho chuyển</label>
                      <div className="form-group bmd-form-group mt0">
                        <Select
                          value={WareHouse}
                          onChange={onChangeWareHouseList}
                          options={WareHouseList}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label>Chọn lô chuyển</label>
                      <div className="form-group bmd-form-group mt0">
                        <Select
                          value={Parcel}
                          onChange={onChangeParcel}
                          options={Parcels}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label>Chọn kho nhận</label>
                      <div className="form-group bmd-form-group mt0">
                        <Select
                          value={WareHouseRecipient}
                          onChange={onChangeWareHouseListRecipient}
                          options={WareHouseList}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label>Chọn lô nhận</label>
                      <div className="form-group bmd-form-group mt0">
                        <Select
                          value={ParcelRecipient}
                          onChange={onChangeParcelRecipient}
                          options={ParcelsRecipient}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="col-md-12 text-center">
                    {/*  <button type="reset" className="btn btn-default">
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
                  </div>
                </form>
                <div className="table-responsive">
                  <table id="dataTable" className="table">
                    <thead className=" text-primary">
                      <tr>
                        <th>STT</th>
                        {/* <th>Tùy chọn</th> */}
                        <th>Mã phiếu nhập</th>
                        <th>Thời gian nhập</th>
                        <th>Người nhập</th>
                        <th>Mã khách hàng</th>
                        <th>Tên khách hàng</th>
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
                           {/*  <td>
                              <button
                                onClick={() => ViewReportDetail(item)}
                                type="button"
                                className="btn btn-info btn-sm pull-right"
                              >
                                <i className="material-icons">loyalty</i> Detail
                              </button>
                            </td> */}
                            <td>{item.WHWareHouse_ImportCode} </td>
                            <td>
                              {FormatDate(item.CreateTimeImport, "d-k-y H:m")}
                            </td>
                            <td>{item.OfficerName}</td>
                            <td>{item.CustomerCode}</td>
                            <td>{item.CustomerName}</td>
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
            <div className={ViewDetail + " card"}>
              <div className="card-header card-header-primary">
                <h4 className="card-title">
                  <i className="material-icons">bubble_chart</i> CHI TIẾT CHUYỂN
                  KHO
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
                            <th>Số lượng nhập</th>
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
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
