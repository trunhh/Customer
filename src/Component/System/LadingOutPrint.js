import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import {
    FormatMoney,
    FormatNumber,
    FormatDateJson,
    GetCookie,
} from "../../Utils";
import Barcode from "react-barcode";
import LayoutLogin from "../../Layout/LayoutLogin";

export const LadingOutPrint = (SearchCode) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
    const [LadingCode, setLadingCode] = useState("");

    useEffect(() => {
        const pr = new URLSearchParams(location.search);
        if (pr.get("code") !== null) {
            APIC_spLadingGetDataPrint(pr.get("code"));
        }
    }, []);

    const [pageprint, setpageprint] = useState([0, 1]);
    const [HtmlPrint, setHtmlPrint] = useState(null);
    const [item, setItemPrint] = useState({});


    const GetPrintMask = (form, PayType, COD) => {
        if (form === "A5") {
            if (PayType === 1 && COD > 0)
                return (
                    <div style={{ position: "absolute", zIndex: 10, opacity: 0.4, marginTop: "35vh", marginLeft: "20vw", fontSize: "120px", fontWeight: 600, transform: "rotate(70deg)", fontFamily: "Arial" }}>COD-TTĐN</div>
                )
            else if (PayType !== 1 && COD > 0)
                return (
                    <div style={{ position: "absolute", zIndex: 10, opacity: 0.4, marginTop: "35vh", marginLeft: "30vw", fontSize: "120px", fontWeight: 600, transform: "rotate(60deg)", fontFamily: "Arial" }}>COD</div>
                )
            else if (PayType === 1 && COD === 0)
                return (
                    <div style={{ position: "absolute", zIndex: 10, opacity: 0.4, marginTop: "35vh", marginLeft: "30vw", fontSize: "120px", fontWeight: 600, transform: "rotate(60deg)", fontFamily: "Arial" }}>TTĐN</div>
                )
            else return (<></>)
        }
        else if (form === "A6") {
            if (PayType === 1 && COD > 0)
                return (
                    <div style={{ position: "absolute", zIndex: 10, opacity: 0.25, marginTop: "32vh", fontSize: "80px", fontWeight: 600, transform: "rotate(-40deg)", fontFamily: "Arial" }}>COD-TTĐN</div>
                )
            else if (PayType !== 1 && COD > 0)
                return (
                    <div style={{ position: "absolute", zIndex: 10, opacity: 0.25, marginTop: "26vh", marginLeft: "15vw", fontSize: "103px", fontWeight: 600, transform: "rotate(-38deg)", fontFamily: "Arial" }}>COD</div>
                )
            else if (PayType === 1 && COD === 0)
                return (
                    <div style={{ position: "absolute", zIndex: 10, opacity: 0.25, marginTop: "28vh", marginLeft: "10vw", fontSize: "100px", fontWeight: 600, transform: "rotate(-40deg)", fontFamily: "Arial" }}>TTĐN</div>
                )
            else return (<></>)
        }
    }

    const APIC_spLadingGetDataPrint = async (code) => {
        try {
            //Lấy thông tin vận đơn
            let pr = {
                Json: "{\"Code\":\"" + code + "\"}",
                func: "APIC_spLading_Find",
                TokenDevices: TOKEN_DEVICE,
            };
            const data = await mainAction.API_spCallServer(pr, dispatch);
            setItemPrint(data.Detail[0]);
            //#region Khởi tạo form in
            /* let html = $("#barcodeTarget").html();
            html += `<script type="text/javascript">window.focus();setTimeout(function(){window.print();window.close();},1000);</script>`;
            var myWindow = window.open("", "_blank");
            myWindow.document.write(
                '<html><head></head><body style="margin:0">' + html + "</body></html>"
            ); */
            //#endregion Khởi tạo form in
        } catch (err) {
            console.log("Eror", err);
        }
    };

    return (
        <LayoutLogin>
        <>
            <div id="printarea" style={{
                display: "block", backgroundColor: "#fff", fontSize: "14px",
                lineHeight: "15px",
                fontFamily: "TimeNewRoman",
                color: "#000",
                pageBreakBefore: "emptystring",
                fontWeight: 400
            }}>
                <div className="bill" style={{ width: "710px", height: "1045px", border: "2px solid #000" }} >
                    {GetPrintMask("A5", item.PaymentType, item.COD)}
                    <table style={{ width: "100%", fontWeight: "600", borderBottom: "2px solid #ddd", textAlign: "center" }}>
                        <tr>
                            <td style={{ width: "180px", verticalAlign: "top" }}>
                                <img src="/assets/img/logo-gtel.png" style={{ width: "180px", height: "70px" }} />
                            </td>
                            <td>
                                <div style={{ width: "100%", position: "relative", display: "inline-block", height: "40px", marginBottom: "5px" }}>
                                    <div><Barcode value={item.Code} height="35" /></div>
                                </div>
                                <br />
                                <p>BIÊN BẢN BÀN GIAO<br />(DELIVERY RECEIPTS)</p>
                            </td>
                            <td style={{ width: "160px", verticalAlign: "top", marginRight: "1px" }} >
                                <img src="/assets/img/iso9001.jpg" style={{ width: "160px", height: "70px" }} />
                            </td>
                        </tr>
                    </table>
                    <table style={{ width: "100%", borderBottom: "2px solid #ddd" }} cellspacing="0" cellpadding="5" >
                        <tr>
                            <td rowspan="2" style={{ borderRight: "1px solid #ddd", width: "20px" }}>
                                <div style={{ marginLeft: "--20px", writingMode: "tb-rl" }}><b>INFORMATION</b></div>
                            </td>
                            <td style={{ borderBottom: "2px solid #ddd", width: "340px", borderRight: "1px solid #ddd", }} >
                                <b style={{ display: "inline-block", width: "240px" }}>Ngày gửi hàng <i>(Date)</i></b>: {FormatDateJson(item.CreateDate, 1)}
                                <br />
                                <b style={{ display: "inline-block", width: "240px" }}>Số kiện <i>(Package)</i></b>: {FormatMoney(item.Number)}
                                <br />
                                <b style={{ display: "inline-block", width: "240px" }}>Nội dung hàng hóa <i>(Document,Goods)</i></b>: {item.Description !== undefined ? item.Description : ""}
                                <br />
                                <b style={{ display: "inline-block", width: "240px" }}>Dịch vụ bưu chính <i>((Postal services)</i></b>: <span>{item.ServiceName}</span>
                                <br />
                                <b style={{ display: "inline-block", width: "240px" }}>Dịch vụ cộng thêm <i>(Extra services)</i></b>: 
                                {item.ServiceGTGTName !== undefined ? item.ServiceGTGTName : ""}
                                <br />
                            </td>
                            <td colspan="" style={{ borderBottom: "2px solid #ddd" }}>
                                <lbl style={{ display: "inline-block", width: "210px" }}>{(item.Mass === 0 || item.Mass === undefined) ? "Trọng lượng " : "Khối lượng "} <i>{(item.Mass === 0 || item.Mass === undefined) ? "(Weight): " : "(Mass): "}</i></lbl>:
                                <b>{(item.Mass === 0 || item.Mass === undefined) ? FormatNumber(item.Weight) : item.Mass} {(item.Mass === 0 || item.Mass === undefined) ? " (gram)" : " (CBM)"}</b>
                                <br />
                                <lbl style={{ display: "inline-block", width: "210px" }}>HT thanh toán <i>(Payment)</i></lbl>: <b>{item.PaymentString !== undefined ? item.PaymentString : "Khác"}</b>
                                <br />
                                <lbl style={{ display: "inline-block", width: "210px" }} >COD</lbl>: <b>{FormatMoney(item.COD)} đ</b>
                                <br />
                                <lbl style={{ display: "inline-block", width: "210px" }}>Số tiền phải thu <i>(Total receivables)</i></lbl>:
                                <b>{FormatMoney(item.PaymentType == 1 ? (item.COD + item.Amount) : item.COD)} đ</b>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" style={{ position: "relative" }}>
                                <b>THÔNG TIN HÀNG HÓA <i>(PARCEL INFORMATION)</i></b> : <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Mã sản phẩm 1<i>(Product Code 1)</i></b>: {item.ProductCode ?? ""}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Tên sản phẩm 1 <i>((Product Name 1)</i></b>: {item.ProductName ?? ""}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Seri sản phẩm 1<i>(Product Seri 1)</i></b>: <span>{item.ProductDes ?? ""}</span>
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Tổng SP <i>(Total product)</i></b>: {item.TotalProduct ?? ""}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Danh sách SP <i>(List of product)</i></b>: {item.ListProductCode ?? ""}
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <u><b>* LƯU Ý GIAO (DELIVERY NOTE): </b></u><span>{item.Noted !== undefined ? item.Noted : ""}</span>
                            </td>
                        </tr>
                    </table>
                    <table style={{ width: "100%", borderBottom: "2px solid #ddd", }} cellspacing="0" cellpadding="5" >
                        <tr>
                            <td style={{ borderRight: "1px solid #ddd", width: "20px" }}>
                                <div style={{ marginLeft: "--20px", writingMode: "tb-rl", }} ><b>DO</b></div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <div><Barcode value={item.PartnerCode} height="35" /></div>
                            </td>
                        </tr>
                    </table>
                    <table style={{ width: "100%", borderBottom: "2px solid #ddd", }} cellspacing="0" cellpadding="5" >
                        <tr>
                            <td style={{ borderRight: "1px solid #ddd", width: "20px" }}>
                                <div style={{ marginLeft: "--20px", writingMode: "tb-rl", }}><b>SENDER</b> </div>
                            </td>
                            <td style={{ position: "relative" }}>
                                <b>THÔNG TIN NGƯỜI GỬI (SENDER INFORMATION)</b>: <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Mã khách hàng <i>(Customer code)</i></b>: {item.CustomerCode}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Người gửi <i>(Sender's name)</i></b>: {item.CustomerNamePrint}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Điện thoại <i>(Phone)</i></b>: <span>{item.CustomerPhonePrint}
                                </span>
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Địa chỉ <i>(Address)</i></b>: {item.CustomerAddressPrint}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Tỉnh/TP <i>(Province/City)</i></b>: {item.CitySendCode}
                                <br />
                                <span style={{ padding: "2px 10px", lineHeight: "30px", fontWeight: "bold", fontSize: "45px", borderTop: "2px solid #000", borderBottom: "2px solid #000", borderLeft: "2px solid #000", top: "-2px", right: 0, position: "absolute", }}>{item.POCodeFrom}</span>
                            </td>
                        </tr>
                    </table>
                    <table style={{ width: "100%", borderBottom: "2px solid #ddd", }} cellspacing="0" cellpadding="5">
                        <tr>
                            <td style={{ borderRight: "1px solid #ddd", width: "20px" }}>
                                <div style={{ marginLeft: "--20px", writingMode: "tb-rl", }}><b>RECEIVER</b></div>
                            </td>
                            <td style={{ position: "relative" }}>
                                <b>THÔNG TIN NGƯỜI NHẬN (RECEIVER'S INFORMATION)</b>:
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Người nhận <i>(Recipient’s name)</i></b>: {item.RecipientName}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Điện thoại <i>(Phone)</i></b>: {item.RecipientPhonePrint}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Công ty nhận <i>(Recipient’s company)</i></b>: <span>{item.RecipientCompany !== undefined ? item.RecipientCompany : ""}</span>
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Số nhà, đường <i>(No., Street)</i></b>: {item.Street !== undefined ? item.Street : item.RecipientAddress}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Phường/Xã <i>(Ward/Commune)</i></b>: {item.Wards}
                                <br />
                                <b style={{ display: "inline-block", width: "250px" }}>- Quận/Huyện <i>(District)</i></b>: {item.District}
                                <br />
                                <b style={{ display: "inline-block", width: "255px" }}>- Tỉnh/TP <i>(Province/City)</i></b>: {item.CityRecipientCode}
                            </td>
                        </tr>
                    </table>
                    <table style={{ width: "100%", borderBottom: "2px solid #ddd", textAlign: "center", fontWeight: "bold", fontSize: "45px", }} cellspacing="0" cellpadding="5">
                        <tr><td style={{ lineHeight: "30px" }}>{item.LocationTo}</td></tr>
                    </table>
                    <table style={{ width: "100%" }} cellspacing="0" cellpadding="5" >
                        <tr>
                            <td colspan="2">
                                Bên nhận hàng xác nhận Bên giao hàng đã giao cho Bên nhận hàng đúng, đủ nội dung như trên/
                                <br />
                                The consigneee confirms that the Delivery company has delivered to the consignee the correct and sufficient content as above.
                                <br />
                                Bên bản được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau/
                                <br />
                                The Delivery record are made into 02 copies, each party keeps 01 copy with the same value.
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center", width: "50%" }}>
                                <br />
                                <b>BÊN GIAO HÀNG</b> <br />
                                <i>(Delivery Company)</i>
                            </td>
                            <td style={{ textAlign: "center", width: "50%" }}>
                                Ngày (Date) ..... / ..... / 20.....
                                <br />
                                <b>BÊN NHẬN HÀNG</b>
                                <br />
                                <i>(Consignee)</i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
        </LayoutLogin>
    );
};
