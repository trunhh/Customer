import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectCityComp = React.forwardRef(({
  Disabled = false,
  onSelected = () => { },
  onActive = 0
}, ref) => {

  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState({});
  const [_default, setDefault] = useState({ value: 0, label: "Chọn tỉnh thành" });

  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };
  const getListCityFromLocal = async () => {
    const listState = [
      { value: 0, label: "Chọn tỉnh thành" },
      { value: 1, label: "Hà Nội" },
      { value: 32, label: "Đà Nẵng" },
      { value: 50, label: "Hồ Chí Minh" },
      { value: 47, label: "Bình Dương" },
      { value: 59, label: "Cần Thơ" },
      { value: 2, label: "Hà Giang" },
      { value: 3, label: "Cao Bằng" },
      { value: 4, label: "Bắc Kạn" },
      { value: 5, label: "Tuyên Quang" },
      { value: 6, label: "Lào Cai" },
      { value: 7, label: "Điện Biên" },
      { value: 8, label: "Lai Châu" },
      { value: 9, label: "Sơn La" },
      { value: 10, label: "Yên Bái" },
      { value: 11, label: "Hòa Bình" },
      { value: 12, label: "Thái Nguyên" },
      { value: 13, label: "Lạng Sơn" },
      { value: 14, label: "Quảng Ninh" },
      { value: 15, label: "Bắc Giang" },
      { value: 16, label: "Phú Thọ" },
      { value: 17, label: "Vĩnh Phúc" },
      { value: 18, label: "Bắc Ninh" },
      { value: 19, label: "Hải Dương" },
      { value: 20, label: "Hải Phòng" },
      { value: 21, label: "Hưng Yên" },
      { value: 22, label: "Thái Bình" },
      { value: 23, label: "Hà Nam" },
      { value: 24, label: "Nam Định" },
      { value: 25, label: "Ninh Bình" },
      { value: 26, label: "Thanh Hóa" },
      { value: 27, label: "Nghệ An" },
      { value: 28, label: "Hà Tĩnh" },
      { value: 29, label: "Quảng Bình" },
      { value: 30, label: "Quảng Trị" },
      { value: 31, label: "Huế" },
      { value: 33, label: "Quảng Nam" },
      { value: 34, label: "Quảng Ngãi" },
      { value: 35, label: "Bình Định" },
      { value: 36, label: "Phú Yên" },
      { value: 37, label: "Khánh Hòa" },
      { value: 38, label: "Ninh Thuận" },
      { value: 39, label: "Bình Thuận" },
      { value: 40, label: "Kon Tum" },
      { value: 41, label: "Gia Lai" },
      { value: 42, label: "Đắk Lắk" },
      { value: 43, label: "Đắk Nông" },
      { value: 44, label: "Lâm Đồng" },
      { value: 45, label: "Bình Phước" },
      { value: 46, label: "Tây Ninh" },
      { value: 48, label: "Đồng Nai" },
      { value: 49, label: "Vũng Tàu" },
      { value: 51, label: "Long An" },
      { value: 52, label: "Tiền Giang" },
      { value: 53, label: "Bến Tre" },
      { value: 54, label: "Trà Vinh" },
      { value: 55, label: "Vĩnh Long" },
      { value: 56, label: "Đồng Tháp" },
      { value: 57, label: "An Giang" },
      { value: 58, label: "Kiên Giang" },
      { value: 60, label: "Hậu Giang" },
      { value: 61, label: "Sóc Trăng" },
      { value: 62, label: "Bạc Liêu" },
      { value: 63, label: "Cà Mau" },
    ];
    setData(listState);
    if (onActive !== 0) {
      let dataActive = listState.find(a => a.value === onActive);
      setValueS(dataActive);
    }
    else {
      setValueS(_default);
    }
  };

  useEffect(() => {
    getListCityFromLocal();
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
      options={data}
      ref={ref}
    />
  );
});

export const SelectCity = React.memo(SelectCityComp);
