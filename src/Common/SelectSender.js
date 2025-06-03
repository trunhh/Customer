import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { DecodeString, GetCookie } from "../Utils";
import { mainAction } from "../Redux/Actions";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { APIKey, TOKEN_DEVICE } from "../Services/Api";

const SelectSenderComp = React.forwardRef(({
  onSelected = () => { },
  onActive = 0,
  onLoad = 0, //reload select box
  defaultLabel=""
}, ref) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState(0);
  const [Customer, setCustomer] = useState(GetCookie("All"));
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [_default, setDefault] = useState({
    value: 0,
    label: defaultLabel===""?(Customer?.CustomerName + " - " + Customer?.Phone + " - " + Customer?.Address + ", "+ Customer?.WardName + ", "+ Customer?.DistrictName + ", "+ Customer?.CityName):defaultLabel,
    obj: {
      CityId: Customer?.City,
      DistrictiId: Customer?.District,
      WarId: Customer?.Ward,
      Code_Local: Customer?.Code_Local,
      CityName: Customer?.CityName,
      DistrictyName: Customer?.DistrictName,
      WarName: Customer?.WardName,
      NameSend: Customer?.CustomerName,
      PhoneSend: Customer?.Phone,
      AddressFull: Customer?.Address  + ", " + Customer?.WardName + ", "+ Customer?.DistrictName + ", "+ Customer?.CityName,
      Street_Number: Customer?.Address,
      State: 0
    }
  });

  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  useEffect(() => {
    //GET CUSTOMER INFO FROM COOKIE
    if (CustomerID === null) {
      history.push("/");
    }
    onGetCustomerSenderAddress();
  }, []);

  useEffect(() => {
    if (onActive !== 0) {
      let _dataActive = data.find((p) => p.value === onActive);
      setValueS(_dataActive);
    }
    else {
      setValueS(_default);
    }
  }, [onActive]);

  useEffect(() => {
    if(onLoad===1)
    {
      onGetCustomerSenderAddress();
      onLoad=0;
    }
  }, [onLoad]);

  useEffect(() => {
    let a = _default;
    a.label = defaultLabel;
    setDefault(a);
    onGetCustomerSenderAddress();
    setValueS(_default);
  }, [defaultLabel]);

  const onGetCustomerSenderAddress = async () => {
    //let arr = DecodeString(cookies.customerLogin).split("|");
    const params = {
      Json: '{"CustomerId":' + Customer?.CustomerID + '}',
      func: "APIC_spCustomerSenderAddressList",
    };
    // call redux saga
    const list = await mainAction.API_spCallServer(params, dispatch);
    let dataOptions = [], IsActive = 0;
    dataOptions.push(_default);
    if (onActive === 0) setValueS(_default);
    list.forEach((element, index) => {
      let option = {
        value: element.CustomerAddressSenderId,
        label: element.NameSend + " - " + element.PhoneSend + " - " + element.AddressFull,
        obj: element,
      };
      index === 0 ? setValueS(option) : setValueS(null);
      dataOptions.push(option);
    });
    setData(dataOptions);
    //if (IsActive === 1) {
      let dataActive = dataOptions.find(a => a.value === onActive);
      setValueS(dataActive);
    //}
  };

  return <Select value={valueS} onChange={onSelecteItem} options={data} ref={ref} />;
});

export const SelectSender = React.memo(SelectSenderComp);
