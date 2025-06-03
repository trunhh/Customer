import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { DecodeString, GetCookie } from "../Utils";
import { mainAction } from "../Redux/Actions";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { APIKey, TOKEN_DEVICE } from "../Services/Api";

const SelectRecipientComp = React.forwardRef(({
  onSelected = () => { },
  onActive = 0,
  onLoad = 0, //reload select box
  defaultLabel = {}
}, ref) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState(0);
  const [_default, setDefault] = useState({
    value: 0,
    label: "Chọn địa chỉ",
    obj: {
      Name: "",
      Phone: "",
      CityId: 0,
      City: "Chọn tỉnh thành",
      DistrictId: 0,
      District: "Chọn quận huyện",
      WardId: 0,
      Ward: "Chọn phường xã",
      Street: "",
      Address: "",
      Company: "",
      Lat:0,
      Lng:0
    }
  });

  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  useEffect(() => {
    onGetData();
  }, []);

  useEffect(() => {
    if (data.length === 0)
      onGetData();
    if (onActive !== 0) {
      let _dataActive = data.find((p) => p.value === onActive);
      setValueS(_dataActive);
    }
    else {
      setValueS(_default);
    }
  }, [onActive]);

  useEffect(() => {
    if (onLoad === 1) {
      onGetData();
      onLoad = 0;
    }
  }, [onLoad]);

  const onGetData = async () => {
    const params = {
      Json: '{"CustomerId":' + CustomerID + '}',
      func: "APIC_spCustomerRecipientLoad",
    };

    // call redux saga
    const list = await mainAction.API_spCallServer(params, dispatch);
    let dataOptions = [], IsActive = 0;
    dataOptions.push(_default);
    if (onActive === 0) setValueS(_default);
    list.forEach((element, index) => {
      let option = {
        value: element.Id,
        label: element.Name + " - " + element.Phone + " - " + element.Address,
        obj: element,
      };
      dataOptions.push(option);
      if(element.Id===onActive)
        IsActive=1;
    });
    setData(dataOptions);
    if (IsActive === 1) {
      let dataActive = dataOptions.find(a => a.value === onActive);
      setValueS(dataActive);
    } else setValueS(_default);
  };

  return <Select value={valueS} onChange={onSelecteItem} options={data} ref={ref} />;
});

export const SelectRecipient = React.memo(SelectRecipientComp);
