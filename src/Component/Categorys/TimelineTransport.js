import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../Redux/Actions";
import {
  ExportExcel,
  Alertwarning,
  GetCookie,
} from "../../Utils";
import { SelectService, SelectCity } from "../../Common";
import { useHistory } from "react-router-dom";
import { DataTable } from "../../Common/DataTable";
import { APIKey } from "../../Services/Api";
import LayoutMain from "../../Layout/LayoutMain";

export const TimelineTransport = () => {
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false); // disable button;
  const history = useHistory();
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [ServiceMeno, setServiceMeno] = useState(33);
  const [CityMeno, setCityMeno] = useState(0);
  const [Data, setData] = useState([]);

  const [ShowTable, setShowTable] = useState("display-none");

  /* run after render */
  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE

    if (CustomerID === null)
      history.push("/");
    _Init();
  }, []);

  const _Init = async () => {
    setDisable(false);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  /* get list TimelineTransportList */

  const APIC_spTimelineTransport = async () => {
    debugger;
    if (CityMeno === 0) {
      Alertwarning("Vui lòng Chọn tỉnh đi");
      return;
    } else if (ServiceMeno === 0) {
      Alertwarning("Vui lòng Chọn dịch vụ");
      return;
    }
    setDisable(true);
    try {
      let params = {
        CustomerId: CustomerID,
        ServiceId: ServiceMeno,
        IDGo_Province: CityMeno,
      };
      debugger;
      let pr = {
        Json: JSON.stringify(params),
        func: "APIC_spTimelineTransport",
        API_key: APIKey,
        TokenDevices: "website",
      };
      const data = await mainAction.API_spCallServer(pr, dispatch);
      setData(data);
      setShowTable("");
    } catch (err) {
      Alertwarning("Vui lòng liên hệ CSKH để biết thêm thông tin !");
      console.log("Eror", err);
    }
    setDisable(false);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const columns = [
    {
      Header: "Tỉnh đi",
      accessor: "NameProvinceGo",
    },
    {
      Header: "Tỉnh đến",
      accessor: "NameToProvince",
      //Cell: obj => (<span className='btn btn-success'>{obj.value}</span>)
    },
    {
      Header: "Dịch vụ",
      accessor: "ServiceName",
    },
    {
      Header: "Thời gian",
      accessor: "Hours",
      Cell: (obj) => (
        <span>
          {obj.value === 0
            ? "Liên hệ bộ phận CSKH để biết thêm thông tin"
            : obj.value + " giờ"}
        </span>
      ),
    },
  ];

  const Excell = () => {
    let arr = [];
    arr.push({
      NameProvinceGo: "Tỉnh đi",
      NameToProvince: "Tỉnh đến",
      ServiceName: "Dịch vụ",
      Hours: "Thời gian",
    });
    Data.map((item, index) => {
      arr.push(item);
    });
    ExportExcel(arr, "Thời gian toàn trình phát theo dịch vụ");
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row Formlading ">
          <div className="col-md-12 margin-top-20 HomeTitle">Toàn trình phát theo bưu cục</div>
          <div className="col-md-6 margin-top-20 margin-bottom-20">
            <div className="row">
              <label className="margin-left-15">
                Tỉnh đi{" "}
                <span className="red">(*)</span>
              </label>
              <div className="col-md-12">
                <SelectCity
                  onActive={CityMeno}
                  onSelected={(item) => {
                    setCityMeno(item.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 margin-top-20 margin-bottom-20">
            <div className="row">
              <label className="margin-left-15">
                Dịch vụ{" "}
                <span className="red">(*)</span>
              </label>
              <div className="col-md-12">
                <SelectService
                  onActive={ServiceMeno}
                  onSelected={(item) => {
                    setServiceMeno(item.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="clearfix"></div>

        </div>
        <div className="col-md-12  margin-top-10 text-center">
          <button
            type="button"
            disabled={disable}
            className="btn btn-save text-transform btn-sm"
            onClick={APIC_spTimelineTransport}
          >
            <i className="material-icons">search</i>
            Tìm kiếm
          </button>
          <button
            type="button"
            className={ShowTable + " btn text-transform btn-refesh btn-sm"}
            onClick={() => {
              Excell();
            }}
          >
            <img src="../assets/img/iconexcel.png" className='iconex' />
            Xuất Excel
          </button>
        </div>
        <div className={ShowTable + " table-responsive Formlading col-md-12 mt10"} style={{padding:'5px'}}>
            <DataTable data={Data} columns={columns} />
          </div>
      </div>
    </LayoutMain>
  );
};
