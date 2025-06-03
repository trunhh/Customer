import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../Redux/Actions";
import {
  PaginationTable2,
  FormatDateJson,
  FormatMoney,
  Alerterror,
  GetCookie,
} from "../../Utils";
import { ExportExcel } from "../../Utils/ExportExcel";
import { useHistory } from "react-router-dom";
import { DataTable } from "../../Common/DataTable";
import LayoutMain from "../../Layout/LayoutMain";

export const GetLadingTemporary = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button;
  const history = useHistory();
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  /* run after render */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null) history.push("/");
    _Init();
  }, []);

  const _Init = async () => {
    setDisable(false);
    let params = {
      Json: '{"CustomerId":' + CustomerID + "}",
      func: "APIC_spLadingTemporaryReport",
    };

    try {
      //const data = await LadingTemporaryAction.CTM_spGetLadingTemporary(params, dispatch);
      const data = await mainAction.API_spCallServer(params, dispatch);
      setLadingTemporarylist(data);
      PaginationTable2();
    } catch (err) {
      Alerterror("Vui lòng liên hệ bộ phận CSKH");
      console.log("Eror", err);
    }

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  /* get list TimelineTransportList */
  const [LadingTemporarylist, setLadingTemporarylist] = useState([]);
  const [LadingDetailTemporarylist, setLadingDetailTemporarylist] = useState(
    []
  );
  const [hiddenTable, setHiddenTable] = useState(true);

  const APIC_spLadingTemporaryDetail = async (item) => {
    let params = {
      Json: '{"CustomerId":' + CustomerID + "}",
      func: "APIC_spLadingTemporaryDetail",
    };
    debugger;
    try {
      const data = await mainAction.API_spCallServer(params, dispatch);
      setLadingDetailTemporarylist(data);
      PaginationTable2();
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
    }

    mainAction.LOADING({ IsLoading: false }, dispatch);
    setHiddenTable(false);
  };

  const undo = () => {
    setHiddenTable(true);
  };

  const columnBk = [
    {
      Header: "Tùy chọn",
      maxWidth: 90,
      Cell: ({ row }) => (
        <i
          className="material-icons fontsizeicon14 green button"
          onClick={() => APIC_spLadingTemporaryDetail(row)}
        >
          remove_red_eye
        </i>
      ),
    },
    {
      Header: "Từ ngày",
      accessor: "FromDate",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
    },
    {
      Header: "Đến ngày",
      accessor: "ToDate",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
    },
    {
      Header: "Nhân viên công nợ",
      accessor: "OfficerName",
      minWidth: 250,
    },
    {
      Header: "Tổng vận đơn",
      accessor: "TotalBill",
      Cell: (item) => <span>{FormatMoney(item.value)}</span>,
    },
    {
      Header: "Tổng tiền",
      accessor: "TotalMoney",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
    },
    {
      Header: "Tổng tiền giảm",
      accessor: "DiscountAmount",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
    },
  ];

  const columnDetails = [
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
    },
    {
      Header: "Mã vận đơn",
      accessor: "Code",
      minWidth: 150,
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
      Header: "Thời gian gửi",
      accessor: "CreateDate",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
    },
    {
      Header: "Ước tính nhận",
      accessor: "DealineTime",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
    },
    {
      Header: "Dịch vụ",
      accessor: "ServiceName",
    },
    {
      Header: "Tình trạng",
      accessor: "StatusName",
    },
    {
      Header: "Trọng lượng",
      accessor: "Weight",
    },
    {
      Header: "Số kiện",
      accessor: "Number",
    },
  ];

  const ExportToExcel = () => {
    if (LadingDetailTemporarylist.length > 0) {
      let dataExcel = LadingDetailTemporarylist.map((item, index) => {
        return {
          "Mã vận đơn": item.Code,
          "Tỉnh đi": item.CitySendCode,
          "Tỉnh đến": item.CityRecipientCode,
          "Thời gian tạo": FormatDateJson(item.CreateDate),
          "Ngày phát thành công":
            item.FinishDate === undefined
              ? ""
              : FormatDateJson(item.FinishDate),
          "Dịch vụ": item.ServiceName,
          "Trạng thái": item.StatusName,
          "Trọng lượng": FormatMoney(item.Weight),
          "Số kiện": item.Number,
          "Tiền thu hộ": FormatMoney(item.COD),
          "Tổng cước phí": FormatMoney(item.Amount),
          "Hình thức thanh toán": item.PaymentString,
          "Người nhận": item.RecipientName,
          "SđT người nhận": item.RecipientPhone,
          "Công ty nhận": item.RecipientCompany,
          "Địa chỉ người nhận": item.RecipientAddress,
        };
      });
      ExportExcel(dataExcel, "Danh sách vận đơn công nợ tạm tính");
    } else {
      Alerterror("Không có dữ liệu để xuất. Vui lòng tìm kiếm trước !");
    }
  };

  return (
    <LayoutMain>
        <div className="container-fluid">
          <div
            className={
              hiddenTable === true
                ? "row cardcus display-block"
                : "row display-none"
            }
          >
            <div className="col-md-12 HomeTitle margin-bottom-20">
              Công nợ tạm tính
            </div>
            <div className="col-md-12">
              <DataTable data={LadingTemporarylist} columns={columnBk} />
            </div>
          </div>
          <div
            className={
              hiddenTable === false
                ? "row cardcus display-block"
                : "row display-none"
            }
          >
            <div className="col-md-12 HomeTitle margin-bottom-20">
              Chi tiết công nợ tạm tính
              <div className="pull-right">
                <button
                  type="button"
                  className="btn text-transform btn-save btn-sm"
                  disabled={disable}
                  onClick={() => undo()}
                >
                  <i className="material-icons">undo</i>
                  Quay Lại
                </button>
                <button
                  type="button"
                  onClick={ExportToExcel}
                  className="btn btn-sm text-transform btn-refesh margin-left-10"
                  style={{ margin: "0 5px" }}
                >
                  <img src="../assets/img/iconexcel.png" className="iconex" />
                  Xuất Excel
                </button>
              </div>
            </div>
            <div className="col-md-12">
              <DataTable
                data={LadingDetailTemporarylist}
                columns={columnDetails}
              />
            </div>
          </div>
        </div>
    </LayoutMain>
  );
};
