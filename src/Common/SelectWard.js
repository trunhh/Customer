import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Location } from "../Redux/Actions/Category";
import { APIKeyOld } from "../Services/Api";
import { mainAction } from "../Redux/Actions";
const SelectWardComp = React.forwardRef(({
  onSelected = () => { },
  onActive = 0,
  ParentID = 0,
  Disabled = false
}, ref) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState({});
  const [_default, setDefault] = useState({ value: 0, label: "Chọn phường xã" });
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const onGetLocation = async () => {
    if (ParentID === 0) return;
    const pr = {
      ParentID: ParentID,
      Type: 3,
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "CPN_spLocation_GET",
    };
    // call redux saga
    const list = await mainAction.API_spCallServer(params, dispatch);

    let dataOptions = [], IsActive = 0;
    dataOptions.push(_default);
    list.forEach((element, index) => {
      let option = { value: element.LocationId, label: element.Name, code:element.Code_Local };
      dataOptions.push(option);
    });
    setData(dataOptions);
    if (onActive !== 0) {
      let dataActive = dataOptions.find(a => a.value === onActive);
      setValueS(dataActive);
    }else setValueS(_default);
  };

  useEffect(() => {
    onGetLocation();
  }, [onActive,ParentID]);
  return <Select value={valueS} onChange={onSelecteItem} options={data} isDisabled={Disabled} ref={ref} />;
});

export const SelectWard = React.memo(SelectWardComp);
