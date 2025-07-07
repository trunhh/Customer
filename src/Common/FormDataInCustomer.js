import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { SelectArea, SelectPost, SelectDepart } from "./";
import { SelectAction } from "../Redux/Actions";
import { FirstOrLastDayinMonth } from '../Utils';
import I18n from '../Language';
const FormDataInCustomerComp = ({
    onListCheck = () => { },//
    CustomerId = 0,
    Type = 0,
    TitleCommon = "CHI TIẾT XUẤT EXCEL"
}) => {

    const [Data, setData] = useState([]);
    const dispatch = useDispatch();

    const CPN_spBKPayment_Customer_CheckIn_List = async () => {

        if (CustomerId === -1) return;
        const list = await mainAction.API_spCallServer(
            "CPN_spBKPayment_Customer_CheckIn_List",
            { CustomerId: CustomerId,Type:Type },
            dispatch
        );
        setData(list)
        onListCheck(list);
    }

    const [State, setState] = useState([]);

    const handleChange = (Id,Key) => {
        debugger
        Data.find(p => p.Id == Id).KeyCheck = Key == true ? false : true;
        setState({ list: Data });
        onListCheck(Data);
    };

    useEffect(() => {
        CPN_spBKPayment_Customer_CheckIn_List()
    }, [CustomerId]);
    
    // onChange={handleCheckAll}

    return (
        <div className="col-md-12">
            <div className="card">
                <h4 class="label card-header" style={{ width: "100%" }}><i class="fab fa-avianex"></i> {TitleCommon}</h4>
                <div class="row col-md-12"
                    style={{ marginTop: "15px", marginLeft: "20px" }}>
                    {
                        Data.map((item, index) => {
                            return (
                                <div key={'vvv' + index} class="inline">
                                    <input type="checkbox" id={item.Name} name={item.Name} value={item.Id}
                                        checked={item.KeyCheck}
                                        onClick={e => handleChange(item.Id,item.KeyCheck)} />
                                    <label for={item.Name} style={{ width: "157px", 'font-size': '12px'}}>{item.Name}</label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export const FormDataInCustomer = React.memo(FormDataInCustomerComp)