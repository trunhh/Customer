import React from 'react'
import { useSelector } from 'react-redux'
import {Img} from 'react-image'
const LoadingAlertTemp = ({
    isVisible = false
}) => {
    const IsLoading = useSelector((state) => state.MainAction.IsLoading)
    console.log(IsLoading);
    if(IsLoading)
    {
        return (
            <div className="notification-container">
                <div>
                    <div className="notification notification-warning">
                        <div className="notification-message" role="alert">
                            <div className="message">
                            <Img src="../../assets/img/loading.gif" width="30" height="30" />
                                Đang xử lý...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (<div></div>)
}

export const LoadingAlert = React.memo(LoadingAlertTemp)