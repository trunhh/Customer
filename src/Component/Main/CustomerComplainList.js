import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FormatDate, Alerterror, GetCookie, GetCookieGroup } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import DateTimePicker from "react-datetime-picker";
import { useInput } from "../../Hooks";
import { CustomerAction } from "../../Redux/Actions/Main";
import { useHistory } from "react-router-dom";
import { DataTable } from "../../Common/DataTable";
import { ExportExcel } from "../../Utils/ExportExcel";
import LayoutMain from "../../Layout/LayoutMain";

export const CustomerComplainList = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button;
  const history = useHistory();

  const [CustomerComplainlist, setCustomerComplainlist] = useState([]);
  const [AppAPIKey, setAppAPIKey] = useState("netcoAPIkey2020");
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [Type, setType] = useState(0);
  const [State, setState] = useState(0);
  const [Code, binCode, setCode] = useInput("");

  const [fdate, setFdate] = useState(new Date());
  const [tdate, setTdate] = useState(new Date());

  const FromDate = (item) => {
    setFdate(item);
  };
  const ToDate = (item) => {
    setTdate(item);
  };

  /* run after render */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null) {
      history.push("/");
    }
  }, []);

  const APIC_spCustomerComplainList = async () => {
    if (fdate === "") {
      Alerterror("Chọn từ ngày");
      return;
    } else if (tdate === "") {
      Alerterror("Chọn đến ngày");
      return;
    } else {
      let params = {
        CustomerId: CustomerID,
        FromDate: fdate.toISOString(),
        ToDate: tdate.toISOString(),
        Skip: 0,
        Take: 200,
        Type: Type,
        State: State,
        Code: Code,
        CustomerIds: GetCookieGroup("CustomerIds"),
      };

      const pr = {
        Json: JSON.stringify(params),
        func: "APIC_spCustomerComplainList_Json",
      };
      // call redux saga
      const result = await mainAction.API_spCallServer(pr, dispatch);

      setCustomerComplainlist(result);
      //console.log(data);
    }
    // PaginationTable();
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const firtdatasearch = () => {
    setCustomerComplainlist([]);
  };

  const columns = [
    {
      Header: "Tên người khiếu nại",
      accessor: "ComplainName",
      // Cell: ({row})  => (<button className="btn btn-sm btn-danger" onClick={e => clickRow({row})}>Edit</button>)
    },
    {
      Header: "Mã khiếu nại",
      accessor: "ComplainCode",
    },
    {
      Header: "Mã vận đơn",
      accessor: "LadingCode",
    },
    {
      Header: "Ngày tạo",
      accessor: "ComplainDate",
      Cell: (obj) => FormatDate(obj.value, "d/k/y"),
    },
    {
      Header: "Số điện thoại",
      accessor: "ComplainPhone",
    },
    {
      Header: "Loại khiếu nại",
      accessor: "ComplainType",
    },
    {
      Header: "Tình trạng xử lý",
      accessor: "ComplainState",
    },
    {
      Header: "Nội dung khiếu nại",
      accessor: "Content",
    },
    {
      Header: "Nội dung xử lý",
      accessor: "Note",
    },
  ];

  const clickRow = (item) => {
    console.log("clickrow", item.row.ComplainCode);
  };
  const clickexcel = () => {
    let dataExcel = CustomerComplainlist.map((item, index) => {
      return {
        "Mã khiếu nại": item.ComplainCode,
        "Người khiếu nại": item.ComplainName,
        "Ngày khiếu nại": FormatDate(item.ComplainDate, "d/k/y"),
        "SDT liên hệ": item.ComplainPhone,
        "Loại khiếu nại": item.ComplainType,
        "Tình trạng xử lý": item.ComplainState,
        "Nội dung khiếu nại": item.Content,
        "Nội dung xử lý": item.Note,
      };
    });
    ExportExcel(dataExcel, "Danh Sách Khiếu nại");
  };

  /* clear data on form when insert success */

  const APIC_spCustomerComplainList_clear = () => {
    setType(0);
    setState(0);
    setCode("");
  };

  return (
    <LayoutMain>
        <div className="container-fluid">
          <div className="row cardcus">
            <div className="col-md-12 HomeTitle">Lịch sử khiếu nại</div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Từ ngày (*)</label>
                <DateTimePicker
                  className="form-control borradius3"
                  onChange={(date) => FromDate(date)}
                  value={fdate}
                  format="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Đến ngày (*)</label>
                <DateTimePicker
                  className="form-control borradius3"
                  onChange={(date) => ToDate(date)}
                  value={tdate}
                  format="dd/MM/yyyy"
                />
              </div>
            </div>

            <div className="col-md-3 margin-top-15">
              <label className="mb0">Loại khiếu nại</label>
              <select
                className="form-control borradius3 height35"
                value={Type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="0">Tất Cả</option>
                <option value="1">Khiếu nại về dịch vụ</option>
                <option value="2">Khiếu nại về cước phí</option>
                <option value="3">Khiếu nại về COD</option>
              </select>
            </div>
            <div className="col-md-3 margin-top-15">
              <label className="mb0">Tình trạng xử lý</label>
              <select
                className="form-control borradius3 height35"
                value={State}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="0">Tất cả</option>
                <option value="1">Chưa xử lý</option>
                <option value="2">Đang xử lý</option>
                <option value="3">Đã xử lý</option>
              </select>
            </div>
            <div className="col-md-12 margin-top-10">
              <div className="form-group">
                <label>Mã vận đơn</label>
                <input
                  type="text"
                  className="form-control borradius3"
                  value={Code}
                  {...binCode}
                  placeholder='Nhập các mã vận đơn cách nhau bằng dấu ","'
                />
              </div>
            </div>
            <div className="col-md-12 mt15 text-center">
              <button
                type="button"
                className="btn text-transform btn-sm btn-save"
                disabled={disable}
                onClick={APIC_spCustomerComplainList}
              >
                <i className="material-icons">search</i>
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={clickexcel}
                className="btn text-transform btn-sm  btn-refesh margin-left-10"
              >
                <img src="../assets/img/iconexcel.png" className="iconex" />
                Xuất Excel
              </button>
            </div>
          </div>
          <div className="row cardcus margin-top-20">
            <div className="col-md-12  table-responsive mt30">
              <DataTable data={CustomerComplainlist} columns={columns} />
            </div>
          </div>
        </div>
    </LayoutMain>
  );
};
