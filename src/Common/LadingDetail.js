import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { APIKey, TOKEN_DEVICE } from "../Services/Api";
import { mainAction } from "../Redux/Actions";
import {
  FormatMoney,
  FormatDateJson,
  GetCookie,
  GetCookieGroup,
} from "../Utils";
const LadingDetailComp = ({
  LadingId = () => 0,
  LadingCode = () => ""
}) => {
  const dispatch = useDispatch();
  const [Detail, setDetail] = useState({});
  const [Products, setProducts] = useState([]);
  const [History, setHistory] = useState([]);
  const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));

  useEffect(() => {
    if (LadingCode !== "" || LadingId != 0)
      GetLadingDetail();
  }, [LadingCode, LadingId]);

  const GetLadingDetail = async () => {
    if (LadingCode !== "" || LadingId !== "0") {
      try {
        //Lấy thông tin vận đơn
        let param = {
          CustomerIds: GetCookieGroup("CustomerIds"),
          Code: LadingCode,
          LadingId: LadingId,
          CustomerID: CustomerID,
          GroupId: GetCookieGroup("GroupId")
        }

        let pr = {
          Json: JSON.stringify(param),
          func: "APIC_spLading_Find",
        };
        const data = await mainAction.API_spCallServer(pr, dispatch);
        setDetail(data.Detail[0]);
        setHistory(data.History);
        setProducts(data.Products);
      } catch (err) {
        console.log("Eror", err);
        setDetail({});
      }
    }
  }

  return (
    <div className="col-md-12 dt">
      {Detail.Code === undefined && <div class="row cardcus"><div class="col-md-12 text-center red">Vận đơn {LadingCode} không được tạo bởi bạn. Bạn không có quyền tra cứu thông tin.</div></div>}
      {Detail.Code !== undefined && <>
        <div className="row cardcus">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12 borderbottom"> Thông tin vận đơn : <span style={{ color: 'green' }}>{LadingCode}</span></div>
              {/*  thông tin */}
              <div className="col-md-6">
                <div className="col-md-12 Blocktracking">
                  <div className="col-md-12 ">
                    {/*  <i className="fa fa-barcode iwidth"></i> */}
                    <span className="colortext"> Mã vận đơn: </span>
                    <span className="noted">{Detail.Code}</span>
                  </div>
                  <div className="col-md-12 padding-top-5">
                    {/*  <i className="fa fa-barcode iwidth"></i> */}
                    <span className="colortext"> Mã đối tác: </span>
                    <span className="noted">
                      {Detail.PartnerCode}
                    </span>
                  </div>
                  <div className="col-md-12 padding-top-5">
                    {/*   <i className="fa fa-clock-o iwidth"></i> */}
                    <span className="colortext">
                      {" "}
                      Thời gian dự kiến giao:{" "}
                    </span>
                    <span className="noted"> Từ 8h - 17:30 ngày {" "}
                      {FormatDateJson(
                        Detail.DealineTime, 1
                      )}
                    </span>
                  </div>
                  <div className="col-md-12 padding-top-5">
                    {/*   <i className="fa fa-sitemap iwidth"></i> */}
                    <span className="colortext"> Trọng lượng (gram): </span>
                    <span className="weight">
                      {FormatMoney(Detail.Weight)}
                    </span>
                  </div>
                  <div className="col-md-12 padding-top-5">
                    {/*   <i className="fa fa-tags iwidth"></i> */}
                    <span className="colortext"> Số khối: </span>
                    <span className="number-item">
                      {Detail.Mass} (cbm)
                    </span>
                  </div>
                  <div className="col-md-12 padding-top-5">
                    {/*   <i className="fa fa-pencil-square iwidth"></i> */}
                    <span className="colortext"> Nội dung: </span>
                    <span className="noted">
                      {Detail.Description}
                    </span>
                  </div>
                  <div className="col-md-12 padding-top-5">
                    {/*   <i className="fa fa-file-text iwidth"></i> */}
                    <span className="colortext"> Ghi chú: </span>
                    <span className="noted">{Detail.Noted}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="col-md-12 Blocktracking">
                  <div className="col-md-12">
                    {/*     <i className="fa fa-flag iwidth"></i> */}
                    <span className="colortext"> Trạng thái: </span>
                    <span style={{ background: '#65B168', color: 'white', padding: '3px 7px', borderRadius: '4px' }}>
                      {Detail.StatusName}
                    </span>
                  </div>

                  <div className="col-md-12 padding-top-5">
                    {/*   <i className="fa fa-clock-o iwidth"></i> */}
                    <span className="colortext"> Thời gian tạo: </span>
                    <span className="create-date">
                      {FormatDateJson(
                        Detail.CreateDate
                      )}
                    </span>
                  </div>

                  <div className="col-md-12 padding-top-5">
                    {/*       <i className="fa fa-briefcase iwidth"></i> */}
                    <span className="colortext"> Dịch vụ: </span>
                    <span className="number-item">
                      {Detail.ServiceName}
                    </span>
                  </div>

                  <div className="col-md-12 padding-top-5">
                    {/*    <i className="fa fa-square-o iwidth"></i> */}
                    <span className="colortext"> Số kiện: </span>
                    <span className="number-item">
                      {FormatMoney(Detail.Number)}
                    </span>
                  </div>

                  <div className="col-md-12 padding-top-5">
                    {/*     <i className="fa fa-credit-card iwidth"></i> */}
                    <span className="colortext">
                      {" "}
                      Hình thức thanh toán:{" "}
                    </span>
                    <span className="noted">
                      {Detail.PaymentString}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt30">
            <div className="col-md-12 borderbottom row">
              {/*   <i className="material-icons">bubble_chart</i> */} Thông tin người gửi</div>
            <div className='col-md-12 Blocktracking'>
              <div className="col-md-12 ">
                {/*   <i className="fa fa-user iwidth"></i> */}
                <span className="colortext">Tên khách hàng: </span>
                <span className="sender-name noted">
                  {Detail.CustomerName}
                </span>
              </div>
              <div className="col-md-12 ">
                {/*     <i className="fa fa-phone iwidth"></i> */}
                <span className="colortext">Số ĐT: </span>
                <span className="sender-phone noted">
                  {Detail.CustomerPhone}
                </span>
              </div>
              <div className="col-md-12 col-md-12 col-xs-12">
                {/*  <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext">Tỉnh đi: </span>
                <span className="recipient-company noted">
                  {Detail.CitySendCode}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*  <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Huyện đi: </span>
                <span className="sender-address noted">
                  {Detail.DistrictName_From}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*  <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Địa chỉ khách hàng: </span>
                <span className="sender-address noted">
                  {Detail.CustomerAddress}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*   <i className="fa fa-user iwidth"></i> */}
                <span className="colortext">Người gửi thực tế: </span>
                <span className="sender-name noted">
                  {Detail.CustomerName_Reality}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*     <i className="fa fa-phone iwidth"></i> */}
                <span className="colortext">
                  {" "}
                  SĐT người gửi thực tế:{" "}
                </span>
                <span className="sender-phone noted">
                  {Detail.CustomerPhone_Reality}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*  <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Địa chỉ gửi thực tế: </span>
                <span className="sender-address noted">
                  {Detail.CustomerAddress_Reality}
                </span>
              </div>
            </div>

          </div>
          <div className="col-md-6 mt30">
            <div className="col-md-12 borderbottom row">
              Thông tin người nhận
            </div>
            <div className="col-md-12 Blocktracking">
              <div className="col-md-12 col-xs-12">
                {/*   <i className="fa fa-user iwidth"></i> */}
                <span className="colortext"> Tên người nhận: </span>
                <span className="recipient-name noted">
                  {Detail.RecipientName}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*  <i className="fa fa-phone iwidth"></i> */}
                <span className="colortext"> Số điện thoại: </span>
                <span className="recipient-phone noted">
                  {Detail.RecipientPhone}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*  <i className="fa fa-flag iwidth"></i> */}
                <span className="colortext"> Công ty: </span>
                <span className="recipient-company noted">
                  {Detail.RecipientCompany}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*    <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Tỉnh đến: </span>
                <span className="recipient-company noted">
                  {Detail.CityRecipientCode}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*  <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Huyện đến: </span>
                <span className="recipient-company noted">
                  {Detail.District}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*     <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Phường xã đến: </span>
                <span className="recipient-company noted">
                  {Detail.Wards}
                </span>
              </div>
              <div className="col-md-12 col-xs-12">
                {/*   <i className="fa fa-map-marker iwidth"></i> */}
                <span className="colortext"> Địa chỉ: </span>
                <span className="recipient-address noted">
                  {Detail.RecipientAddress}
                </span>
              </div>
            </div>

          </div>
        </div>
        <div className="row mt30 cardcus margin-top-20">
          <div className="col-md-12 borderbottom">{/* <i className="material-icons">content_paste</i> */} Thông tin đơn hàng</div>
          <div className="col-md-12 tbdt margin-top-20">
            <table style={{ width: "100%" }} >
              <tbody>
                <tr className="tabledesign">
                  <td>
                    <span className="colortext bold text-transform" style={{ fontWeight: 'bold' }}> Tổng cước</span>
                  </td>
                  <td>
                    <span className="length bold" style={{ fontWeight: 'bold' }}>
                      {FormatMoney(Detail.Amount) + " đ"}
                    </span>
                  </td>
                  <td>
                  </td>
                  <td>
                  </td>
                </tr>
                <tr className="">
                  <td>
                    <span className="colortext"> Tiền thu hộ:</span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.COD) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Cước trắng:</span>
                  </td>
                  <td>
                    <span className="length">
                      {FormatMoney(Detail.PriceMain) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="linebottom">
                  <td>
                    <span className="colortext"> Cước phí thu hộ:</span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.CODPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Tiền khai giá:</span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.Insured) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="">
                  <td>
                    <span className="colortext"> Cước phí khai giá:</span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.InsuredPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> PPXD:</span>
                  </td>
                  <td>
                    <span className="number-item">
                      {FormatMoney(Detail.PPXDMoney) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="linebottom">
                  <td>
                    <span className="colortext"> VAT:</span>
                  </td>
                  <td>
                    <span className="weight">
                      {FormatMoney(Detail.VATMoney) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> BP:</span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.BPPrice) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="">
                  <td>
                    <span className="colortext"> THBB:</span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.THBBPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Phí phát tận tay: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.PTTPrice) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="linebottom">
                  <td>
                    <span className="colortext"> Phí hàng quá khổ: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.HQKPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext">
                      {" "}
                      Phát hàng siêu thị:{" "}
                    </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.PSTPrice) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="">
                  <td>
                    <span className="colortext">
                      {" "}
                      Phí hàng đảo phú quốc:{" "}
                    </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.PDPQPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Tổng Hóa đơn: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.PercentHD)}
                    </span>
                  </td>

                </tr>
                <tr className="linebottom">
                  <td>
                    <span className="colortext"> Phí hóa đơn: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.HDPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Tổng đồng kiểm: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.PercentPDK)}
                    </span>
                  </td>

                </tr>
                <tr className="">
                  <td>
                    <span className="colortext">
                      {" "}
                      Phí N/P đồng kiểm:{" "}
                    </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.NPDKPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Phí lắp đặt: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.LDPrice) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="linebottom">
                  <td>
                    <span className="colortext"> Phí gửi xe: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.DrPrice) + " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Phụ cấp: </span>{" "}
                  </td>
                  <td>
                    <span className="length textalign">
                      {FormatMoney(Detail.Allowance) + " đ"}
                    </span>
                  </td>

                </tr>
                <tr className="">
                  <td>
                    <span className="colortext"> Phụ cấp NT: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.OnSiteDeliveryMoney) +
                        " đ"}
                    </span>
                  </td>
                  <td>
                    <span className="colortext"> Phụ cấp đóng gói: </span>
                  </td>
                  <td>
                    <span className="noted">
                      {FormatMoney(Detail.PackPrice) + " đ"}
                    </span>
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt30 cardcus margin-top-20 ">
          <div className="col-md-12 borderbottom"> Thông tin sản phẩm</div>
          <div className="col-md-12  margin-top-20 margin-bottom-20">
            <div className="table-responsive tbht">
              <table id="dataTable" style={{ border: '1PX SOLID #eff1f3' }}>
                <thead >
                  <tr style={{ color: '#00884E' }}>
                    <th style={{ paddingLeft: '5px', minWidth: '135px' }}> MÃ SẢN PHẨM</th>
                    <th style={{ minWidth: '250px' }}>TÊN SẢN PHẨM</th>
                    <th>SỐ LƯỢNG</th>
                    <th>MÔ TẢ SẢN PHẨM</th>
                  </tr>
                </thead>
                <tbody>
                  {Products.map((item, index) => {
                    return (
                      <tr key={index} className={'line' + index}>
                        <td>{item.ProductCode}</td>
                        <td>{item.ProductName}</td>
                        <td>{item.Quanlity}</td>
                        <td>{item.ProductDescription}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={"row mt30 cardcus margin-top-20" + (Detail.Status !== 6 ? " display-none" : "")}>  {/*  */}
          <div className="col-md-12 borderbottom">
            {/*  <i className="material-icons">image_aspect_ratio</i> */} Hình ảnh báo phát
          </div>
          <div className="col-md-12 margin-top-10">
            {/* <i className="fa fa-user iwidth"></i> */}
            <span className="colortext"> Tên người nhận thực tế: </span>
            <span className="code">{Detail.Recipient_reality}</span>
          </div>
          <div className="col-md-12">
            {/*   <i className="fa fa-clock-o iwidth"></i> */}
            <span className="colortext"> Ngày hoàn thành: </span>
            <span className="code">
              {Detail.FinishDate === undefined ? "" : FormatDateJson(Detail.FinishDate)}
            </span>
          </div>
          <div
            className={
              Detail.StatusName === 7
                ? "col-md-12"
                : "col-md-12 display-none"
            }
          >
            {/* <i className="fa fa-pencil-square iwidth"></i> */}
            <span className="colortext"> Lý do phát lại: </span>
            <span className="code">{Detail.ReasonName}</span>
          </div>
          <div
            className="col-md-12"
            style={{ width: "100%" }}
          >
            <br /><b className="colortext"> Hình ảnh lấy hàng: </b><br />
            {Detail.ImageOrderList !== undefined &&
              Detail.ImageOrderList !== "" &&
              Detail.ImageOrderList !== null
              ? JSON.parse(Detail.ImageOrderList).map(
                (img, index) => {
                  return (
                    <img
                      src={img.splitdata}
                      style={{ margin: '0 5px 5px 5px', width: "auto", height: '450px', display: "inline-block" }} />
                  );
                }
              )
              : null}
          </div>
          <div
            className="col-md-12"
            style={{ width: "100%" }}
          >
            <br /><b className="colortext"> Hình ảnh phát hàng: </b><br />
            {Detail.ImageDeliveryList !== undefined &&
              Detail.ImageDeliveryList !== "" &&
              Detail.ImageDeliveryList !== null
              ? JSON.parse(Detail.ImageDeliveryList).map(
                (img, index) => {
                  return (
                    <img
                      src={img.splitdata}
                      style={{ margin: '0 5px 5px 5px', width: "auto", height: '450px', display: "inline-block" }}
                    />
                  );
                }
              )
              : null}
          </div>
          <div
            className="col-md-12"
            style={{ width: "100%" }}
          >
            <br /><b className="colortext"> Hình ảnh dịch vụ BP: </b><br />
            {Detail.ImageBP !== undefined &&
              Detail.ImageBP !== "" &&
              Detail.ImageBP !== null
              ? JSON.parse(Detail.ImageBP).map(
                (img, index) => {
                  return (
                    <img
                      src={img.splitdata}
                      style={{ margin: '0 5px 5px 5px', width: "auto", height: '450px', display: "inline-block" }}
                    />
                  );
                }
              )
              : null}
          </div>
          <div
            className="col-md-12"
            style={{ width: "100%" }}
          >
            <br /><b className="colortext"> Hình ảnh dịch vụ THBB: </b><br />
            {Detail.ImageTHBB !== undefined &&
              Detail.ImageTHBB !== "" &&
              Detail.ImageTHBB !== null
              ? JSON.parse(Detail.ImageTHBB).map(
                (img, index) => {
                  return (
                    <img
                      src={img.splitdata}
                      style={{ margin: '0 5px 5px 5px', width: "auto", height: '450px', display: "inline-block" }}
                    />
                  );
                }
              )
              : null}
          </div>
        </div>
        <div className={"row mt30 cardcus margin-top-20" + (Detail.Status !== 6 ? " display-none" : "")}>  {/*  */}
          <div className="col-md-12 borderbottom">
            {/*  <i className="material-icons">image_aspect_ratio</i> */} Hình ảnh lắp đặt
          </div>
          <div
            className="col-md-12 margin-top-20"
            style={{ width: "100%" }}
          >
            {Detail.SetUpImage !== undefined &&
              Detail.SetUpImage !== "" &&
              Detail.SetUpImage !== null
              ? JSON.parse(Detail.SetUpImage).map(
                (img, index) => {
                  return (
                    <img
                      src={img.splitdata}
                      style={{ width: "100%", display: "block" }}
                    />
                  );
                }
              )
              : null}
          </div>
        </div>
        <div className="row mt30 cardcus margin-top-20 ">
          <div className="col-md-12 borderbottom">{/* <i className="material-icons">lens_blur</i>  */}Hành trình vận đơn</div>
          <div className="col-md-12  margin-top-20 margin-bottom-20">
            <div className="table-responsive tbht">
              <table id="dataTable" style={{ border: '1PX SOLID #eff1f3' }}>
                <thead >
                  <tr style={{ color: '#00884E' }}>
                    <th style={{ paddingLeft: '5px', minWidth: '135px' }}>  NGÀY GIỜ</th>
                    <th style={{ minWidth: '250px' }}>BƯU CỤC XỬ LÝ</th>
                    <th>TÌNH TRẠNG XỬ LÝ</th>
                  </tr>
                </thead>
                <tbody>
                  {History.map((item, index) => {
                    return (
                      <tr key={index} className={'line' + index}>
                        <td>{FormatDateJson(item.DateTime)}</td>
                        <td>{item.POName}</td>
                        <td>{item.Note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      }
    </div>
  )
}
export const LadingDetail = React.memo(LadingDetailComp)