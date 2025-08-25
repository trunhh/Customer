import React, {useState, useEffect} from 'react';
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";

const SelectOldAddressComp = React.forwardRef(({
    DistrictId = null,
    onSelected = () => { },
    onOldAddressId = 0
}, ref) => {
    const [itemValue, setItemValue] = useState();
    const [listOldAddress, setListOldAddress] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        const getData = async() => {
            const addressList = await mainAction.API_spCallServer(
                "GTEL_spGetMappedLocation",
                [{WardId: DistrictId}],
                dispatch
            );
        
            setListOldAddress(addressList);
        }

        getData();
    }, [DistrictId]);

    useEffect(() => {
        if (onOldAddressId !== 0) {
            setItemValue( onOldAddressId)
        } else {
            setItemValue({ value: -1, label: "Chọn địa chỉ cũ" });
        }

    }, [onOldAddressId]);

    return <Select 
        value={ itemValue }
        onChange={(option) => onSelected(option)} 
        options={listOldAddress}
        isDisabled={DistrictId ? false : true} 
        ref={ref}
        />
});

export const SelectOldAddress = React.memo(SelectOldAddressComp);
