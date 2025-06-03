import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectDistrictComp = React.forwardRef(({
  onSelected = () => { },
  ParentID = 0,
  onActive = 0,
  Disabled = false
}, ref) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState({});
  const [_default, setDefault] = useState({ value: 0, label: "Chọn quận huyện" });
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const onGetLocation = async () => {
    if (ParentID === 0) return;
    const pr = {
      ParentID: ParentID,
      Type: 2,
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
      let option = { value: element.LocationId, label: element.Name, code:element.LocationCode };
      dataOptions.push(option);
    });
    setData(dataOptions);
    if (onActive !== 0) {
      let dataActive = dataOptions.find(a => a.value === onActive);
      setValueS(dataActive);
    } else  setValueS(_default);
  };

  useEffect(() => {
    onGetLocation();
  }, [onActive,ParentID]);

  return <Select value={valueS} onChange={onSelecteItem} options={data} ref={ref} isDisabled={Disabled} />;
});

export const SelectDistrict = React.memo(SelectDistrictComp);
