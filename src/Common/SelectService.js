import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectServiceComp = React.forwardRef(({
  onSelected = () => { },
  onActive = 0,
}, ref) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState(onActive);
  const [_default, setDefault] = useState({ value: 33, label: "Chuyển phát nhanh" });
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  useEffect(() => {
    APIC_spServiceGetMany();
  }, []);

  useEffect(() => {
    if (onActive !== 0) {
      APIC_spServiceGetMany();
    }
    else {
      setValueS(_default);
    }
  }, [onActive]);

  const APIC_spServiceGetMany = async () => {
    const list = await mainAction.API_spCallServer(
        "APIC_spService_List",
        {
        Type: 0,
      },
        dispatch
    );
    let dataOptions = [], IsActive = 0;
    dataOptions.push({ value: 0, label: "Chọn dịch vụ" });
    if (onActive === 0) setValueS(_default);
    list.forEach((element, index) => {
      let option = { value: element.ServiceID, label: element.ServiceName, code: element.ServiceCode };
      dataOptions.push(option);
      if (element.ServiceID === onActive)
        IsActive = 1
    });
    setData(dataOptions);
    if (IsActive === 1) {
      let dataActive = dataOptions.find(a => a.value === onActive);
      setValueS(dataActive);
    }
  };

  return <Select value={valueS} onChange={onSelecteItem} options={data} ref={ref} />;
});

export const SelectService = React.memo(SelectServiceComp);
