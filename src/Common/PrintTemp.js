import React, { useEffect, useState, useDispatch } from "react";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import { FormatDate, FormatMoney, FormatDateJson, Alerterror } from "../Utils";

const PrintTempComp = ({ data, sheetprint }) => {
  const [value, setValue] = React.useState("");
  const wrapper_ref = React.useRef();
  const style = "height:100vh; width:100vw; position:absolute; left:0: top:0";
  const opt = { scale: 4 };

  const onClickPrint = () => {
    //#region Load html print
    let _htmlprint = "";
    data.forEach((item, index) => {
      setValue(item.Code);
      /* const elem = wrapper_ref.current;
      let url = html2canvas(elem, opt).then(canvas => {
        setValue(item.Code);
        const imgUrl = canvas.toDataURL({
            format: 'jpeg',
            quality: '1.0'
        });
        return (`<img style="${style}" height="50" src="${imgUrl}"/>`);
      }); */
      for (var i = 1; i <= parseInt(sheetprint); i++) {
        _htmlprint += `<div key=${index + "_" + i} className="bill" style="width:710px;height: 1050px;page-break-before: always;border:2px solid #000">
                    <table style="width:100%;font-weight:600;border-bottom: 2px solid #ddd;text-align:center;">
                        <tr>
                            <td style="width:180px;vertical-align:top;"><img src="/assets/img/logo-gtel.png" style="max-width: 200px;height:70px"/></td>
                            <td><div style="width: 100%;position: relative;display:inline-block;height:40px;margin-bottom: 5px;">${GeneralBarcode(item.Code)}</div><br /><br /><p>BIÊN BẢN BÀN GIAO<br />(DELIVERY RECEIPTS)</p></td>
                            <td style="width:180px;vertical-align:top;margin-right: 1px;"><img src="/assets/img/iso9001.jpg" style="max-width: 200px;height:80px;"/></td>
                        </tr>
                    </table>
                    <table style="width:100%;border-bottom: 2px solid #ddd;" cellspacing="0" cellpadding="5">
                            <tr>
                            <td rowspan="2" style="border-right:1px solid #ddd"><div style="margin-left:--20px;writing-mode: tb-rl;"><b>INFORMATION</b></div></td>
                                <td style="border-bottom:2px solid #ddd;width:350px;border-right:1px solid #ddd;">
                                    <b style="display: inline-block;width:250px"><b>Ngày gửi hàng <i>(Date)</i></b></b> :${FormatDateJson(
                                      item.CreateDate,
                                      "d-k-y"
                                    )}<br />
                                    <b style="display: inline-block;width:250px"><b>Số kiện <i>(Package)</i></b></b> : ${
                                      FormatMoney(item.Number)
                                    }<br />
                                    <b style="display: inline-block;width:250px"><b>Nội dung hàng hóa <i>(Document,Goods)</i></b></b>: ${
                                      item.Description
                                    }<br />
                                    <b style="display: inline-block;width:250px"><b>Dịch vụ bưu chính <i>((Postal services)</i></b></b>: <span>${
                                      item.ServiceName
                                    }</span><br />
                                    <b style="display: inline-block;width:250px"><b>Dịch vụ cộng thêm <i>(Extra services)</i></b></b>: ${
                                      item.ServiceGTGTName!==undefined?item.ServiceGTGTName:""
                                    }<br />
                                </td> 
                                <td colspan="" style="border-bottom:2px solid #ddd;">
                                <lbl style="display: inline-block;width:225px">${
                                  item.Mass === 0 ? "Trọng lượng" : "Khối lượng"
                                } <i>${
                                item.Mass === 0 ? "(Weight)" : "(Mass)"
                                }</i></lbl>: <b>${
                                item.Mass === 0 ? FormatMoney(item.Weight) : FormatMoney(item.Mass)
                                } ${item.Mass === 0 ? "(gram)" : "(CBM)"}</b><br />
                                <lbl style="display: inline-block;width:225px">HT thanh toán <i>(Payment)</i></lbl>: <b>${
                                    item.PaymentString!==undefined?item.PaymentString:"Khác"
                                }</b><br />
                                <lbl style="display: inline-block;width:225px">COD</lbl>: <b>${
                                  item.COD
                                } đ</b><br />
                                <lbl style="display: inline-block;width:225px">Số tiền phải thu <i>(Total receivables)</i></lbl>: <b>${FormatMoney(
                                  item.PaymentType == 1 ? item.Amount : item.COD
                                )} đ</b>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" style="position:relative;">
                                    <b>THÔNG TIN HÀNG HÓA <i>(PARCEL INFORMATION)</i></b>: <br />
                                    <b style="display: inline-block;width:250px"><b>- Mã sản phẩm <i>(Product Code)</i></b></b>: ${
                                      item.ProductCode ?? ""
                                    }<br />
                                    <b style="display: inline-block;width:250px"><b>- Tên sản phẩm <i>((Product Name)</i></b></b>: ${
                                      item.ProductName ?? ""
                                    }<br />
                                    <b style="display: inline-block;width:250px"><b>- Số lượng <i>(Number)</i></b></b> : ${
                                      item.ProductQuanlity ?? ""
                                    }<br />
                                    <b style="display: inline-block;width:250px"><b>- Seri sản phẩm <i>(Product Seri)</i></b></b>: <span>${
                                      item.ProductDes ?? ""
                                    }</span><br />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4">
                                    <u><b>* LƯU Ý GIAO (DELIVERY NOTE):</b></u> <span>${
                                      item.Noted
                                    }</span>
                                </td>
                            </tr>
                        </tr>
                    </table>
                    <table style="width:100%;border-bottom: 2px solid #ddd;" cellspacing="0" cellpadding="5">
                        <tr>
                            <td style="border-right:1px solid #ddd"><div style="margin-left:--20px;writing-mode: tb-rl;"><b>SENDER</b></div></td>
                            <td style="position: relative">
                                <b>THÔNG TIN NGƯỜI GỬI (SENDER INFORMATION)</b>: <br />
                                <b style="display: inline-block;width:250px"><b>- Mã khách hàng <i>(Customer code)</i></b></b>: ${
                                  item.CustomerCode
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Người gửi <i>(Sender's name)</i></b></b>: ${
                                  item.CustomerName_Reality!==undefined?item.CustomerName_Reality:item.CustomerName
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Điện thoại <i>(Phone)</i></b></b>: <span>${
                                    item.CustomerPhone_Reality!==undefined?item.CustomerPhone_Reality:item.CustomerPhone
                                }</span><br />
                                <b style="display: inline-block;width:250px"><b>- Địa chỉ <i>(Address)</i></b></b>: ${
                                    item.CustomerAddress_Reality!==undefined?item.CustomerAddress_Reality:item.CustomerAddress
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Tỉnh/TP <i>(Province/City)</i></b></b>: ${
                                  item.CitySendCode
                                }<br />
                                <span style="padding:2px 10px;font-weight:bold;font-size:45px;border-top:2px solid #000;border-bottom:2px solid #000;border-left:2px solid #000;top:-2px;right:0;position:absolute;">${
                                  item.POCodeFrom
                                }</span>
                            </td>
                        </tr>
                    </table>
                    <table style="width:100%;border-bottom: 2px solid #ddd;" cellspacing="0" cellpadding="5">
                        <tr>
                            <td style="border-right:1px solid #ddd"><div style="margin-left:--20px;writing-mode: tb-rl;"><b>RECEIVER</b></div></td>
                            <td style="position: relative">
                                <b>THÔNG TIN NGƯỜI NHẬN (RECEIVER'S INFORMATION)</b>: <br />
                                <b style="display: inline-block;width:250px"><b>- Người nhận <i>(Recipient’s name)</i></b></b>: ${
                                  item.RecipientName
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Điện thoại <i>(Phone)</i></b></b>: ${
                                  item.RecipientPhone
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Công ty nhận <i>(Recipient’s company)</i></b></b>: <span>${
                                  item.RecipientCompany
                                }</span><br />
                                <b style="display: inline-block;width:250px"><b>- Số nhà, đường <i>(No., Street)</i></b></b>: ${
                                  item.Street!==undefined?item.Street:item.RecipientAddress
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Phường/Xã <i>(Ward/Commune)</i></b></b>: ${
                                  item.Wards
                                }<br />
                                <b style="display: inline-block;width:250px"><b>- Quận/Huyện <i>(District)</i></b></b>: ${
                                  item.District
                                }<br />
                                <b style="display: inline-block; width: 255px;"><b>- Tỉnh/TP <i>(Province/City)</i></b></b>: ${
                                  item.CityRecipientCode
                                }<br />
                                <span style="padding:2px 10px;font-weight:bold;font-size:45px;border-top:2px solid #000;border-bottom:2px solid #000;border-left:2px solid #000;top:-2px;right:0;position:absolute;">${
                                  item.POCodeTo
                                }</span>
                            </td>
                        </tr>
                    </table>
                    <table style="width:100%;" cellspacing="0" cellpadding="5">
                        <tr><td colspan="2">Bên nhận hàng xác nhận Bên giao hàng đã giao cho Bên nhận hàng đúng, đủ nội dung như trên/<br />
                                The consigneee confirms that the Delivery company has delivered to the consignee the correct and sufficient content as above.<br />
                                Bên bản được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau/<br />
                                The Delivery record are made into 02 copies, each party keeps 01 copy with the same value.
                            </td></tr>
                        <tr>
                            <td style="text-align:center;width:50%;"><br /><b>BÊN GIAO HÀNG</b> <br /><i>(Delivery Company)</i></td>
                            <td style="text-align:center;width:50%;">Ngày (Date) ..... / ..... / 20.....<br /><b>BÊN NHẬN HÀNG</b><br /><i>(Consignee)</i></td>
                        </tr>
                    </table>
                </div>`;
      }
    });
    setValue("");
    //#endregion Load html print

    //#region Format form in & Gọi sự kiện in
    const elem = wrapper_ref.current;
    const iframe = document.createElement("iframe");
    iframe.name = "printf";
    iframe.id = "printf";
    iframe.height = 0;
    iframe.width = 0;
    document.body.appendChild(iframe);
    
    var newWin = window.frames["printf"];
    newWin.document.write(
      `<body onload="window.print();">${_htmlprint}</body>`
    );
    newWin.document.close();

    //#endregion  Format form in & Gọi sự kiện in
  };

  const GeneralBarcode = (Code)=>{
    setValue(Code);
    const elem = wrapper_ref.current;
    html2canvas(elem, opt).then(canvas => {
        setValue(Code);
        const imgUrl = canvas.toDataURL({
            format: 'jpeg',
            quality: '1.0'
        });
        debugger
        return imgUrl;
        //return (`<img style="${style}" height="50" src="${imgUrl}"/>`);
    });
  }

  /* const [BarCodeHtml,setBarCodeHtml] = useState([]); 
  useEffect(() => {
    debugger
    if(value!==""){
        setBarCodeHtml();
        //Alerterror(value);
    }
  }, [value]); */

  

  return (
    <div>
      {/* {HtmlPrint} */}
      <div ref={wrapper_ref}>{<Barcode value={value} />}</div>
      <button
        onClick={(e) => {
          onClickPrint();
        }}
      >
        Print Barcode
      </button>
    </div>
  );
};

export const PrintTemp = React.memo(PrintTempComp);
