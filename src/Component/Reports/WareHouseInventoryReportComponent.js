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
import LayoutMain from "../../Layout/LayoutMain";

export const WareHouseInventoryReportComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();

  const [ViewList, setViewList] = useState("");
  const [ViewDetail, setViewDetail] = useState("display-none");

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


  //#region Load Data

  const changeFromDate = (item) => {
    setFromDate(item);
    /* let _date = new Date(
      item.getFullYear(),
      item.getMonth() + 1,
      item.getDate()
    );
    setToDate(_date); */
  };

  const changeToDate = (item) => {
    /* let _date = new Date(item);
    setFromDate(
      new Date(item.getFullYear(), item.getMonth() - 1, item.getDate())
    ); */
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

  //#endregion

  //#region Danh sách

  const ViewReport = async () => {
    debugger
    let params = {
      CustomerId: CustomerID,
      CustomerIds: GetCookieGroup("CustomerIds"),
      WareHouseId: WareHouse.value,
      WareHouseAreaId: Parcel.value,
      FromDate: FromDate.toISOString(),
      ToDate: ToDate.toISOString(),
    };
    let prList = {
      Json: JSON.stringify(params),
      func: "APIC_spWareHouse_Inventory_Report",
    };
    const data = await mainAction.API_spCallServer(prList, dispatch);
    debugger
    setReportData(data);
    setReportDataDetail([]);
    //PaginationTable();
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const columns = [
    /* {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <span>
          <i className="fa fa-eye green"
            data-toggle="modal"
            data-target="#modalDetail"
            onClick={() => ViewReportDetail(row)}
            title="Chi tiết"></i>
        </span>
      ),
      minWidth: 80,
      filterable: false,
    }, */
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
      filterable: false,
    },
    {
      Header: "Mã sản phẩm",
      accessor: "ProductCode",
    },
    {
      Header: "Tên sản phẩm",
      accessor: "ProductName",
    },
    {
      Header: "Nhập",
      accessor: "TotalProductImport",
    },
    {
      Header: "C.Nhập",
      accessor: "TotalProductTranportin",
    },
    {
      Header: "Xuất",
      accessor: "TotalProductOutput",
    },
    {
      Header: "C.Xuất",
      accessor: "TotalProductTranportOut",
    },
    {
      Header: "Tồn",
      accessor: "TotalInventory",
    },
    {
      Header: "Giá sản phẩm",
      accessor: "ProductPrice",
    },
    {
      Header: "Trọng lượng",
      accessor: "QuanlityExchange",
    },
    {
      Header: "Size",
      accessor: "SizeName",
    },
    {
      Header: "Màu",
      accessor: "ColorName",
    },
    {
      Header: "Đơn vị tính",
      accessor: "UnitName",
    },
  ];

  //#endregion

  //#region Chi tiết

  const ViewReportDetail = async (item) => {
    setDisable(false);
    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      CustomerID: CustomerID, //17478
      CustomerIds: GetCookieGroup("CustomerIds"),
      WhId: item.WHWareHouse_ImportID,
    };
    let a = JSON.stringify(params);
    const data = await ReportAction.APIC_spWareHouse_Inventory_Report_Detail(
      params,
      dispatch
    );
    setReportDataDetail(JSON.parse(data.data));
    PaginationTable2();
    setDisable(true);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const columnDetails = [
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
      filterable: false,
    },
    {
      Header: "Mã sản phẩm",
      accessor: "ProductCode",
    },
    {
      Header: "Tên sản phẩm",
      accessor: "ProductName",
    },
    {
      Header: "Số lượng nhập",
      accessor: "PackageNumber",
    },
    {
      Header: "Gía sản phẩm",
      accessor: "ProductPrice",
    },
    {
      Header: "Tên màu",
      accessor: "ColorName",
    },
    {
      Header: "Tên kích thước",
      accessor: "SizeName",
    },
    {
      Header: "Tên đơn vị tính",
      accessor: "UnitName",
    },
  ];

  //#endregion

  //#region Xuất excel

  const ExportToExcel = () => {
    let dataExcel = ReportData.map((item, index) => {
      return {
        "STT": (index + 1),
        "Mã sản phẩm": item.ProductCode,
        "Tên sản phẩm": item.ProductName,
        "Mã PO": item.POCode,
        "Nhập đầu kỳ": item.TotalProductImportBegin,
        "Xuất đầu kỳ": item.TotalProductOutputBegin,
        "Tồn đầu kỳ": item.TotalInventoryBegin,
        "Nhập phát sinh": (item.TotalProductImport + "(" + item.TotalProductImportExchange + ")"),
        "Xuất phát sinh": (item.TotalProductOutput + "(" + item.TotalProductOutputExchange + ")"),
        "Tồn phát sinh": (item.TotalInventory + "(" + item.TotalInventoryExchange + ")"),
        "Giá sản phẩm (VND)": item.ProductPrice,
        "Trọng lượng (KG)": item.QuanlityExchange,
        "Màu": item.ColorName,
        "Kích thước": item.SizeName,
        "Đơn vị tính": item.UnitName,
        "Tổng Pallet": item.NumberPallet,
        "Tổng M2 Pallet": item.NumberPalletM2,
      };
    });
    ExportExcel(dataExcel, "Báo cáo tồn kho ");
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
                  <i className="material-icons">bubble_chart</i> BÁO CÁO TỒN KHO
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
                <div className="col-md-12">
                  {ReportData.length > 0 &&
                    <div className="table-responsive">
                      <table id="dataTable" className="table">
                        <thead className="text-primary text-center">
                          <tr>
                            <th rowSpan="2">STT</th>
                            <th rowSpan="2">Mã sản phẩm</th>
                            <th rowSpan="2">Tên sản phẩm</th>
                            <th rowspan="2">Mã PO</th>
                            <th colSpan="3">Đầu kì</th>
                            <th colSpan="3">Cuối kì</th>
                            <th rowSpan="2">Giá sản phẩm (VND)</th>
                            <th rowSpan="2">Trọng lượng (KG)</th>
                            <th rowSpan="2">Màu</th>
                            <th rowSpan="2">Kích thước</th>
                            <th rowSpan="2">Đơn vị tính</th>
                            <th rowspan="2">Tổng Pallet</th>
                            <th rowspan="2">Tổng M2 Pallet</th>
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
                            totalImportBegin += item.TotalProductImportBegin;
                            totalExportBegin += item.TotalProductOutputBegin;
                            totalInventoryBegin += item.TotalInventoryBegin;
                            totalImport += item.TotalProductImport;
                            totalExport += item.TotalProductOutput;
                            totalInventory += item.TotalInventory;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.ProductCode} </td>
                                <td>{item.ProductName}</td>
                                <td>{item.POCode}</td>
                                <td>{item.TotalProductImportBegin}</td>
                                <td>{item.TotalProductOutputBegin}</td>
                                <td>{item.TotalInventoryBegin}</td>
                                <td>{item.TotalProductImport}</td>
                                <td>{item.TotalProductOutput}</td>
                                <td>{item.TotalInventory}</td>
                                <td>{item.ProductPrice}</td>
                                <td>{item.QuanlityExchange}</td>
                                <td>{item.ColorName}</td>
                                <td>{item.SizeName}</td>
                                <td>{item.UnitName}</td>
                                <td>{item.NumberPallet}</td>
                                <td>{item.NumberPalletM2}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="text-center">
                          <tr style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>
                            <td colSpan="3">Tổng cộng</td>
                            <td>{totalImportBegin}</td>
                            <td>{totalExportBegin}</td>
                            <td>{totalInventoryBegin}</td>
                            <td>{totalImport}</td>
                            <td>{totalExport}</td>
                            <td>{totalInventory}</td>
                            <td colSpan="8"></td>
                          </tr>
                        </tfoot>
                      </table>
                      {/*  <DataTable data={ReportData} columns={columns} /> */}
                    </div>
                  }
                </div>
              </div>
              <div className={ViewDetail + " card"}>
                <div className="card-header card-header-primary">
                  <h4 className="card-title">
                    <i className="material-icons">bubble_chart</i> CHI TIẾT TỒN
                    KHO
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <DataTable data={ReportDataDetail} columns={columnDetails} />
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
