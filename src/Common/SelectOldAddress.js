import React, {useState, useEffect} from 'react';
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";

const SelectOldAddressComp = React.forwardRef(({
    DistrictId = null,
    onSelected = () => { },
    onOldAddressId = 0,
    Disabled = false
}, ref) => {
    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState({});
    const [_default, setDefault] = useState({ value: 0, label: "Chọn địa chỉ cũ" });
    const onSelecteItem = (item) => {
      onSelected(item);
      setValueS(item);
    };

    const dispatch = useDispatch();


    const onGetLocation = async () => {
      if (DistrictId === 0) return;
      const list = await mainAction.API_spCallServer(
          "GTEL_spGetMappedLocation",
          [{WardId: DistrictId}],
          dispatch
      );

      let dataOptions = [];
      dataOptions.push(_default);
      dataOptions.push(...list);
      setData(dataOptions);
      if (onOldAddressId !== 0) {
        let dataActive = dataOptions.find(a => a.value === onOldAddressId);
        setValueS(dataActive);
      } else  setValueS(_default);
    };

    useEffect(() => {
      onGetLocation();
    }, [onOldAddressId,DistrictId]);

    return <Select 
            value={valueS} 
            onChange={onSelecteItem}
            options={data}
            ref={ref}
            isDisabled={Disabled}
        />;
});

export const SelectOldAddress = React.memo(SelectOldAddressComp);
