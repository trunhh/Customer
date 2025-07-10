import React, { useEffect, useState } from "react";
import Select from "react-select";
import { mainAction } from '../Redux/Actions';
import { useDispatch } from 'react-redux';
import { Alerterror } from '../Utils';

const SelectCityComp = React.forwardRef(({
  Disabled = false,
  onSelected = () => { },
  onActive = 0
}, ref) => {

  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState({});
  const [_default, setDefault] = useState({ value: 0, label: "Chọn tỉnh thành" });
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };
  const CPN_spCity_Local = async () => {
    try {
        const listState = await mainAction.API_spCallServer(
            'CPN_spCity_Local',
            null,
            dispatch
        );
    /*
    const listState = [
        { value: 0, label: I18n.t('System.Select') },
        { value: 12888, label: 'Hà Nội' },
        { value: 12889, label: 'Cao Bằng' },
        { value: 12890, label: 'Tuyên Quang' },
        { value: 12891, label: 'Điện Biên' },
        { value: 12892, label: 'Lai Châu' },
        { value: 12893, label: 'Sơn La' },
        { value: 12894, label: 'Lào Cai' },
        { value: 12895, label: 'Thái Nguyên' },
        { value: 12896, label: 'Lạng Sơn' },
        { value: 12897, label: 'Quảng Ninh' },
        { value: 12898, label: 'Bắc Ninh' },
        { value: 12899, label: 'Phú Thọ' },
        { value: 12900, label: 'Hải Phòng' },
        { value: 12901, label: 'Hưng Yên' },
        { value: 12902, label: 'Ninh Bình' },
        { value: 12903, label: 'Thanh Hóa' },
        { value: 12904, label: 'Nghệ An' },
        { value: 12905, label: 'Hà Tĩnh' },
        { value: 12906, label: 'Quảng Trị' },
        { value: 12907, label: 'Huế' },
        { value: 12908, label: 'Đà Nẵng' },
        { value: 12909, label: 'Quảng Ngãi' },
        { value: 12910, label: 'Gia Lai' },
        { value: 12911, label: 'Khánh Hòa' },
        { value: 12912, label: 'Đắk Lắk' },
        { value: 12913, label: 'Lâm Đồng' },
        { value: 12914, label: 'Đồng Nai' },
        { value: 12915, label: 'Hồ Chí Minh' },
        { value: 12916, label: 'Tây Ninh' },
        { value: 12917, label: 'Đồng Tháp' },
        { value: 12918, label: 'Vĩnh Long' },
        { value: 12919, label: 'An Giang' },
        { value: 12920, label: 'Cần Thơ' },
        { value: 12921, label: 'Cà Mau' }
    ];
    */
        console.log("listState", listState);
        setData(listState)
        setFilteredData(listState.filter(a => !a.disabled))
        console.log("filter", filteredData);
        setValueS({ value: 0, label: "Chọn tỉnh thành"  })
    }
    catch (error) {
        Alerterror("Error on fetching city !");
    }
  }

  useEffect(() => {
    CPN_spCity_Local();
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

  return (
    <Select
      isDisabled={Disabled}
      value={valueS}
      onChange={onSelecteItem}
      options={filteredData}
      ref={ref}
    />
  );
});

export const SelectCity = React.memo(SelectCityComp);
