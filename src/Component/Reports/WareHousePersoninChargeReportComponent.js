import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import {
  Alerterror,
  FormatDate,
  PaginationTable,
  PaginationTable2,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import { ReportAction } from "../../Redux/Actions/Reports";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { DataTable } from "../../Common/DataTable";
import { ExportExcel } from "../../Utils/ExportExcel";
import { formatNumber } from "canvasjs-react-charts/canvasjs.min";
import LayoutMain from "../../Layout/LayoutMain";

export const WareHousePersoninChargeReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();

  const [ViewList, setViewList] = useState("");
  const [ViewDetailImport, setViewDetailImport] = useState("display-none");
  const [ViewDetailOutput, setViewDetailOutput] = useState("display-none");

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [FromDate, setFromDate] = useState(new Date());
  const [ToDate, setToDate] = useState(new Date());
  const [WareHouseList, setWareHouseList] = useState([{ value: 0, label: "Chọn kho" }]);
  const [Parcels, setParcels] = useState([{ value: 0, label: "Chọn lô" }]);
  const [SupplierList, setSupplierList] = useState([{ value: 0, label: "Chọn NPT" }]);

  const [WareHouse, setWareHouse] = useState({ value: 0, label: "Chọn kho" });
  const [Parcel, setParcel] = useState({ value: 0, label: "Chọn lô" });
  const [Supplier, setSupplier] = useState({ value: 0, label: "Chọn NPT" });

  const [ReportData, setReportData] = useState([]);
  const [ReportDataDetailImport, setReportDataDetailImport] = useState([]);
  const [ReportDataDetailOutput, setReportDataDetailOutput] = useState([]);

  /* run after render as document.ready */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null)
      history.push("/");
    _Init();
  }, []);


  //#region Load Data

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
    let pr = {
      Json: JSON.stringify(params),
      func: "WH_spWareHouse_List_V1",
    };
    const data = await mainAction.API_spCallServer(pr, dispatch);

    let _wareHouseList = [{ value: 0, label: "Chọn kho" }];
    setWareHouse({ value: 0, label: "Chọn kho" });
    data.forEach((element, index) => {
      let option = { value: element.WareHouseId, label: element.WareHouseName };
      _wareHouseList.push(option);
    });
    setWareHouseList(_wareHouseList);

    let prList = {
      Json: JSON.stringify({
        Id: 0, CreateId: 0
      }),
      func: "WH_spPersoninCharge_List",
    };
    debugger
    const dataSupplier = await mainAction.API_spCallServer(prList, dispatch);
    let _supplierList = [{ value: 0, label: "Chọn NPT" }];
    setSupplier({ value: 0, label: "Chọn NPT" });
    debugger
    dataSupplier.forEach((element, index) => {
      let option = { value: element.Id, label: element.Name };
      _supplierList.push(option);
    });
    setSupplierList(_supplierList);

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

  const onChangeSuppliers = async (item) => {
    setDisable(false);
    setSupplier(item);
    setDisable(true);
  };

  //#endregion

  //#region Danh sách

  const ViewReport = async () => {
    let params = {
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      WareHouseId: WareHouse.value,
      WareHouseAreaId: Parcel.value,
      FromDate: FromDate.toISOString(),
      Todate: ToDate.toISOString(),
      SupplierId: Supplier.value
    };

    let prList = {
      Json: JSON.stringify(params),
      func: "WH_spWareHouse_InventoryPersoninCharge_Report",
    };
    const data = await mainAction.API_spCallServer(prList, dispatch);
    setReportData(data);
    setReportDataDetailImport([]);
    setReportDataDetailOutput([]);
    PaginationTable();
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  //#endregion

  //#region Xuất excel

  const ExportToExcel = () => {
    let dataExcel = ReportData.map((item, index) => {
      return {
        "STT": (index + 1),
        "Mã NPT": item.Code,
        "Tên NPT": item.Name,
        "Mã PO": item.POCode,
        "Mã sản phẩm":item.ProductCode,
        "Tên sản phẩm":item.ProductName,
        "Ngày nhập":item.CreateTimeImport,
        "Ngày xuất":item.CreateTimeOutput,
        "Nhập đầu kỳ": item.TotalSupplierImport,
        "Xuất đầu kỳ": item.TotalSupplierOutput,
        "Tồn đầu kỳ": item.TotalInventoryBegin,
        "Nhập phát sinh": item.TotalSupplierImportEnd,
        "Xuất phát sinh": item.TotalSupplierOutputEnd,
        "Tồn phát sinh": item.TotalInventoryEnd,
      };
    });
    ExportExcel(dataExcel, "Báo cáo tồn kho theo NPT");
  };

  //#endregion

  let totalImportBegin = 0, totalExportBegin = 0, totalInventoryBegin = 0, totalImport = 0, totalExport = 0, totalInventory = 0
  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row cardcus">
          <div className="col-md-12">
            <div className={ViewList + " card"}>
              <div className="card-header card-header-primary">
                <h4 className="card-title">
                  <i className="material-icons">bubble_chart</i> BÁO CÁO TỒN KHO THEO NPT
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
                    <div className="col-md-6">
                      <label>Chọn NPT</label>
                      <div className="form-group bmd-form-group mt0">
                        <Select
                          value={Supplier}
                          onChange={onChangeSuppliers}
                          options={SupplierList}
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
                <div className="col-md-12">
                  {ReportData.length > 0 &&
                    <div className="table-responsive">
                      <table id="dataTable" className="table">
                        <thead className="text-primary text-center">
                          <tr>
                            <th rowSpan="2">STT</th>
                            <th rowSpan="2">Tên NPT</th>
                            <th rowSpan="2">Mã NPT</th>
                            <th rowSpan="2">Mã PO</th>
                            <th rowSpan="2">Mã sản phẩm</th>
                            <th rowSpan="2">Tên sản phẩm</th>
                            <th rowSpan="2">Ngày nhập</th>
                            <th rowSpan="2">Ngày xuất</th>
                            <th colSpan="3">Đầu kì</th>
                            <th colSpan="3">Cuối kì</th>
                          </tr>
                          <tr>
                            <th>Nhập</th>
                            <th>Xuất</th>
                            <th>Tồn</th>
                            <th>Nhập</th>
                            <th>Xuất</th>
                            <th>Tồn</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {ReportData.map((item, index) => {
                            totalImportBegin += item.TotalSupplierImportEnd;
                            totalExportBegin += item.TotalSupplierOutputEnd;
                            totalInventoryBegin += item.TotalInventoryEnd;
                            totalImport += item.TotalSupplierImport;
                            totalExport += item.TotalSupplierOutput;
                            totalInventory += item.TotalInventoryBegin;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.Name} </td>
                                <td>{item.Code}</td>
                                <td>{item.POCode}</td>

                                <td>{item.ProductCode} </td>
                                <td>{item.ProductName} </td>
                                <td>{item.CreateTimeImport} </td>
                                <td>{item.CreateTimeOutput} </td>

                                <td>{item.TotalSupplierImport}</td>
                                <td>{item.TotalSupplierOutput}</td>
                                <td>{item.TotalInventoryBegin}</td>
                                <td>{item.TotalSupplierImportEnd}</td>
                                <td>{item.TotalSupplierOutputEnd}</td>
                                <td>{item.TotalInventoryEnd}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="text-center">
                          <tr style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>
                            <td colSpan="8">Tổng cộng</td>
                            <td>{formatNumber(totalImport)}</td>
                            <td>{formatNumber(totalExport)}</td>
                            <td>{formatNumber(totalInventory)}</td>
                            <td>{formatNumber(totalImportBegin)}</td>
                            <td>{formatNumber(totalExportBegin)}</td>
                            <td>{formatNumber(totalInventoryBegin)}</td>
                          </tr>
                        </tfoot>
                      </table>
                      {/*  <DataTable data={ReportData} columns={columns} /> */}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
