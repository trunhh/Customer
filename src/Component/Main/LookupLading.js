import {
  GetCookie,
} from "../../Utils";
import React, {
  useState,
  useEffect,
} from "react";
import {  useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {LadingDetail} from "../../Common";
import LayoutMain from "../../Layout/LayoutMain";

export const LookupLading = (SearchCode) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
  const [LadingCode,setLadingCode]= useState("");

  useEffect(() => {
    if (CustomerID === null)
      history.push("/");

    const pr = new URLSearchParams(location.search);
    if(pr.get("code")!==null)
      setLadingCode(pr.get("code"));
    else 
     setLadingCode("");
  }, []);

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 ">
            <div className="">
              <div className="cardcus">
                <h4 className="HomeTitle margin-left-15">
               Tra cứu vận đơn
                </h4>
              </div>
              <LadingDetail LadingCode={LadingCode} LadingId="0" />
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};
