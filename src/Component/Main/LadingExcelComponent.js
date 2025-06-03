import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import {
  Alertsuccess,
  Alerterror,
  Alertwarning,
  DecodeString,
  FormatDate,
  PaginationTable,
  FormatMoney,
  ExportExcel,
  GetCookie,
  GetCookieGroup,
} from "../../Utils";
import XLSX from "xlsx";
import { Lading } from "../../Redux/Actions/Category";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { DataTable } from "../../Common/DataTable";
import { NoCustomer } from "../../Common";
import LayoutMain from "../../Layout/LayoutMain";

export const LadingExcelComponent = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true); // disable button
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const history = useHistory();

  const [ShowList, setShowList] = useState("display-none");
  const [ShowForm, setShowForm] = useState("");
  const [FileUpload, setFileUpload] = useState({ file: {} });
  const [UploadError, setUploadError] = useState("");
  const [LadingList, setLadingList] = useState([]);

  const [ShowUploadFile, setShowUploadFile] = useState("");
  const [ShowListFile, setShowListFile] = useState("display-none");

  useEffect(() => {
    if (CustomerID === null) history.push("/");
  }, []);

  const onFileChange = (event) => {
    if (event.target.files !== null) {
      setFileUpload({ file: event.target.files[0] });
      setShowUploadFile("display-none");
      setShowListFile("");
      document.querySelector(".close").click();
    }
  };

  //#region COPY FORM UPLOAD EXCEL FROM CPN
  let BreakException = {};
  // On file upload (click the upload button)
  const onFileUpload = async () => {
    setDisable(false);
    mainAction.LOADING({ IsLoading: true }, dispatch);

    if (FileUpload.file.name === undefined) {
      Alertwarning("Vui lòng chọn file");
      return;
    } else {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
        });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws);
        let ListArr = [];
        let ListProduct = [];
        try {
          let _rowIndex = 1;
          data.forEach((element, index) => {
            if (index === 0 && element.__EMPTY_56 !== "Mã xã") {
              mainAction.LOADING({ IsLoading: false }, dispatch);
              Alerterror(
                "File mẫu excel đã được cập nhật để bổ sung thêm nhiều sản phẩm cho đơn hàng. Vui lòng tải file mẫu mới !"
              );
              return;
            }

            if (index >= 2) {
              if (
                element.__EMPTY_2 === undefined ||
                element.__EMPTY_2.trim() === ""
              ) {
                throw BreakException;
              } else {
                debugger;
                let tmp = {
                  STT: _rowIndex,
                  Code: "D", // Mã vận đơn
                  PartnerCode: element.__EMPTY, // Mã đối tác
                  CustomerCode: GetCookie("CustomerCode"), // Mã khách hàng
                  RecipientAddress: element.__EMPTY_1, // Địa chỉ
                  CityRecipientNameTo: element.__EMPTY_2, // Tên tỉnh đến
                  DistrictNameTo: element.__EMPTY_3, // Tên huyện đến
                  WardsNameTo: element.__EMPTY_4, // Tên phường xã đến
                  RecipientName: element.__EMPTY_5, // Tên người nhận
                  RecipientPhone: element.__EMPTY_6, // SĐT NG nhận
                  RecipientCompany: element.__EMPTY_7, // Cty Người nhận
                  ServiceCode: element.__EMPTY_8, // Mã dịch vụ
                  PaymentType: element.__EMPTY_9, // Hình thức thanh toán
                  Weight:
                    element.__EMPTY_8.indexOf("CBM") === -1
                      ? element.__EMPTY_10
                      : 0, // Trọng lượng
                  Number: element.__EMPTY_11, // Số kiện
                  Mass:
                    element.__EMPTY_8.indexOf("CBM") !== -1
                      ? element.__EMPTY_12
                      : 0, // Số khối
                  Length: element.__EMPTY_13, // Dài
                  Width: element.__EMPTY_14, // Rộng
                  Height: element.__EMPTY_15, // Cao
                  THBB: element.__EMPTY_16, // THBB
                  BP: element.__EMPTY_17, // BP
                  Pack: element.__EMPTY_18, // Đóng gói
                  HD: element.__EMPTY_19, // Số lượng hóa đơn
                  COD: element.__EMPTY_20, // Tiền COD
                  HHKG: element.__EMPTY_21, // Tiền HHKG
                  NPDK: element.__EMPTY_22, // Số lượng nhập phát đồng kiểm
                  PTT: element.__EMPTY_23, // Phát tận tay
                  HQK: element.__EMPTY_24, // Hàng quá khổ
                  PST: element.__EMPTY_25, // Phát siêu thị
                  PDPQ: element.__EMPTY_26, // Phát đảo phú quốc
                  OnSiteDeliveryPrice: element.__EMPTY_27, // phần trăm phát tận nơi
                  Discount: 0, // phần trăm giảm giá
                  CustomerName_Reality: element.__EMPTY_28, // Tên người gửi thực tế
                  CustomerAddress_Reality: element.__EMPTY_29, // Đ/C người gửi thực tế
                  CustomerPhone_Reality: element.__EMPTY_30, // SĐT người gửi thực tế
                  Description: element.__EMPTY_51, // Nội dung
                  Noted: element.__EMPTY_52, // Ghi chú
                  TypeLading: 10,
                };
                ListArr.push(tmp);
                if (
                  element.__EMPTY_31 !== undefined &&
                  element.__EMPTY_32 !== undefined &&
                  element.__EMPTY_34 !== undefined &&
                  element.__EMPTY_34 !== 0
                ) {
                  ListProduct.push({
                    Key: _rowIndex,
                    ProductName: element.__EMPTY_31, // Tên sản phẩm 1
                    ProductCode: element.__EMPTY_32, // Mã sản phẩm 1
                    ProductDescription: element.__EMPTY_33, // Mổ tả sản phẩm 1
                    Quanlity: element.__EMPTY_34, // Số lượng sản phẩm 1
                  });
                }
                if (
                  element.__EMPTY_35 !== undefined &&
                  element.__EMPTY_36 !== undefined &&
                  element.__EMPTY_38 !== undefined &&
                  element.__EMPTY_38 !== 0
                ) {
                  ListProduct.push({
                    Key: _rowIndex,
                    ProductName: element.__EMPTY_35, // Tên sản phẩm 1
                    ProductCode: element.__EMPTY_36, // Mã sản phẩm 1
                    ProductDescription: element.__EMPTY_37, // Mổ tả sản phẩm 1
                    Quanlity: element.__EMPTY_38, // Số lượng sản phẩm 1
                  });
                }
                if (
                  element.__EMPTY_39 !== undefined &&
                  element.__EMPTY_40 !== undefined &&
                  element.__EMPTY_42 !== undefined &&
                  element.__EMPTY_42 !== 0
                ) {
                  ListProduct.push({
                    Key: _rowIndex,
                    ProductName: element.__EMPTY_39, // Tên sản phẩm 1
                    ProductCode: element.__EMPTY_40, // Mã sản phẩm 1
                    ProductDescription: element.__EMPTY_41, // Mổ tả sản phẩm 1
                    Quanlity: element.__EMPTY_42, // Số lượng sản phẩm 1
                  });
                }
                if (
                  element.__EMPTY_43 !== undefined &&
                  element.__EMPTY_44 !== undefined &&
                  element.__EMPTY_46 !== undefined &&
                  element.__EMPTY_46 !== 0
                ) {
                  ListProduct.push({
                    STT: _rowIndex,
                    ProductName: element.__EMPTY_43, // Tên sản phẩm 1
                    ProductCode: element.__EMPTY_44, // Mã sản phẩm 1
                    ProductDescription: element.__EMPTY_45, // Mổ tả sản phẩm 1
                    Quanlity: element.__EMPTY_46, // Số lượng sản phẩm 1
                  });
                }
                if (
                  element.__EMPTY_47 !== undefined &&
                  element.__EMPTY_48 !== undefined &&
                  element.__EMPTY_50 !== undefined &&
                  element.__EMPTY_50 !== 0
                ) {
                  ListProduct.push({
                    STT: _rowIndex,
                    ProductName: element.__EMPTY_47, // Tên sản phẩm 1
                    ProductCode: element.__EMPTY_48, // Mã sản phẩm 1
                    ProductDescription: element.__EMPTY_49, // Mổ tả sản phẩm 1
                    Quanlity: element.__EMPTY_50, // Số lượng sản phẩm 1
                  });
                }
                _rowIndex++;
              }
            }
          });
        } catch (e) {}
        if (ListArr === []) {
          Alertwarning("File không có dữ liệu !");
          return;
        } else {
          CPN_spLading_CreateCode(ListArr, ListProduct);
          console.log("check nha", ListArr, ListProduct);
        }
      };
      if (rABS) {
        reader.readAsBinaryString(FileUpload.file);
      } else {
        reader.readAsArrayBuffer(FileUpload.file);
      }
    }
  };

  const CPN_spLading_CreateCode = async (LadingList, ListProduct) => {
    const params = {
      json: JSON.stringify({ ListBill: LadingList, Products: ListProduct }),
      func: "CPN_spLading_CreateCode",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
    if (result[0].ListJsonOke === "{}") {
      setDisable(true);
    } else {
      CPN_spLading_Upload_Excel(
        JSON.parse(result[0].ListJsonOke),
        JSON.parse(result[0].Products)
      );
    }

    if (result[0].ListJsonNotOke != "{}") {
      ExportExcel(JSON.parse(result[0].ListJsonNotOke), "Vận đơn không hợp lệ");
    }
  };

  const [TotalBill, setTotalBill] = useState(0);
  const CPN_spLading_Upload_Excel = async (LadingList, ListProduct) => {
    const params = {
      API_key: APIKey,
      json: JSON.stringify({ ListBill: LadingList, Products: ListProduct }),
      func: "CPN_spLading_Upload_Excel",
    };
    debugger;
    const result = await mainAction.API_spCallServer(params, dispatch);
    debugger;
    setTotalBill(result.length);
    setLadingList(JSON.parse(result[0].ListBill));
    setShowList("");
    setShowForm("display-none");
    setDisable(true);
    if (result.length === 0) {
      Alertwarning("File không có dữ liệu !");
    }
  };
  //#endregion COPY FORM UPLOAD EXCEL FROM CPN

  const onCancelSave = () => {
    setLadingList([]);
    setShowList("display-none");
    setShowUploadFile("");
    setShowListFile("display-none");
    setShowForm("");
    setFileUpload({ file: {} });
    setUploadError("");
  };

  //#region Lưu vân đơn
  const CPN_spLading_Save = async () => {
    const params = {
      Json: JSON.stringify({ ListBill: LadingList, Products: [] }),
      func: "CPN_spLading_Save",
    };
    try {
      setDisable(true); // disable button
      const result = await mainAction.API_spCallServer(params, dispatch);
      setDisable(false); // disable button
      Alertsuccess(result.Status);
      setShowList("display-none");
      setShowForm("");
      setShowUploadFile("");
      setShowListFile("display-none");

      //Gọi send notify
      const NotifiParam = {
        Json: JSON.stringify({
          CustomerId: parseInt(CustomerID),
          FuncSend: "LadingCreate",
          SendFrom: "WEB CUSTOMER EXCEL",
          JsonData: [
            {
              TotalLading: LadingList.length,
            },
          ],
        }),
        func: "APIC_spSendNotification",
        API_key: APIKey,
      };
      const resultNotify = await mainAction.API_spCallServer(
        NotifiParam,
        dispatch
      );
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      setDisable(false); // disable button
    }
  };
  //#endregion

  const columns = [
    {
      Header: "Mã vận đơn",
      accessor: "Code",
    },
    {
      Header: "Người nhận",
      accessor: "RecipientName",
    },
    {
      Header: "Tỉnh đi",
      accessor: "CitySendCode",
    },
    {
      Header: "Tỉnh đến",
      accessor: "CityRecipientCode",
    },
    {
      Header: "Dịch vụ",
      accessor: "ServiceCode",
    },
    {
      Header: "Trọng lượng",
      accessor: "Weight",
      Cell: (obj) => <span>{FormatMoney(obj.value)} g</span>,
    },
    {
      Header: "Số kiện",
      accessor: "Number",
      Cell: (obj) => <span>{FormatMoney(obj.value)}</span>,
    },
    {
      Header: "Khối lượng",
      accessor: "Mass",
      Cell: (obj) => <span>{FormatMoney(obj.value)} cbm</span>,
    },
    {
      Header: "Tổng tiền",
      accessor: "Amount",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "Cước trắng",
      accessor: "PriceMain",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "Báo phát",
      accessor: "DeliveryMoney",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "Cước đóng gói",
      accessor: "PackPrice",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "HHKG",
      accessor: "Insured",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "Cước HHKG",
      accessor: "InsuredMoney",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "COD",
      accessor: "COD",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "Cước COD",
      accessor: "CODMoney",
      Cell: (obj) => <span>{FormatMoney(obj.value)} đ</span>,
    },
    {
      Header: "Nội dung hàng hóa",
      accessor: "Description",
    },
    {
      Header: "Ghi chú",
      accessor: "Noted",
    },
  ];

  return (
    <LayoutMain>
        {GetCookieGroup("IsChooseCustomer") === "True" ? (
          <>
            <div className="container-fluid">
              <div className="row Formlading">
                <div className="col-md-12 HomeTitle margin-top-20 margin-left-10">
                  Upload excel đơn hàng
                  <button
                    type="button"
                    class="btn btn-save text-transform btn-sm margin-left-10"
                    data-toggle="modal"
                    data-target="#exampleModal"
                  >
                    <i className="material-icons">cloud_upload</i> Upload file
                    Excel
                  </button>
                </div>

                <div
                  class="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog" role="document">
                    <div class="modal-content" style={{ marginTop: "24%" }}>
                      <div
                        class="modal-header"
                        style={{ borderBottom: "none" }}
                      >
                        <h5
                          class="modal-title"
                          id="exampleModalLabel"
                          className="bold"
                        >
                          Upload excel đơn hàng
                        </h5>
                        <button
                          type="button"
                          class="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body" style={{ marginTop: "-35px" }}>
                        <div className="col-md-12 margin-top-15s">
                          <span className="margin-left-15s">
                            Lần đầu sử dụng dịch vụ của chúng tôi?{" "}
                          </span>
                          <Link
                            className="Blue font-weight500 margin-left-10s"
                            download
                            target="_blank"
                            to="/assets/exceltemp/MauVanDonExcel-15-06-2022.xlsx"
                          >
                            Tải file mẫu
                          </Link>
                        </div>
                        <div className="excelbor margin-top-10">
                          <img
                            src="../assets/img/iconexcel.png"
                            className="margin-top-20"
                          />{" "}
                          {/* style={{ borderRadius: '3px' }} width="25px"  */}
                          <div>
                            {" "}
                            <span style={{ color: "blue" }}>
                              bấm vào đây
                              <input
                                type="file"
                                className="form-control openfile"
                                onChange={onFileChange}
                                onClick={(e) => {
                                  e.target.value = null;
                                }}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                placeholder="Chọn file tải lên (Mauvandonexcel2021.xlsx)"
                              />
                            </span>{" "}
                            để tải lên
                          </div>
                          <div style={{ color: "#9696A0", fontSize: "12px" }}>
                            Định dạng được hỗ trợ .xls, .xlsx. Dung lượng tối đa
                            5MB.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 margin-top-20 margin-left-10"></div>
                <div className={ShowListFile + " col-md-6"}>
                  <div
                    className={
                      FileUpload.file !== {}
                        ? "fileNameUpload row"
                        : "fileNameUpload row display-none"
                    }
                  >
                    <div className="col-md-2">
                      <img src="../assets/img/iconexcel.png" width="40px" />
                    </div>
                    <div className="fileameUpload col-md-8">
                      <div className="Filetitle">
                        {" "}
                        {FileUpload.file !== {} && FileUpload.file !== []
                          ? FileUpload.file.name
                          : ""}
                      </div>
                      <div className="Filetitle">
                        {" "}
                        {"(" + (FileUpload.file.size / 1024).toFixed(2) + "KB)"}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <i
                        className="material-icons pull-right pointer margin-top-10"
                        title="Xóa file"
                        onClick={(e) => {
                          setFileUpload({ file: {} });
                          setShowUploadFile("");
                          setShowListFile("display-none");
                          setUploadError("");
                        }}
                      >
                        delete
                      </i>
                    </div>
                  </div>
                  <div className="margin-top-10 margin-left-10">
                    <button
                      type="button"
                      className="btn btn-save text-transform btn-sm"
                      onClick={onFileUpload}
                    >
                      Tạo nhiều đơn hàng
                    </button>
                  </div>
                  <div className="errorUpload">{UploadError}</div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-12 mt10 margin-bottom-20 margin-left-10">
                  <span className="font-weight500">
                    Lần đầu sử dụng dịch vụ của chúng tôi?{" "}
                  </span>
                  <Link
                    className="Blue font-weight500"
                    download
                    target="_blank"
                    to="/assets/exceltemp/MauVanDonExcel-15-06-2022.xlsx"
                  >
                    Tải file mẫu
                  </Link>
                </div>
                <div className={ShowList + " col-md-12 30"}>
                  <button
                    type="button"
                    className="btn btn-save text-transform btn-sm margin-left-10 pull-right btn-sm"
                    disabled={!disable}
                    onClick={CPN_spLading_Save}
                  >
                    <i className="material-icons">check</i> Tạo đơn
                  </button>
                  <button
                    type="button"
                    className="btn btn-refesh text-transform pull-right btn-sm"
                    disabled={!disable}
                    onClick={onCancelSave}
                  >
                    <i className="material-icons">undo</i> Hủy
                  </button>
                </div>
                <div
                  className={
                    ShowList + " col-md-12 30 margin-top-20 Formlading"
                  }
                >
                  <DataTable data={LadingList} columns={columns} />
                </div>
              </div>
            </div>{" "}
          </>
        ) : (
          <NoCustomer />
        )}
    </LayoutMain>
  );
};
