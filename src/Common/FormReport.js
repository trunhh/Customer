import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
const FormReportComp = ({
    isVisible = false,
    setIsVisible = () => { },
    onFromDate = () => { },
    onToDate = () => { },
    onClickDate = () => { },
    title = '',
}) => {


    const [fdate, onFdate] = useState(new Date());
    const FromDate = (item) => {
        onFromDate({fromDate:item});
        onFdate(item);
    }
    
    const [tdate, onTdate] = useState(new Date());
    const ToDate = (item) => {
        onToDate({toDate:item});
        onTdate(item);
    }

    const ClickDate = () => {
        onClickDate();
    }

    useEffect(() => {
       
    }, []);
    
    return (

        
        <div className="col-md-12">
            <div className="card-header card-header-primary">
                 <h4 className="card-title">{title}</h4>
            </div>
        <div className="card">
            <div className="card-body">
                
                <form>
                    <div className="row">
                        <div className="col-md-6">
                           <div className="col-md-6">
                                <label className="control-label">Từ ngày(dd/MM/yy)</label>
                           </div>
                           <div className="col-md-8">
                            <div className="form-group bmd-form-group">
                                <DateTimePicker
                                    onChange={date => FromDate(date)}
                                    value={fdate}
                                />
                                </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="col-md-6">
                                <label className="control-label">Đến ngày(dd/MM/yy)</label>
                           </div>
                           <div className="col-md-8">
                            <div className="form-group bmd-form-group">
                                <DateTimePicker
                                    onChange={date => ToDate(date)}
                                    value={tdate}
                                />
                                </div>
                           </div>
                        </div>
                    </div>
                        <div className="card-body">
                            <button onClick={ClickDate} type="button" className="btn btn-danger pull-right">
                            <i className="material-icons">edit</i>
                            Xác nhận?
                            </button>
                            <button  type="submit" className="btn btn-default pull-right">
                            <i className="material-icons">undo</i>
                            Hủy
                            </button>
                        </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        </div>
    </div>

    )
}


export const FormReport = React.memo(FormReportComp)