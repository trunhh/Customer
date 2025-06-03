import React, { useState, useEffect, useRef } from "react";
import {  useDispatch } from "react-redux";
import DateTimePicker from "react-datetime-picker";
import {
  SelectCity,
  FormReport,
  SelectDistrict,
  SelectWard,
} from "../../Common";
import {
  Alertsuccess,
  Alerterror,
  PaginationTable,
  ScrollTop,
  getData,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { TestAction } from "../../Redux/Actions/System";
import { Location } from "../../Redux/Actions/Category";
import { useInput } from "../../Hooks";

/* Load CSS */

export const Test = () => {
  const dispatch = useDispatch();
  const [IsAcctive, setIsAcctive] = useState(0);
  const [IsLoad, setIsLoad] = useState(false); // active input form when click button edit
  const [IsLoadDistrict, setIsLoadDistrict] = useState(false);

  /* run after render as document.ready */
  useEffect(() => {
    console.log("call useEffect");
    MB_spOfficer_Get();

    let a = getData("demo");
    console.log(a);
  }, []);

  /* get and set parameter from form and sub common */
  const [city, setCity] = useState(0);
  const [chooseProvince, setChooseProvince] = useState(0);
  const [disable, setDisable] = useState(false); // disable button

  /* Chose item from select common */
  const onChooseProvince = (item) => {
    onUpdateCityID(item);
    console.log(item);
  };
  const onChooseDistrict = (item) => {
    Location.updateDistrictID(item.value, dispatch);
    IsLoadDistrict === false
      ? setIsLoadDistrict(true)
      : setIsLoadDistrict(false);
  };

  const onUpdateCityID = (item) => {
    Location.updateCityID(item.value, dispatch);
    IsLoad === false ? setIsLoad(true) : setIsLoad(false);
    console.log(item);
  };

  const onSelectWard = (item) => {
    console.log(item);
  };

  /* Save Officer  */
  const [OfficerID, setOfficerID] = useState(0);
  //const [OfficerName, setOfficerName] = useState('');
  //const [OfficerCode, setOfficerCode] = useState('');
  const [Email, setEmail] = useState("");
  const [Birthday, onBirthday] = useState(new Date());
  const [Number, setNumber] = useState(0);

  const [OfficerCode, bindOfficerCode, setOfficerCode] = useInput("");

  const [OfficerName, bindOfficerName, setOfficerName] = useInput("");

  const OfficerCodeRef = useRef();
  const OfficerNameRef = useRef();
  const MB_spOfficer_Save = async () => {
    debugger;
    let params = {
      OfficerID: OfficerID,
      OfficerName: OfficerName,
      OfficerCode: OfficerCode,
      Email: Email,
      Birthday: Birthday,
      Number: Number,
    };

    console.log(params);

    /* validation input form */

    if (OfficerCode === "") {
      Alerterror("Nhập mã nhân viên");
      OfficerCodeRef.current.focus();
      return;
    }
    if (OfficerName === "") {
      Alerterror("Nhập tên nhân viên");
      OfficerNameRef.current.focus();
      return;
    }

    try {
      setDisable(true); // disable button
      // call redux saga
      const data = await TestAction.MB_spOfficer_Save(params, dispatch);
      Alertsuccess(data);
      MB_spOfficer_Clear();
    } catch (err) {
      Alerterror("Lỗi liên hệ IT NETCO");
      console.log("Eror", err);
    }
  };

  /* clear data on form when insert success */

  const MB_spOfficer_Clear = () => {
    setOfficerID(0);
    setOfficerName("");
    setOfficerCode("");
    setEmail("");
    ScrollTop();
  };

  /* get list Officer */
  const [ListOfficer, setListOfficer] = useState([]);

  const MB_spOfficer_Get = async () => {
    let params = {
      OfficerID: 0,
    };

    const data = await TestAction.MB_spOfficer_Get(params, dispatch);
    ListOfficer(data);
    console.log(data);
    PaginationTable();
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const MB_spOfficer_show = (item) => {
    console.log(item);
    setOfficerID(item.OfficerID);
    setOfficerName(item.OfficerName);
    setOfficerCode(item.OfficerCode);
    setEmail(item.Email);
    ScrollTop();
    setIsAcctive(1);
  };

  /* get parameter from chile component */
  const onFromDate = (item) => {
    console.log(item);
  };

  const onToDate = (item) => {
    console.log(item);
  };

  const onClickDate = () => {
    alert(11111111);
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header card-header-primary">
                <h4 className="card-title">Điền thông tin lấy hàng</h4>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-md-3">
                          <label className="bmd-label-floating margin-top-20-percent">
                            Ngày :
                          </label>
                        </div>
                        <div className="col-md-9">
                          <div className="form-group bmd-form-group">
                            <DateTimePicker
                              onChange={onBirthday}
                              value={Birthday}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-md-4">
                          <label className="bmd-label-floating margin-top-20-percent">
                            Tỉnh thành :
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="form-group bmd-form-group">
                            <SelectCity
                              onSelected={(item) => {
                                onChooseProvince(item);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-md-4">
                          <label
                            className="bmd-label-floating"
                            style={{ marginTop: "20%" }}
                          >
                            Quận:
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="form-group bmd-form-group">
                            <SelectDistrict
                              IsLoad={IsLoad}
                              onSelected={(item) => {
                                onChooseDistrict(item);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-md-4">
                          <label
                            className="bmd-label-floating"
                            style={{ marginTop: "20%" }}
                          >
                            Phường:
                          </label>
                        </div>
                        <div className="col-md-8">
                          <div className="form-group bmd-form-group">
                            <SelectWard
                              IsLoad={IsLoadDistrict}
                              onSelected={(item) => {
                                onSelectWard(item);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div
                        className={
                          IsAcctive === 1
                            ? "form-group bmd-form-group is-focused"
                            : "form-group bmd-form-group"
                        }
                      >
                        <label className="bmd-label-floating">
                          Mã nhân viên
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          ref={OfficerCodeRef}
                          value={OfficerCode}
                          {...bindOfficerCode}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className={
                          IsAcctive === 1
                            ? "form-group bmd-form-group is-focused"
                            : "form-group bmd-form-group"
                        }
                      >
                        <label className="bmd-label-floating">
                          Tên nhân viên
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          ref={OfficerNameRef}
                          value={OfficerName}
                          {...bindOfficerName}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group bmd-form-group">
                        <label className="bmd-label-floating">Email</label>
                        <input
                          type="text"
                          className="form-control"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Ghi chú</label>
                        <div className="form-group bmd-form-group">
                          <label className="bmd-label-floating">
                            {" "}
                            Muốn gì thì ghi vào đây :T
                          </label>
                          <textarea
                            className="form-control"
                            rows="5"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger pull-right"
                    disabled={disable}
                    onClick={MB_spOfficer_Save}
                  >
                    <i className="material-icons">edit</i>
                    Xác nhận?
                  </button>
                  <button
                    type="button"
                    className="btn btn-default pull-right"
                    disabled={disable}
                    onClick={MB_spOfficer_Clear}
                  >
                    <i className="material-icons">undo</i>
                    Hủy
                  </button>

                  <div className="clearfix"></div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <FormReport
            onFromDate={(item) => {
              onFromDate(item);
            }}
            onToDate={(item) => {
              onToDate(item);
            }}
            onClickDate={() => {
              onClickDate();
            }}
            title="Chọn điều kiện nhân viên"
          />
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header card-header-primary">
                <h4 className="card-title ">Danh sách nhân viên</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table id="dataTable" className="table">
                    <thead className=" text-primary">
                      <tr>
                        <th>STT</th>
                        <th>Mã nhân viên</th>
                        <th>Tên nhân viên</th>
                        <th>Email</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ListOfficer.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.OfficerID} </td>
                            <td>{item.OfficerName}</td>
                            <td>{item.PostOfficeId}</td>
                            <td>{item.NameMail}</td>
                            <td>
                              <button
                                disabled={disable}
                                onClick={() => MB_spOfficer_show(item)}
                                type="button"
                                className="btn btn-danger btn-small pull-right"
                              >
                                <i className="material-icons">edit</i>
                                Edit
                              </button>
                            </td>
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
  );
};
