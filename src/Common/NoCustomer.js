import React, { useEffect, useState } from "react";
import Select from "react-select";

const NoCustomerComp = React.forwardRef(() => {
    return (
        <>
            <div className="container-fluid">
                <div className="row Formlading">
                    <div className="col-md-12 text-center">
                        <h3>Vui lòng chọn mã khách hàng như hình bên dưới để sử dụng chức năng này !</h3>
                        <img style={{ width: "80%" }} src="/assets/img/choosecustomer.png" />
                    </div>
                </div>
            </div>
        </>
    );
});

export const NoCustomer = React.memo(NoCustomerComp);
