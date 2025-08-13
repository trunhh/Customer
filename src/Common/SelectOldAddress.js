import React, {useState, useEffect} from 'react';
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";

const SelectOldAddressComp = React.forwardRef(({
    DistrictTo = null,
    RecipientStreet = null,
    onSelected = () => { },
}, ref) => {
    const [itemValue, setItemValue] = useState();
    const [listOldAddress, setListOldAddress] = useState();

    const dispatch = useDispatch();

    const setValue = (item) => {
        setItemValue(item);
        onSelected(item);
    }

    useEffect(() => {
        const getData = async() => {
            const addressList = await mainAction.API_spCallServer(
                "GTEL_spGetMappedLocation",
                [{Code: DistrictTo}],
                dispatch
            );
        
            if(RecipientStreet){
                const addressWS = addressList.map(addr => ({
                    value: addr.value,
                    label: RecipientStreet + ", " + addr.label
                }));
                setListOldAddress(addressWS);
            }
            else{
                setListOldAddress(addressList);
            }
        }

        getData();
    }, [DistrictTo, RecipientStreet]);

    return <Select value={ itemValue || { value: -1, label: "Chọn địa chỉ cũ" }} onChange={(option) => setValue(option)} 
        options={listOldAddress} isDisabled={DistrictTo ? false : true} />
});

export const SelectOldAddress = React.memo(SelectOldAddressComp);
