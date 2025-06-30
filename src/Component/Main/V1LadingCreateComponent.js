import React, { useState, useEffect, useRef, useDebugValue } from "react";
import { useDispatch } from "react-redux";
import {
  SelectCity,
  SelectService,
  SelectDistrict,
  SelectWard,
  SelectSender,
  LadingDetail,
  SelectRecipient,
  FormManagerAddress
} from "../../Common";
import {
  Alertsuccess,
  Alerterror,
  Alertwarning,
  FormatMoney,
  FormatDateJson,
  ValidPhone,
  FormatNumber,
  GetLatLngGoogle,
  GetCookie,
  RemoveAccents,
  ValidNumber,
  RegExpAddress,
  RemoveExtraSpace
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { Service } from "../../Redux/Actions/Category";
import { Lading } from "../../Redux/Actions/Category";
import { useInput } from "../../Hooks";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { useHistory } from "react-router-dom";
import { DataTable } from "../../Common/DataTable";
import Barcode from "react-barcode";
import { Link } from "react-router-dom";
import $ from "jquery";
import LayoutMain from "../../Layout/LayoutMain";

export const V1LadingCreateComponent = () => {
  useEffect(() => {
    if (Customer === null || Customer === {}) {
      history.push("/");
    }
  }, []);
  //#region ********** KHAI BÁO CÁC BIẾN DỮ LIỆU **********

  //#region CÁC HÀM KHAI BÁO CHÍNH
  const dispatch = useDispatch();
  const history = useHistory();
  const [Title, setTitle] = useState("TẠO ĐƠN HÀNG MỚI");
  const [Customer, setCustomer] = useState(GetCookie("All"));

  //#endregion CÁC HÀM KHAI BÁO CHÍNH

  //#region KHAI BÁO CHO FORM TẠO ĐƠN

  const [ShowSender, setShowSender] = useState("");
  const [ShowReceipient, setShowReceipient] = useState("");

  const [LadingId, setLadingId] = useState(0);
  const [LadingCode, setLadingCode] = useState("");

  //#region Thông tin khách hàng

  const [PostOfficeId, setPostOfficeId] = useState(Customer?.PostOfficeId);

  //#endregion Thông tin khách hàng

  //#region Người gửi thực tế
  const [OnLoadSender, setOnloadSender] = useState(0);
  const [SenderMeno, setSenderMeno] = useState({
    value: 0,
    label: Customer?.CustomerName + " - " + Customer?.Phone + " - " + Customer?.Address,
    obj: {
      NameSend: Customer?.CustomerName,
      PhoneSend: Customer?.Phone,
      AddressFull: Customer?.Address,
      CityId: Customer?.City,
      CityName: Customer?.CityName,
      DistrictiId: Customer?.District,
      DistrictyName: Customer?.DistrictName,
      WarId: Customer?.Ward,
      WarName: Customer?.WardName,
      Street_Number: Customer?.Address.replaceAll(", " + Customer?.Ward, "").replaceAll(", " + Customer?.District, "").replaceAll(", " + Customer?.City, "")
    }
  });
  const [SenderName, bindSenderName, setSenderName] = useInput(
    Customer?.CustomerName
  );
  const [SenderPhone, bindSenderPhone, setSenderPhone] = useInput(
    Customer?.Phone
  );
  const [SenderAddress, bindSenderAddress, setSenderAddress] = useInput(
    Customer?.Address
  );
  const [SenderStreet, bindSenderStreet, setSenderStreet] = useInput(
    Customer?.Address
  );
  const [CityFrom, setCityFrom] = useState(0);
  const [CityFromName, setCityFromName] = useState(
    Customer?.CityName
  );
  const [DistrictFrom, setDistrictFrom] = useState(
    Customer?.District
  );
  const [DistrictFromName, setDistrictFromName] = useState(
    Customer?.DistrictName
  );
  const [WardFrom, setWardFrom] = useState(
    Customer?.Ward
  );
  const [WardFromName, setWardFromName] = useState(
    Customer?.WardName
  );

  const SenderNameRef = useRef();
  const SenderPhoneRef = useRef();
  const SenderAddressRef = useRef();
  const SenderStreetRef = useRef();

  const [IsSaveSender, setIsSaveSender] = useState(false);
  //#endregion Người gửi thực tế

  //#region Người nhận
  const [AddressSetupId, setAddressSetupId] = useState(0);
  const [OnLoadRecipient, setOnLoadRecipient] = useState(0);
  const [RecipientMeno, setRecipientMeno] = useState({});
  const [RecipientName, bindRecipientName, setRecipientName] = useInput("");
  const [RecipientPhone, bindRecipientPhone, setRecipientPhone] = useInput("");
  const [RecipientAddress, bindRecipientAddress, setRecipientAddress] = useInput("");
  const [RecipientAddressOld, setRecipientAddressOld] = useState("");
  const [RecipientStreet, bindRecipientStreet, setRecipientStreet] = useInput("");
  const [RecipientCompany, bindRecipientCompany, setRecipientCompany] = useInput("");
  const [CityTo, setCityTo] = useState(0);
  const [DistrictTo, setDistrictTo] = useState(0);
  const [WardTo, setWardTo] = useState(0);
  const [CityToName, setCityToName] = useState("");
  const [DistrictToName, setDistrictToName] = useState("");
  const [WardToName, setWardToName] = useState("");
  const [Lat, setLat] = useState(0);
  const [Lng, setLng] = useState(0);

  const RecipientNameRef = useRef();
  const RecipientPhoneRef = useRef();
  const RecipientAddressRef = useRef();
  const RecipientStreetRef = useRef();
  const RecipientCompanyRef = useRef();
  //#endregion Người nhận

  //#region Thông tin hàng hóa
  const [Description, bindDescription, setDescription] = useInput("");
  const [ParnerCode, bindParnerCode, setParnerCode] = useInput("");
  const [Weight, bindWeight, setWeight] = useInput("");
  const [Width, bindWidth, setWidth] = useInput("");
  const [Noted, bindNoted, setNoted] = useInput("");
  const [NumberItem, bindNumberItem, setNumberItem] = useInput("1");
  const [Height, bindHeight, setHeight] = useInput("");
  const [Length, bindLength, setLength] = useInput("");
  const [Mass, bindMass, setMass] = useInput("");
  const DescriptionRef = useRef();
  const ParnerCodeRef = useRef();
  const WeightRef = useRef();
  const WidthRef = useRef();
  const NotedRef = useRef();
  const NumberItemRef = useRef();
  const HeightRef = useRef();
  const LengthRef = useRef();
  const MassRef = useRef();
  //#endregion Thông tin hàng hóa

  //#region Sản phẩm
  const [ProductCode, bindProductCode, setProductCode] = useInput("");
  const [ProductName, bindProductName, setProductName] = useInput("");
  const [ProductQuality, bindProductQuality, setProductQuality] = useInput("");
  const [ProductDes, bindProductDes, setProductDes] = useInput("");
  const ProductCodeRef = useRef();
  const ProductNameRef = useRef();
  const ProductQualityRef = useRef();
  const ProductDesRef = useRef();
  //#endregion Sản phẩm

  //#region Dịch vụ chính
  const [ServiceID, setServiceID] = useState(0);
  const [ServiceName, setServiceName] = useState("");
  //#endregion Dịch vụ chính

  //#region Dịch vụ GTGT

  const [PhuQuocIsLand, bindPhuQuocIsLand, setPhuQuocIsLand] = useInput("");
  const [IsProtocol, bindIsProtocol, setIsProtocol] = useInput(0);
  const [IsHD, bindIsHD, setIsHD] = useInput(0);
  const [HD, bindHD, setHD] = useInput(0);
  const [IsDelivery, bindIsDelivery, setIsDelivery] = useInput(0);
  const [NumberCoCheck, bindNumberCoCheck, setNumberCoCheck] = useInput(0); // same time check
  const [IsNumberCoCheck, bindIsNumberCoCheck, setIsNumberCoCheck] = useInput(
    0
  ); // same time check
  const [SupperMarket, bindSupperMarket, setSupperMarket] = useInput("");
  const HDRef = useRef();
  const NumberCoCheckRef = useRef();

  const [IsRunservice, setIsRunservice] = useState(1);

  const [ServiceGTGTId, setServiceGTGTId] = useState("");
  const [ServiceGTGTName, setServiceGTGTName] = useState("");
  const [RecipientId, setRecipientId] = useState(0);

  //#endregion Dịch vụ GTGT

  //#region Hình thức thanh toán
  const [PaymentType, setPaymentType] = useState(Customer?.Type === 1 ? 0 : 1);
  const [PaymentTypeCode, setPaymentTypeCode] = useState(Customer?.Type === 1 ? "TTCT" : "NNTT");
  //#endregion Hình thức thanh toán

  //#region Thu hộ & khai giá
  const [Cod, bindCod, setCod] = useInput("0");
  const [CODPrice, bindCODPrice, setCODPrice] = useInput("0");
  const [Insured, bindInsured, setInsured] = useInput("0");
  const [InsuredPrice, bindInsuredPrice, setInsuredPrice] = useInput("0");

  const CodRef = useRef();
  const CODPriceRef = useRef();
  const InsuredRef = useRef();
  const InsuredPriceRef = useRef();
  //#endregion Thu hộ & khai giá

  //#region Chi tiết cước phí
  const [PPXDPrice, bindPPXDPrice, setPPXDPrice] = useInput("");
  const [PriceMain, bindPriceMain, setPriceMain] = useInput("");
  const [THBBPrice, bindTHBBPrice, setTHBBPrice] = useInput("");
  const [HDPrice, bindHDPrice, setHDPrice] = useInput("");
  const [PTTPrice, bindPTTPrice, setPTTPrice] = useInput("");
  const [VATPrice, bindVATPrice, setVATPrice] = useInput("");
  const [BPPrice, bindBPPrice, setBPPrice] = useInput("");
  const [NPDKPrice, bindNPDKPrice, setNPDKPrice] = useInput("");
  const [HQKPrice, bindHQKPrice, setHQKPrice] = useInput("");
  const PPXDPriceRef = useRef();
  const PriceMainRef = useRef();
  const InsuredPricesRef = useRef();
  const THBBPriceRef = useRef();
  const HDPriceRef = useRef();
  const PTTPriceRef = useRef();
  const VATPriceRef = useRef();
  const CODPricesRef = useRef();
  const BPPriceRef = useRef();
  const SearchcodeRef = useRef();
  const NPDKPriceRef = useRef();
  const HQKPriceRef = useRef();
  const [OnSiteDeliveryPrice, setOnSiteDeliveryPrice] = useState(0);
  const [OnSiteDeliveryPriceMoney, setOnSiteDeliveryPriceMoney] = useState(0);

  const [Amount, bindAmount, setAmount] = useInput("");
  const AmountRef = useRef();

  const [Dealine, bindDealine, setDealine] = useInput("");
  const DealineRef = useRef();
  //#endregion  Chi tiết cước phí

  //#endregion KHAI BÁO CHO FORM TẠO ĐƠN

  //#region KHAI BÁO CÁC BIẾN ACTION ĐỂ LOAD DATA LÊN FORM

  const [ServiceGTGT, setServiceGTGT] = useState([]);
  const [getCustomerRecipientLoad, setCustomerRecipientLoad] = useState([]);
  const [dataAddress, setdataAddress] = useState([]);
  const [dataLading, setdataLading] = useState([]);

  const [IsAcctive, setIsAcctive] = useState(0);
  const [IsLoad, setIsLoad] = useState(false); // active input form when click button edit
  const [IsLoadWardTo, setIsLoadWardTo] = useState(false); // active input form when click button edit
  const [IsLoadDistrictTo, setIsLoadDistrictTo] = useState(false); // active input form when click button edit
  //#endregion KHAI BÁO CÁC BIẾN ACTION ĐỂ LOAD DATA LÊN FORM

  //#region KHAI BÁO CÁC BIẾN DISPLAY

  const [disable, setDisable] = useState(true); // disable button
  const [disablerecipient, setdisablerecipient] = useState(false); // disable button
  const [showinggtgt, setshowinggtgt] = useState(false); // display none div  gtgt
  const [showingdetail, setshowingdetail] = useState(false); // display none

  //#endregion KHAI BÁO CÁC BIẾN DISPLAY

  //#region KHAI BÁO CÁC BIẾN CHO FORM IN

  const [State, setState] = useState([]);
  const [DataPrint, setDataPrint] = useState([]);
  const [IsChecked, setIsChecked] = useState(false);
  const [sheetprint, bindsheetprint, setsheetprint] = useInput(2);
  const sheetprintRef = useRef();

  //#endregion KHAI BÁO CÁC BIẾN CHO FORM IN

  const [phoneReg, setPhoneReg] = useState("");
  const [phoneReg2, setPhoneReg2] = useState("");
  const [phoneReg3, setPhoneReg3] = useState("");


  //#endregion ********** KHAI BÁO CÁC BIẾN DỮ LIỆU **********

  //#region ********** USE EFFECT **********

  /* run after render */
  useEffect(() => {
    if (Customer === null || Customer === {}) {
      history.push("/");
    }
    APIC_spLadingGetMany();
    APIC_spServiceGetMany();
    setCityFrom(Customer?.City);
    ReadLadingDraft();
    //setIsChangeWard(1);
  }, []);

  //this for APIC_spServiceGetMany no run more time when click, is just one run
  useEffect(() => {
    IsRunservice === 1 ? APIC_spServiceGetMany() : Norun();
  }, [IsRunservice]);

  /* Chose item from select common province,district,ward*/

  const Norun = () => {
    console.log("No Run");
  };

  //#endregion ********** USE EFFECT **********

  //#region ********** THÔNG TIN ĐƠN HÀNG DANH SÁCH **********

  //#region HÀM GET DANH SÁCH VẬN ĐƠN MỚI TẠO

  //conveert date time for load list
  const convert = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  const APIC_spLadingGetMany = async () => {
    let today = new Date(),
      ToDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate(),
      FromDate = convert(today.setDate(today.getDate() - 7));

    let params = {
      AppAPIKey: APIKey,
      TokenDevices: TOKEN_DEVICE,
      LadingCode: "",
      FromDate: FromDate,
      ToDate: ToDate,
      CustomerID: Customer?.CustomerID,
      CustomerCode: Customer?.CustomerCode,
      Status: 9,
      Skip: 0,
      Take: 5000,
    };

    try {
      let prList = {
        Json: JSON.stringify(params),
        func: "APIC_spLadingGetManyJsonAuto",
        API_key: APIKey,
      };
      const data = await mainAction.API_spCallServer(prList, dispatch);
      setdataLading(data);
      //setDisable(false); // disable button
      setIsRunservice(1);
      mainAction.LOADING({ IsLoading: false }, dispatch);
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      //setDisable(false); // disable button
    }
  };

  //#endregion HÀM GET DANH SÁCH VẬN ĐƠN MỚI TẠO

  //#region HÀM XEM CHI TIẾT ĐƠN HÀNG
  const [DetailId, setDetailId] = useState(0);
  const GoToDetail = async (item) => {
    let LadingDetail = item._original;
    setDetailId(item._original.Id);
  };

  //#endregion HÀM XEM CHI TIẾT ĐƠN HÀNG

  //#region HÀM XÓA VẬN ĐƠN

  const APIC_spLadingRemove = async (item) => {
    let params = {
      AppAPIKey: APIKey,
      LadingId: parseInt(item._original.Id),
      CustomerId: Customer?.CustomerID,
      Notes: "KHÁCH HÀNG HỦY BILL TRÊN WEBSITE CUSTOMER",
    };
    try {
      const data = await Lading.APIC_spLadingRemove(params, dispatch);
      setdataLading(dataLading.filter((p) => p.Id !== item._original.Id));
      Alertsuccess(data);
      //APIC_spLadingGetMany();
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      //setDisable(false); // disable button
    }
  };

  //#endregion HÀM XÓA VẬN ĐƠN

  //#region HÀM DANH SÁCH VẬN ĐƠN

  const columns = [
    {
      Cell: (row) => (
        <div className="form-check" style={{ padding: "0 15px" }}>
          <label className="form-check-label" style={{ position: "unset" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id={row.original.Id}
              value={row.original.Id}
              checked={row.original.Checked}
              onChange={(e) => handleChange(row)}
            />
            <span className="form-check-sign" htmlFor={row.original.Id}>
              <span className="check"></span>
            </span>
          </label>
        </div>
      ),
      maxWidth: 40,
      textAlign: "center",
      filterable: false,
    },
    {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <span>
          <i
            className="fa fa-eye green button"
            data-toggle="modal"
            data-target="#modalDetail"
            onClick={() => GoToDetail(row)}
            title="Chi tiết"
          ></i>
          <i
            className="fa fa-edit yellow button"
            onClick={() => APIC_spLadingEdit(row)}
            title="Sửa"
          ></i>
          <i
            className="fa fa-trash red button"
            onClick={() =>
              window.confirm("Xác nhận xóa vận đơn " + row.Code + "?") &&
              APIC_spLadingRemove(row)
            }
            title="Xóa"
          ></i>
        </span>
      ),
      minWidth: 100,
      filterable: false,
    },
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
      filterable: false,
    },
    {
      Header: "Mã vận đơn",
      accessor: "Code",
      minWidth: 150,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Mã đối tác",
      accessor: "PartnerCode",
      minWidth: 150,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Thời gian gửi",
      accessor: "CreateDate",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Ước tính nhận",
      accessor: "DealineTime",
      Cell: (item) => <span>{FormatDateJson(item.value, 1)}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Người nhận",
      accessor: "RecipientName",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tỉnh đi",
      accessor: "CitySendCode",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tỉnh đến",
      accessor: "CityRecipientCode",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Dịch vụ",
      accessor: "ServiceName",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Trọng lượng",
      accessor: "Weight",
      Cell: (item) => <span>{FormatNumber(item.value)} (gram)</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Số kiện",
      accessor: "Number",
      Cell: (item) => <span>{FormatNumber(item.value)}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Số khối",
      accessor: "Mass",
      Cell: (item) => <span>{item.value} (cbm)</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Thu hộ",
      accessor: "COD",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Khai giá",
      accessor: "Insured",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Tổng tiền",
      accessor: "Amount",
      Cell: (item) => <span>{FormatMoney(item.value)} đ</span>,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
    {
      Header: "Hình thức thanh toán",
      accessor: "PaymentString",
      Filter: ({ filter, onChange }) => (
        <input
          onChange={(event) => onChange(event.target.value)}
          value={filter ? filter.value : ""}
          placeholder="Tìm kiếm ..."
          className="form-control"
        />
      ),
    },
  ];

  //#endregion HÀM DANH SÁCH VẬN ĐƠN

  //#region HÀM IN BILL
  const [pageprint, setpageprint] = useState([0, 1]);
  const [HtmlPrint, setHtmlPrint] = useState(null);
  const APIC_spLadingGetDataPrint = async () => {
    if (DataPrint.length === 0) {
      Alerterror("Vui lòng chọn vận đơn cần in");
      return;
    }

    //#region SET HTML PRINT
    await setHtmlPrint(
      DataPrint.map((item, index) => {
        return (
          <div>
            {pageprint.map((detail, idele) => {
              return (
                <div
                  key={index}
                  className="bill"
                  style={{
                    width: "710px",
                    height: "1050px",
                    pageBreakBefore: "always",
                    border: "2px solid #000",
                  }}
                >
                  {item.PaymentType === 1 && item.COD > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        opacity: 0.4,
                        marginTop: "35vh",
                        marginLeft: "20vw",
                        fontSize: "120px",
                        fontWeight: 600,
                        transform: "rotate(70deg)",
                        fontFamily: "Arial",
                      }}
                    >
                      COD-TTĐN
                    </div>
                  ) : null}
                  {item.PaymentType !== 1 && item.COD > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        opacity: 0.4,
                        marginTop: "35vh",
                        marginLeft: "30vw",
                        fontSize: "120px",
                        fontWeight: 600,
                        transform: "rotate(60deg)",
                        fontFamily: "Arial",
                      }}
                    >
                      COD
                    </div>
                  ) : null}
                  {item.PaymentType === 1 && item.COD === 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        opacity: 0.4,
                        marginTop: "35vh",
                        marginLeft: "30vw",
                        fontSize: "120px",
                        fontWeight: 600,
                        transform: "rotate(60deg)",
                        fontFamily: "Arial",
                      }}
                    >
                      TTĐN
                    </div>
                  ) : null}
                  <table
                    style={{
                      width: "100%",
                      fontWeight: "600",
                      borderBottom: "2px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: "180px", verticalAlign: "top" }}>
                          <img
                            src="/assets/img/logo-gtel.png"
                            style={{ width: "180px", height: "70px" }}
                          />
                        </td>
                        <td>
                          <div
                            style={{
                              width: "100%",
                              position: "relative",
                              display: "inline-block",
                              height: "40px",
                              marginBottom: "5px",
                            }}
                          >
                            <div>
                              <Barcode value={item.Code} height="35" />
                            </div>
                          </div>
                          <br />
                          <br />
                          <p>
                            BIÊN BẢN BÀN GIAO
                            <br />
                            (DELIVERY RECEIPTS)
                          </p>
                        </td>
                        <td
                          style={{
                            width: "160px",
                            verticalAlign: "top",
                            marginRight: "1px",
                          }}
                        >
                          <img
                            src="/assets/img/iso9001.jpg"
                            style={{ width: "160px", height: "70px" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      width: "100%",
                      borderBottom: "2px solid #ddd",
                    }}
                    cellspacing="0"
                    cellpadding="5"
                  >
                    <tbody>
                      <tr>
                        <td rowspan="2" style={{ borderRight: "1px solid #ddd" }}>
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>INFORMATION</b>
                          </div>
                        </td>
                        <td
                          style={{
                            borderBottom: "2px solid #ddd",
                            width: "350px",
                            borderRight: "1px solid #ddd",
                          }}
                        >
                          <b style={{ display: "inline-block", width: "250px" }}>
                            Ngày gửi hàng <i>(Date)</i>
                          </b>{": "}
                          {FormatDateJson(item.CreateDate, 1)}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            Số kiện <i>(Package)</i>
                          </b>{": "}
                          {FormatMoney(item.Number)}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            Nội dung hàng hóa <i>(Document,Goods)</i>
                          </b>
                          {": "}
                          {item.Description !== undefined ? item.Description : ""}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            Dịch vụ bưu chính <i>((Postal services)</i>
                          </b>
                          : <span>{item.ServiceName}</span>
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            Dịch vụ cộng thêm <i>(Extra services)</i>
                          </b>
                          :{" "}
                          {item.ServiceGTGTName !== undefined
                            ? item.ServiceGTGTName
                            : ""}
                          <br />
                        </td>
                        <td colspan="" style={{ borderBottom: "2px solid #ddd" }}>
                          <lbl
                            style={{ display: "inline-block", width: "225px" }}
                          >
                            {(item.Mass === 0 || item.Mass === undefined) ? "Trọng lượng" : "Khối lượng"}{" "}
                            <i>{(item.Mass === 0 || item.Mass === undefined) ? "(Weight)" : "(Mass)"}</i>
                          </lbl>
                          :{" "}
                          <b>
                            {(item.Mass === 0 || item.Mass === undefined)
                              ? FormatMoney(item.Weight)
                              : item.Mass}{" "}
                            {(item.Mass === 0 || item.Mass === undefined) ? "(gram)" : "(CBM)"}
                          </b>
                          <br />
                          <lbl
                            style={{ display: "inline-block", width: "225px" }}
                          >
                            HT thanh toán <i>(Payment)</i>
                          </lbl>
                          :{" "}
                          <b>
                            {item.PaymentString !== undefined
                              ? item.PaymentString
                              : "Khác"}
                          </b>
                          <br />
                          <lbl
                            style={{ display: "inline-block", width: "220px" }}
                          >
                            COD
                          </lbl>
                          : <b>{FormatMoney(item.COD)} đ</b>
                          <br />
                          <lbl
                            style={{ display: "inline-block", width: "220px" }}
                          >
                            Số tiền phải thu <i>(Total receivables)</i>
                          </lbl>
                          :{" "}
                          <b>
                            {FormatMoney(
                              item.PaymentType == 1 ? (item.COD + item.Amount) : item.COD
                            )}{" "}
                            đ
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" style={{ position: "relative" }}>
                          <b>
                            THÔNG TIN HÀNG HÓA <i>(PARCEL INFORMATION)</i>
                          </b>
                          : <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Mã sản phẩm <i>(Product Code)</i>
                          </b>
                          : {item.ProductCode ?? ""}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            <b>
                              - Tên sản phẩm <i>((Product Name)</i>
                            </b>
                          </b>
                          : {item.ProductName ?? ""}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Số lượng <i>(Number)</i>
                          </b>{": "}
                          {item.ProductQuanlity ?? ""}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Seri sản phẩm <i>(Product Seri)</i>
                          </b>
                          : <span>{item.ProductDes ?? ""}</span>
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4">
                          <u>
                            <b>* LƯU Ý GIAO (DELIVERY NOTE):</b>
                          </u>{" "}
                          <span>
                            {item.Noted !== undefined ? item.Noted : ""}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      width: "100%",
                      borderBottom: "2px solid #ddd",
                    }}
                    cellspacing="0"
                    cellpadding="5"
                  >
                    <tbody>
                      <tr>
                        <td style={{ borderRight: "1px solid #ddd" }}>
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>SENDER</b>
                          </div>
                        </td>
                        <td style={{ position: "relative" }}>
                          <b>THÔNG TIN NGƯỜI GỬI (SENDER INFORMATION)</b>: <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Mã khách hàng <i>(Customer code)</i>
                          </b>
                          : {item.CustomerCode}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Người gửi <i>(Sender's name)</i>
                          </b>
                          :{" "}
                          {item.CustomerName_Reality !== undefined
                            ? item.CustomerName_Reality
                            : item.CustomerName}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Điện thoại <i>(Phone)</i>
                          </b>
                          :{" "}
                          <span>
                            {item.CustomerPhone_Reality !== undefined
                              ? item.CustomerPhone_Reality
                              : item.CustomerPhone}
                          </span>
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Địa chỉ <i>(Address)</i>
                          </b>
                          :{" "}
                          {item.CustomerAddress_Reality !== undefined
                            ? item.CustomerAddress_Reality
                            : item.CustomerAddress}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Tỉnh/TP <i>(Province/City)</i>
                          </b>
                          : {item.CitySendCode}
                          <br />
                          <span
                            style={{
                              padding: "2px 10px",
                              fontWeight: "bold",
                              fontSize: "45px",
                              borderTop: "2px solid #000",
                              borderBottom: "2px solid #000",
                              borderLeft: "2px solid #000",
                              top: "-2px",
                              right: 0,
                              position: "absolute",
                            }}
                          >
                            {item.POCodeFrom}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      width: "100%",
                      borderBottom: "2px solid #ddd",
                    }}
                    cellspacing="0"
                    cellpadding="5"
                  >
                    <tbody>
                      <tr>
                        <td style={{ borderRight: "1px solid #ddd" }}>
                          <div
                            style={{
                              marginLeft: "--20px",
                              writingMode: "tb-rl",
                            }}
                          >
                            <b>RECEIVER</b>
                          </div>
                        </td>
                        <td style={{ position: "relative" }}>
                          <b>THÔNG TIN NGƯỜI NHẬN (RECEIVER'S INFORMATION)</b>:{" "}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Người nhận <i>(Recipient’s name)</i>
                          </b>
                          : {item.RecipientName}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Điện thoại <i>(Phone)</i>
                          </b>
                          : {item.RecipientPhone}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Công ty nhận <i>(Recipient’s company)</i>
                          </b>
                          :{" "}
                          <span>
                            {item.RecipientCompany !== undefined
                              ? item.RecipientCompany
                              : ""}
                          </span>
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Số nhà, đường <i>(No., Street)</i>
                          </b>
                          :{" "}
                          {item.Street !== undefined
                            ? item.Street
                            : item.RecipientAddress}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Phường/Xã <i>(Ward/Commune)</i>
                          </b>
                          : {item.Wards}
                          <br />
                          <b style={{ display: "inline-block", width: "250px" }}>
                            - Quận/Huyện <i>(District)</i>
                          </b>
                          : {item.District}
                          <br />
                          <b style={{ display: "inline-block", width: "255px" }}>
                            - Tỉnh/TP <i>(Province/City)</i>
                          </b>
                          : {item.CityRecipientCode}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table style={{
                    width: "100%", borderBottom: "2px solid #ddd",
                    textAlign: "center",
                    fontWeight: "bold", fontSize: "45px",
                  }}
                    cellspacing="0"
                    cellpadding="5">
                    <tbody><tr><td>{item.LocationTo}</td></tr></tbody>
                  </table>
                  <table
                    style={{ width: "100%" }}
                    cellspacing="0"
                    cellpadding="5"
                  >
                    <tbody>
                      <tr>
                        <td colspan="2">
                          Bên nhận hàng xác nhận Bên giao hàng đã giao cho Bên
                          nhận hàng đúng, đủ nội dung như trên/
                          <br />
                          The consigneee confirms that the Delivery company has
                          delivered to the consignee the correct and sufficient
                          content as above.
                          <br />
                          Bên bản được lập thành 02 bản, mỗi bên giữ 01 bản có giá
                          trị như nhau/
                          <br />
                          The Delivery record are made into 02 copies, each party
                          keeps 01 copy with the same value.
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
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        );
      })
    );
    //#endregion SET HTML PRINT

    //#region Khởi tạo form in
    let _timeout = 1000;
    if (DataPrint.length > 100 && DataPrint.length < 200) _timeout = 2000;
    else if (DataPrint.length > 200) _timeout = 3000;
    let html = $("#barcodeTarget").html();
    html += `<script type="text/javascript">window.focus();setTimeout(function(){window.print();window.close();},${_timeout});</script>`;
    var myWindow = window.open("", "_blank");
    myWindow.document.write(
      '<html><head></head><body style="margin:0">' + html + "</body></html>"
    );
    //#endregion Khởi tạo form in
  };

  const ChangeSheetPrint = (event) => {
    const sheetNumber = event.target.value;
    let db = [];
    setpageprint([]);
    if (sheetNumber !== "" && sheetNumber !== "0") {
      //setshowpage(sheetNumber);
      setsheetprint(sheetNumber);
      for (var i = 0; i < parseInt(sheetNumber); i++) {
        db.push(i);
      }
      setpageprint(db);
    }
  };

  const handleChange = (row) => {
    dataLading.find((p) => p.Id == row.original.Id).Checked =
      row.original.Checked == false ? true : false;
    setState({ list: dataLading });
    setDataPrint(dataLading.filter((p) => p.Checked === true));
  };

  const handleCheckAll = (e) => {
    let allChecked = IsChecked;
    setIsChecked(!IsChecked);
    dataLading.forEach((item) => {
      item.Checked = e.target.checked;
    });
    setState({ list: dataLading });
    setDataPrint(dataLading.filter((p) => p.Checked === true));
  };
  //#endregion HÀM IN BILL

  //#endregion ********** THÔNG TIN ĐƠN HÀNG DANH SÁCH *********

  //#region ********** FORM TẠO ĐƠN HÀNG **********

  //#region HÀM VALIDATE CÁC GIÁ TRỊ NHẬP VÀO

  const RegPhone = (e, key) => {
    // setTimeout(function(){
    let result = ValidPhone(e);
    if (key == 1) {
      setPhoneReg(result);
      setSenderPhone(e);
      // if (result === "form-error"){
      //     SenderPhoneRef.current.focus();
      // }
    } else if (key == 2) {
      setPhoneReg2(result);
      setSenderPhone(e);
    } else {
      setPhoneReg3(result);
      setRecipientPhone(e);
    }

    // },1000
    //     )
  };

  //#endregion HÀM VALIDATE CÁC GIÁ TRỊ NHẬP VÀO

  //#region HÀM CLEAR FORM KHI CLICK LÀM MỚI VÀ SAU KHI SAVE VẬN ĐƠN

  const Clearform = async () => {
    setLadingCode("");
    onChooseProvinceTo({});
    // onChooseProvinceTo({ value: 0, label:'Chọn tỉnh thành'})
    onChooseDistrictTo({});
    onChooseWardTo({});
    setTitle("TẠO ĐƠN HÀNG");
    APIC_spServiceGetMany();
    setNumberCoCheck(0);
    setSupperMarket("0");
    setPhuQuocIsLand("0");
    setIsNumberCoCheck(0);
    setIsHD(0);
    //Sender
    setLadingId(0);
    setServiceID(33);
    setServiceName("Chuyển phát nhanh");
    IsLoadDistrictTo === false
      ? setIsLoadDistrictTo(true)
      : setIsLoadDistrictTo(false);
    IsLoadWardTo === false ? setIsLoadWardTo(true) : setIsLoadWardTo(false);

    setRecipientPhone("");
    setCityTo(0);
    setWardTo(0);
    setRecipientAddress("");
    setRecipientAddressOld("");
    setRecipientName("");
    setDistrictTo(0);
    setRecipientStreet("");
    setRecipientCompany("");
    //goods
    setDescription("");
    setParnerCode("");
    setWeight("");
    setWidth("");
    setNoted("");
    setNumberItem("1");
    setHeight("");
    setLength("");
    setMass("");
    //collecting money
    setCod("");
    setCODPrice("");
    setInsured("");
    setInsuredPrice("");
    //service
    //setPaymentType("");
    //setServiceGTGTs("");
    //info product
    setProductCode("");
    setProductName("");
    setProductQuality("");
    setProductDes("");
    //Amount
    setAmount("");
    setDealine("");
    //info Detail
    setPPXDPrice("");
    setPriceMain("");
    setTHBBPrice("");
    setHDPrice("");
    setHD(0);
    setPTTPrice("");
    setVATPrice("");
    setBPPrice("");
    setNPDKPrice("");
    setHQKPrice("");
    setServiceGTGTId("");
    setServiceGTGTName("");
    setOnloadSender(1);
    setOnLoadRecipient(1);
    setLat(0);
    setLng(0);
  };

  //#endregion HÀM CLEAR FORM KHI CLICK LÀM MỚI VÀ SAU KHI SAVE VẬN ĐƠN

  //#region HÀM LOAD DATA CHÍNH SHOW LÊN FORM TẠO ĐƠN HÀNG

  //#region Hàm load dịch vụ GTGT
  const APIC_spServiceGetMany = async () => {
    let params1 = {
      AppAPIKey: APIKey,
      Type: 1,
    };
    const dataGTGT = await Service.APIC_spServiceGetMany(params1, dispatch); // this is service GTGT
    let arrGTGT = [];
    dataGTGT.map((item, index) => {
      item.checkboxGTGT = false;
      arrGTGT.push(item);
    });
    setServiceGTGT(arrGTGT);
    setIsRunservice(0);
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };
  //#endregion Hàm load dịch vụ GTGT

  //#region Hàm load thông tin vận đơn nháp

  const ReadLadingDraft = async () => {
    let editStr = localStorage.getItem("LadingEdit");
    let draftStr = localStorage.getItem("LadingDraft");
    if (editStr !== null && editStr !== undefined && editStr !== "") {
      Clearform();
      let ladingEdit = JSON.parse(editStr);
      APIC_spLadingEdit({ _original: { Id: ladingEdit.Id } });
      localStorage.setItem("LadingEdit", "");
    } else if (draftStr !== "" && draftStr !== undefined) {
      let draft = JSON.parse(draftStr);
      if (draft?.AddressFromId !== undefined) {
        onSelectSender({ value: draft.AddressFromId, label: draft.AddressFrom, obj: draft.objFrom });
        setShowSender(" show active");
      }
      else if (draft?.AddressToId !== undefined) {
        onSelectRecipient({ value: draft.AddressToId, label: draft.AddressTo, obj: draft.objTo });
        setShowReceipient(" show active");
      }
      else { //Mở từ form ước tính cước phí
        onChooseProvinceFrom({ value: parseInt(draft?.CityFrom), label: draft?.CityFromName });
        onChooseDistrictFrom({ value: parseInt(draft?.DistrictFrom), label: draft?.DistrictFromName });
        onChooseWardFrom({ value: 0, label: "" });
        setSenderStreet("");
        setSenderName("");
        setSenderPhone("");
        setSenderAddress(draft?.DistrictFromName + ", " + draft?.CityFromName);
        onChooseProvinceTo({ value: parseInt(draft?.CityTo), label: draft?.CityToName });
        onChooseDistrictTo({ value: parseInt(draft?.DistrictTo), label: draft?.DistrictToName });
        onChooseWardTo({ value: parseInt(draft?.WardTo), label: draft?.WardToName });
        setRecipientStreet("");
        setRecipientPhone("");
        setRecipientName("");
        setRecipientCompany("");
        setRecipientAddress(draft?.WardToName + ", " + draft?.DistrictToName + ", " + draft?.CityToName);
        changeServiceId({ value: draft?.ServiceID, label: draft?.ServiceName });
        setServiceID(draft?.ServiceID);
        setServiceName(draft?.ServiceName);
        setWeight(draft?.Weight);
        setIsChangeWard(1);
        setIsChangePriceMain(1);
        setShowSender(" show active");
        setShowReceipient(" show active");
      }
      localStorage.setItem("LadingDraft", "");
    } else {
      changeServiceId({ value: 33, label: "Chuyển phát nhanh" });
      setServiceID(33);
      setServiceName("Chuyển phát nhanh");
      /* onSelectRecipient({
        value: 0,
        label: "Chọn địa chỉ",
        obj: {
          Name: "",
          Phone: "",
          CityId: 0,
          City: "Chọn tỉnh thành",
          DistrictId: 0,
          District: "Chọn quận huyện",
          WardId: 0,
          Ward: "Chọn phường xã",
          Street: "",
          Address: "",
          Company: ""
        }
      }); */
    }
  };
  //#endregion Hàm load thông tin vận đơn nháp

  //#endregion HÀM LOAD DATA CHÍNH SHOW LÊN FORM TẠO ĐƠN HÀNG

  //#region XỬ LÝ TRÊN FROM TẠO ĐƠN HÀNG

  //#region Chọn địa chỉ gửi
  const onSelectSender = async (item) => {
    setSenderMeno(item);
    setSenderName(item.obj.NameSend);
    setSenderPhone(item.obj.PhoneSend);
    onChooseProvinceFrom({ value: item.obj.CityId, label: item.obj.CityName,Code_Local:item.obj.Code_Local });
    onChooseDistrictFrom({
      value: item.obj.DistrictiId,
      label: item.obj.DistrictyName,
    });
    onChooseWardFrom({
      value: item.obj.WarId,
      label: item.obj.WarName,
    });

    setSenderStreet(item.obj.Street_Number);
    setSenderAddress(item.obj.AddressFull);

    setIsChangePriceMain(1);
  };

  const changeStreetFrom = (e) => {
    setSenderStreet(e);
    setSenderAddress(e + ", " + WardFromName + ", " + DistrictFromName + ", " + CityFromName);
  };

  //#endregion Chọn địa chỉ gửi

  //#region Chọn địa chỉ nhận
  const [StreetSlect, setStreetSelect] = useState(0);
  const onSelectRecipient = async (item) => {
    //active select
    setRecipientId(item.value);
    setRecipientMeno(item);
    onChooseProvinceTo({ value: item.obj.CityId, label: item.obj.City });
    onChooseDistrictTo({ value: item.obj.DistrictId, label: item.obj.District });
    onChooseWardTo({ value: item.obj.WardId, label: item.obj.Ward });

    setRecipientStreet(item.obj.Street);
    setRecipientPhone(item.obj.Phone);
    setRecipientName(item.obj.Name);
    setRecipientCompany(item.obj.Company);
    setRecipientAddress(item.obj.Address);
    setRecipientAddressOld(item.obj.Address);
    setLat(item.obj.Lat);
    setLng(item.obj.Lng);

    setStreetSelect(item.obj.Street);

    setIsChangePriceMain(1);
    setShowReceipient(" show active");
    RecipientAddressRef.current.focus();

    CPN_spLocationCheckCustomer(GetCookie("CustomerID"), item.obj.WardId, 0);// Check phần trăm ngoại tuyến
    CPN_spManagerAddress_Check();
  };

  const onSelectedRecipient = (item) => {
    setIsAcctiveRecipient(0);
    if (item != 0) {
      let data = ListDataRecipient.filter(a => a.AddressSetUpId === item)[0];
      if (data != undefined) {
        setRecipientId(data.Id);
        setAddressSetupId(item);
        setLat(data.Lat);
        setLng(data.Lng);
        setDistrictTo(data.DistrictId);
        setDistrictToName(data.District)
        setWardTo(data.WardId);
        setWardToName(data.Ward);
        setCityTo(data.CityId);
        setCityToName(data.CityName);
        setRecipientPhone(data.Phone == undefined ? RecipientPhone : data.Phone);
        setRecipientName(data.Name == undefined ? RecipientName : data.Name);
        setRecipientCompany(data.Company == undefined ? RecipientCompany : data.Company);
        setRecipientStreet(data.Street);
        setRecipientAddress(data.Address);
        CPN_spLocationCheckCustomer(GetCookie("CustomerID"), data.WardId, 0);// Check phần trăm ngoại tuyến
        CPN_spManagerAddress_Check();
      }
    }
  }

  //#endregion Chọn địa chỉ nhận

  //#region Chọn phường xã, quận huyện, tỉnh thành
  const [CityCode, setCityCode] = useState("");
  const [DistrictCode, setDistrictCode] = useState("");
  const [WardCode, setWardCode] = useState("");

  const [CityCodeTo, setCityCodeTo] = useState("");
  const [DistrictCodeTo, setDistrictCodeTo] = useState("");
  const [WardCodeTo, setWardCodeTo] = useState("");

  const onChooseProvinceFrom = (item) => {
    setCityFromName(item.label);
    setCityFrom(item.value);
    setSenderAddress(
      RecipientStreet + ", " +
      item.label
    );
    setCityCode(item.Code_Local);
  };
  const onChooseDistrictFrom = (item) => {
    setDistrictFromName(item.label);
    setDistrictFrom(item.value);
    setSenderAddress(
      RecipientStreet + ", " +
      item.label + ", " +
      CityFromName
    );
    setDistrictCode(item.code);
  };

  const onChooseWardFrom = (item) => {
    setWardFromName(item.label);
    setWardFrom(item.value);
    setSenderAddress(
      RecipientStreet + ", " +
      item.label + ", " +
      DistrictFromName + ", " +
      CityFromName
    );
    setWardCode(item.code);
  };
  //
  const onChooseProvinceTo = (item) => {
    setCityToName(item.label);
    setCityTo(item.value);
    setRecipientAddress(RecipientStreet + ", " + item.label);
    setCityCodeTo(item.Code_Local);
  };
  const onChooseDistrictTo = (item) => {
    setDistrictToName(item.label);
    setDistrictTo(item.value);
    setRecipientAddress(
      RecipientStreet + ", " +
      (item.label) + ", " +
      CityToName
    );
    setIsChangeWard(0);
    setDistrictCodeTo(item.code);
  };
  const [StreetList, setStreetList] = useState([]);
  const onChooseWardTo = async (item) => {
    setWardToName(item.label);
    setWardTo(item.value);
    setIsChangeWard(1); // Để gọi useEffect tính ngoại tuyến

    setRecipientAddress(
      RecipientStreet + ", " +
      item.label + ", " +
      DistrictToName + ", " +
      CityToName
    );
    setWardCodeTo(item.code);
  };

  //#endregion  Chọn phường xã, quận huyện, tỉnh thành

  //#region Chọn dịch vụ chính
  const [IsWeight, setIsWeight] = useState(false);
  const changeServiceId = (item) => {
    if (item.label.indexOf("theo khối") !== -1) {
      setIsWeight(true);
      setWeight(0);
    }
    else {
      setIsWeight(false);
      setMass(0);
    }
    setServiceName(item.label);
    setServiceID(item.value);
    setIsChangePriceMain(1);
  };

  //#endregion Chọn dịch vụ chính

  //#region Chọn hình thức thanh toán

  const changePaymentType = (item) => {
    setPaymentType(item.target.value); // set values for save
    setPaymentTypeCode(item.target.attributes.code.value);
  };

  //#endregion Chọn hình thức thanh toán

  //#region Chọn dịch vụ GTGT

  const onChooseServiceGTGT = (item, element) => {
    if (element.target.checked === true) {
      setServiceGTGTId(ServiceGTGTId + element.target.value + ";");
      setServiceGTGTName(ServiceGTGTName + item.ServiceCode + ";");
      ServiceGTGT.find(
        (e) => parseInt(e.ServiceID) == parseInt(element.target.value)
      ).checkboxGTGT = true;
    } else {
      let a = (";" + ServiceGTGTId + ";")
        .replaceAll(";", ";;")
        .replaceAll(";" + element.target.value + ";", "")
        .replaceAll(";;", ";");
      let b = (";" + ServiceGTGTName + ";")
        .replaceAll(";", ";;")
        .replaceAll(";" + item.ServiceCode + ";", "")
        .replaceAll(";;", ";");
      setServiceGTGTId(a.substring(1, a.length));
      setServiceGTGTName(b.substring(1, b.length));
      ServiceGTGT.find(
        (e) => parseInt(e.ServiceID) == parseInt(element.target.value)
      ).checkboxGTGT = false;
    }
    if (parseInt(element.target.value) === 7 && element.target.checked === true)
      setIsHD(1);
    else if (
      parseInt(element.target.value) === 7 &&
      element.target.checked === false
    )
      setIsHD(0);

    if (parseInt(element.target.value) === 9 && element.target.checked === true)
      setIsNumberCoCheck(1);
    else if (
      parseInt(element.target.value) === 9 &&
      element.target.checked === false
    )
      setIsNumberCoCheck(0);

    if (
      parseInt(element.target.value) === 13 &&
      element.target.checked === true
    )
      setSupperMarket(1);
    else if (
      parseInt(element.target.value) === 13 &&
      element.target.checked === false
    )
      setSupperMarket(0);

    if (
      parseInt(element.target.value) === 14 &&
      element.target.checked === true
    )
      setPhuQuocIsLand(1);
    else if (
      parseInt(element.target.value) === 14 &&
      element.target.checked === false
    )
      setPhuQuocIsLand(0);

    setIsChangeVatPpxd(1);
  };

  //#endregion Chọn dịch vụ GTGT

  //#region Hàm save lading

  const SaveLading = async () => {
    //#region VALIDATE FUNCTION BEFORE SAVE
    if (Customer?.Verification !== 1 && Customer?.Type === 2) {
      Alerterror("Vui lòng xác thực tài khoản trước khi tạo đơn hàng");
      return
    }
    if (SenderName == "") {
      Alerterror("Nhập tên người gửi");
      SenderNameRef.current.focus();
      return;
    }
    if (SenderPhone === "") {
      Alerterror("Nhập số điện thoại người gửi");
      SenderPhoneRef.current.focus();
      return;
    }
    if (SenderPhone.length < 8) {
      Alerterror("Kiểm tra SĐT người gửi");
      SenderPhoneRef.current.focus();
      return;
    }
    if (CityFrom === 0) {
      Alerterror("Chọn tỉnh thành người gửi");
      return;
    }
    if (
      DistrictFrom === 0 ||
      DistrictFrom == undefined
    ) {
      Alerterror("Chọn quận huyện người gửi");
      return;
    }
    if (SenderAddress == "") {
      Alerterror("Nhập địa chỉ người gửi thực tế");
      SenderAddressRef.current.focus();
      return;
    }
    //
    if (RecipientName === "") {
      Alerterror("Nhập tên người nhận");
      RecipientNameRef.current.focus();
      return;
    }
    if (RecipientPhone === "") {
      Alerterror("Nhập số điện thoại người nhận");
      RecipientPhoneRef.current.focus();
      return;
    }
    if (RecipientPhone.length < 8) {
      Alerterror("Nhập SĐT người nhận");
      RecipientPhoneRef.current.focus();
      return;
    }
    if (
      CityTo === 0 ||
      CityTo === undefined
    ) {
      Alerterror("Chọn tỉnh/thành người nhận");
      return;
    }
    if (
      DistrictTo === 0 ||
      DistrictTo === undefined
    ) {
      Alerterror("Chọn quận/huyện người nhận");
      return;
    }
    if (
      WardTo === 0 ||
      WardTo === undefined
    ) {
      Alerterror("Chọn phường/xã người nhận");
      return;
    }
    if (RecipientStreet === "") {
      Alerterror("Nhập số nhà/đường người nhận");
      RecipientStreetRef.current.focus();
      return;
    }
    if (Description === "") {
      Alerterror("Nhập nội dung hàng hóa");
      DescriptionRef.current.focus();
      return;
    }
    if ((Weight === "" || Weight === "0") && IsWeight === false) {
      Alerterror("Nhập trọng lượng hàng hóa");
      WeightRef.current.focus();
      return;
    }
    if ((Mass === "" || Mass === "0") && IsWeight === true) {
      Alerterror("Nhập khối lượng hàng hóa");
      MassRef.current.focus();
      return;
    }
    if (NumberItem < 1 || NumberItem === "") {
      Alerterror("Nhập Số kiện !");
      NumberItemRef.current.focus();
      return;
    }
    if (ServiceID === 0) {
      Alerterror("Chọn dịch vụ");
      return;
    }
    if (IsHD === 1 && (HD === 0 || HD === "")) {
      Alerterror("Nhập số lượng hóa đơn");
      HDRef.current.focus();
      return;
    }
    if (NPDKPrice === 1 && (NumberCoCheck === 0 || NumberCoCheck === "")) {
      Alerterror("Nhập số lượng đồng kiểm");
      NumberCoCheckRef.current.focus();
      return;
    }
    let GetLat = Lat, GetLng = Lng, RecipientIdNew = RecipientId;
    /* if (Lat === 0 || Lng === 0 || Lat === "" || Lng === "" || Lat === "0" || Lng === "0"
      || ((LadingId > 0 && RecipientAddress !== RecipientAddressOld))) {
      const res = await GetLatLngGoogle(RecipientAddress)
      if (res) {
        GetLat = res[0].lat
        GetLng = res[0].lng
      }
      RecipientIdNew = 0;
    } */

    //#endregion VALIDATE FUNCTION BEFORE SAVE

    //#region Lưu mã địa chỉ
    await CPN_spManagerAddress_Check();
    //#endregion

    //#region SET PARAMETER
    setDisable(true); // disable button
    let pr = await {
      // TokenDevices:TOKEN_DEVICE,
      Id: LadingId,
      Code: LadingCode,
      Partnercode: ParnerCode,
      SenderId: Customer?.CustomerID,
      CustomerCode: Customer?.CustomerCode,
      CustomerName: Customer?.CustomerName,
      CustomerPhone: Customer?.Phone,
      CustomerAddress: Customer?.Address,
      CustomerCompany: Customer?.Company,
      AddressSetupId: AddressSetupId, // Thêm mới địa chỉ định vị
      CitySendId: CityFrom,
      CitySendCode: CityFromName,
      DistrictID_From: DistrictFrom,
      DistrictName_From: DistrictFromName,
      WardID_From: WardFrom,
      WardName_From: WardFromName,
      Street_From: SenderStreet,
      CustomerName_Reality: SenderName,
      CustomerAddress_Reality: SenderAddress,
      CustomerPhone_Reality: SenderPhone,
      RecipientId: RecipientIdNew,
      RecipientName: RecipientName,
      RecipientPhone: RecipientPhone,
      RecipientAddress: RecipientAddress,
      RecipientCompany: RecipientCompany,
      Street: RecipientStreet,
      CityRecipientId: CityTo,
      CityRecipientCode: CityToName,
      DistrictID_To: DistrictTo,
      District: DistrictToName,
      WardId: WardTo,
      Wards: WardToName,
      ServiceId: ServiceID,
      ServiceName: ServiceName,
      ServiceGTGTId: AnotherPriceSave.ListServiceGTGTId,
      ServiceGTGTName: AnotherPriceSave.ListServiceGTGTName,
      PaymentType: PaymentType,
      PaymentTypeName: PaymentTypeCode,
      COD: parseFloat(Cod.toString().replaceAll(",", "")),
      CODPrice: parseFloat(AnotherPriceSave.CODMoney),
      PackId: 0, ////
      PackPrice: 0, /////
      PercentHD: HD, //////////
      HDPrice: AnotherPriceSave.HDMoney,
      Insured: parseFloat(Insured.toString().replaceAll(",", "")),
      InsuredPrice: AnotherPriceSave.HHKGMoney,
      PercentPDK: NumberCoCheck,
      NPDKPrice: AnotherPriceSave.NPDKMoney,
      PSTPrice: AnotherPriceSave.PSTMoney,
      PDPQPrice: AnotherPriceSave.PDPQMoney,
      PTTPrice: AnotherPriceSave.PTTMoney,
      HQKPrice: AnotherPriceSave.HQKMoney,
      THBBPrice: AnotherPriceSave.THBBMoney,
      BPPrice: AnotherPriceSave.BPMoney,
      IsBP: IsDelivery,
      IsTHBB: IsProtocol,
      Weight: parseFloat(Weight.toString().replaceAll(".", "")),
      Number: parseFloat(NumberItem.toString().replaceAll(".", "")),
      Length: parseFloat(Length.toString().replaceAll(".", "")),
      Height: parseFloat(Height.toString().replaceAll(".", "")),
      Width: parseFloat(Width.toString().replaceAll(".", "")),
      Mass: parseFloat(Mass.toString()),
      Noted: Noted,
      Description: Description,
      OnSiteDeliveryPrice: OutlineSave.OnSiteDeliveryPrice,
      OnSiteDeliveryMoney: OutlineSave.OnSiteDeliveryPriceMoney,
      Discount: 0,
      DiscountMoney: 0,
      PriceMain: AnotherPriceSave.PriceMain,
      Allowance: 0,
      PPXDPercent: 0,
      PPXDMoney: AnotherPriceSave.PPXDMoney,
      PPXDPercent: AnotherPriceSave.PPXDPercent,
      IsPPXD: 1,
      VATPercent: AnotherPriceSave.VATPercent,
      VATMoney: AnotherPriceSave.VATMoney,
      TotalMoney: AnotherPriceSave.Amount,
      IsVAT: 1,
      Amount: AnotherPriceSave.Amount,
      TypeLading: 9,
      DealineTime: AnotherPriceSave.DealineTime,
      Status: 9,
      IsSaveSender: IsSaveSender,
      ProductCode: ProductCode,
      ProductName: ProductName,
      ProductDescription: ProductDes,
      Quanlity: ProductQuality,
      Lat_Recipient: GetLat,
      Lng_Recipient: GetLng,
    };
    //#endregion SET PARAMETER

    console.log(1)

    //#region GỌI HÀM SAVE
    try {
    const result = await mainAction.API_spCallServer(
      "CPN_spLading_Save_V2",
      pr,
      dispatch
    );
      Alertsuccess("Thành công");
      Clearform();
      APIC_spLadingGetMany();
      setOnloadSender(1);
      setOnLoadRecipient(1);
      //Gọi send notify
      if ((pr.Id ?? 0) === 0) { //Kiểm tra nếu thêm mới thì gửi notify
        const NotifiParam = {
          Json: JSON.stringify({
            CustomerId: parseInt(Customer?.CustomerID),
            FuncSend: "LadingCreate",
            SendFrom: "WEB CUSTOMER",
            JsonData: [
              {
                LadingCode: result.LadingCode,
                TotalLading: 1,
              },
            ],
          }),
          func: "APIC_spSendNotification",
          API_key: APIKey,
        };
        const resultNotify = await mainAction.API_spCallServer(
          NotifiParam,
          dispatch
        );
      }
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      setDisable(false); // disable button
    }
    //#endregion GỌI HÀM SAVE
  };

  //#endregion Hàm save lading

  //#region Load thông tin đơn hàng để sửa

  const APIC_spLadingEdit = async (row) => {
    try {
      //Lấy thông tin vận đơn
      let pr = {
        Json: "{\"LadingId\":" + row._original.Id + ",\"CustomerID\":" + Customer?.CustomerID + "}",
        func: "APIC_spLading_Find",
        API_key: APIKey,
        TokenDevices: TOKEN_DEVICE,
      };
      const result = await mainAction.API_spCallServer(pr, dispatch);
      let data = result.Detail[0];
      setshowingdetail(true); // open detail view
      setdisablerecipient();
      setIsAcctive(1);
      setLadingId(data.Id);
      setLadingCode(data.Code);

      setOnSiteDeliveryPrice(data.OnSiteDeliveryPrice);
      setOnSiteDeliveryPriceMoney(data.OnSiteDeliveryMoney);

      //#region SHOW THÔNG TIN DỊCH VỤ
      setServiceID(data.ServiceId); // active service
      setServiceName(data.ServiceName); // active service

      //HÌNH THỨC THANH TOÁN
      setPaymentType(data.PaymentType);
      setPaymentTypeCode(data.PaymentString);

      //checked box service
      setshowinggtgt(true); // onpen part
      setServiceGTGTId(data.ServiceGTGTId);
      setServiceGTGTName(data.ServiceGTGTName);
      if (data.ServiceGTGTId !== "" && data.ServiceGTGTId !== null) {
        let arr = data.ServiceGTGTId.substring(
          0,
          data.ServiceGTGTId.length - 1
        ).split(";");
        //bỏ chọn tất cả dv gtgt
        ServiceGTGT.filter(i => arr.indexOf(i.ServiceID) === -1).checkboxGTGT = false;

        // check chọn dv gtgt
        arr.forEach((element) => {
          ServiceGTGT.filter(i => i.ServiceID === parseInt(element)).checkboxGTGT = true;
          if (parseInt(element) === 7) {
            setIsHD(1);
            setHD(data.PercentHD);
          }
          if (parseInt(element) === 9) {
            setIsNumberCoCheck(1);
            setNumberCoCheck(data.NumberCoCheck);
          }
          if (parseInt(element) === 13) setSupperMarket(1);
          if (parseInt(element) === 14) setPhuQuocIsLand(1);
        });
      }

      //#endregion SHOW THÔNG TIN DỊCH VỤ

      //#region SHOW THÔNG TIN SẢN PHẨM

      setProductCode(data.ProductCode);
      setProductName(data.ProductName);
      setProductQuality(data.ProductNum);
      setProductDes(data.ProductDesc);

      //#endregion SHOW THÔNG TIN SẢN PHẨM

      //#region THÔNG TIN ĐƠN HÀNG

      setDescription(data.Description);
      setParnerCode(data.PartnerCode);
      setWeight(data.Weight ?? 0);
      setWidth(data.Width ?? 0);
      setNoted(data.Noted);
      setNumberItem(data.Number ?? 1);
      setHeight(data.Height ?? 0);
      setLength(data.Length ?? 0);
      setMass(data.Mass ?? 0);
      setDealine(FormatDateJson(data.DealineTime));

      //#endregion THÔNG TIN ĐƠN HÀNG

      //#region SHOW THÔNG TIN CƯỚC PHÍ

      // 4 CỘT NHẬP ĐẶC BIỆT

      //collecting money
      setCod(data.COD ?? 0);
      setCODPrice(data.CODPrice ?? 0);
      setInsured(data.Insured ?? 0);
      setInsuredPrice(data.InsuredPrice ?? 0);

      setAmount(data.Amount ?? 0);
      setPriceMain(data.PriceMain ?? 0);
      setVATPrice(data.VATMoney ?? 0);
      setPPXDPrice(data.PDPQPrice ?? 0);

      //#endregion SHOW THÔNG TIN CƯỚC PHÍ

      //#region THÔNG TIN NGƯỜI GỬI
      onSelectSender({
        value: 0,
        label: data.CustomerName_Reality + " - " + data.CustomerPhone_Reality + " - " + data.CustomerAddress_Reality,
        obj: {
          NameSend: data.CustomerName_Reality,
          PhoneSend: data.CustomerPhone_Reality,
          CityId: parseInt(data.CitySendId),
          CityName: data.CitySendCode,
          DistrictiId: parseInt(data.DistrictID_Fom),
          DistrictyName: data.DistrictName_From,
          WarId: parseInt(data.WardId_From),
          WarName: data.WardName_From,
          Street_Number: data.CustomerAddress_Reality.replaceAll(", " + data.WardName_From + ", ", "").replaceAll(data.DistrictName_From + ", ", "").replaceAll(data.CitySendCode, ""),
          AddressFull: data.CustomerAddress_Reality
        }
      });

      //#endregion

      //#region THÔNG TIN NGƯỜI NHẬN

      onSelectRecipient({
        value: data.RecipientId,
        label: data.RecipientName + " - " + data.RecipientPhone + " - " + data.RecipientAddress,
        obj: {
          Name: data.RecipientName,
          Phone: data.RecipientPhone,
          CityId: parseInt(data.CityRecipientId),
          City: data.CityRecipientCode,
          DistrictId: parseInt(data.DistrictID_To),
          District: data.District,
          WardId: parseInt(data.WardId),
          Ward: data.Wards,
          Street: data.Street,
          Address: data.RecipientAddress,
          Company: data.RecipientCompany,
          Lat: data.Lat_Recipient,
          Lng: data.Lng_Recipient
        }
      });
      setLat(data.Lat_Recipient);
      setLng(data.Lng_Recipient);

      //#endregion THÔNG TIN NGƯỜI NHẬN

      setTitle("SỬA THÔNG TIN ĐƠN HÀNG");

      setIsChangePriceMain(1);
      setIsChangeVatPpxd(1);

      setShowCreateTab("show active");
      setShowListTab("");
    } catch (err) {
      setTitle("TẠO ĐƠN HÀNG");
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
      setDisable(false); // disable button
    }
  };

  //#endregion Load thông tin đơn hàng để sửa

  //#endregion XỬ LÝ TRÊN FROM TẠO ĐƠN HÀNG

  //#region Search theo địa chỉ hoặc sdt nhân
  const [IsAcctiveRecipient, setIsAcctiveRecipient] = useState(0);
  const [ListDataRecipient, setListDataRecipient] = useState([]);
  const [ListRecipientPhone, setListRecipientPhone] = useState([]);
  const [ListDataaddress, setListDataaddress] = useState([]);
  const [IsAcctivePhone, setIsAcctivePhone] = useState(0)

  const onClickSelectRecipient = (e) => {
    setRecipientAddress(e.target.value);
    setIsAcctiveRecipient(1);

    if (e.target.value.length >= 4) {
      CPN_spRecipientAddress_Like(e.target.value.trim(), 1) // 1 search ở ô địa chỉ
    }
    else {
      if (e.target.value.length === 0) {
        let ListRecipientAddress = JSON.parse(localStorage.getItem("ListRecipientAddress"))
        setListDataRecipient(ListRecipientAddress);
      } else {
        let local = localStorage.getItem("ListRecipientAddress")
        if (local != "") {
          let ListRecipientAddress = JSON.parse(local)
          let found = [];

          for (let i = 0; i < ListRecipientAddress?.length; i++) {
            if (RemoveAccents(ListRecipientAddress[i]['Address']).toLowerCase().includes(RemoveAccents(e.target.value.toLowerCase()))) {
              found.unshift(ListRecipientAddress[i]);
            }
          }
          setListDataRecipient(found);

        }
      }
    }
  }

  const CPN_spRecipientAddress_Like = async (data, key) => {
    setDisable(false);
    const pr = {
      DataLike: data,
      CustomerId: GetCookie("CustomerID")
    }
    const params = {
      Json: JSON.stringify(pr),
      func: "CPN_spRecipientAddress_Like_V2"
    }
    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (key === 1) {
        if (result.length > 0) {
          setListDataRecipient(result);
        } else {
          setListDataRecipient([]);
        }
      } else {
        if (result.length > 0) {
          setListRecipientPhone(result)
        }
        else {
          setListRecipientPhone([]);
        }
      }
      setDisable(true);
    } catch (e) {
      Alerterror("Không có dữ liệu! Vui lòng liên hệ CSKH!");
      setDisable(true);
    }
  }
  //#endregion

  //#region Chọn SĐT nhận load ra thông tin

  // Save 
  const [KeySetUpId, setKeySetUpId] = useState(0);
  const [CodeAddress, setCodeAddress] = useState('');
  const CPN_spManagerAddress_Save = async (_lat, _lng) => {
    try {
      debugger
      const params = {
        Json: JSON.stringify({
          Id: KeySetUpId,
          CodeAddress: 'K-' + DistrictCodeTo + WardCodeTo + DistrictTo + WardTo,
          NameAddress: RecipientName,
          ProvinceId: CityTo,
          ProvinceName: CityToName,
          DistrictId: DistrictTo,
          DistrictName: DistrictToName,
          WardId: WardTo,
          WardName: WardToName,
          TypeAddress: "Khác",
          TimeDown: 10,
          TimeSlotFrom: "06:00",
          TimeSlotTo: "23:59",
          CreateId: 0,
          CreateName: "Khách hàng tạo",
          Streets: RemoveExtraSpace(RecipientStreet),
          FullAddress: RecipientAddress.trim(),
          Lat: _lat+'',
          Lng: _lng+'',
          TypeAddressCode: "K",
          TonTimeDown: 30,
          CustomerId: GetCookie("CustomerID"),
          CustomerRecipientId: RecipientId
        }),
        func: "CPN_spManagerAddress_Save_Test"
      }

      setCodeAddress('K-' + DistrictCodeTo + WardCodeTo + DistrictTo + WardTo);
      const result = await mainAction.API_spCallServer(params, dispatch);
      debugger
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        //setDisableBtn(false)
        setCodeAddress("");
        //ClearFormSetUp();
        // setShowMap(true)
        // setLat(_lat)
        // setLng(_lng)
        _ReturnMess(result)

        //tuan anh them 
        //onGetAddress({ id: result.Id, name: FullAddress, lat: _lat, lng: _lng, oldAddress: _FullAddress, reserveAddress: oldAddress })

      } else {
        //Alertwarning(result.ReturnMess);
        //setDisableBtn(false)
      }
    } catch (error) {
      //Alerterror("Error !")
      //setDisableBtn(false);
      console.log(error, "CPN_spManagerAddress_Save")
    }
  }

  //Check address exists
  const CPN_spManagerAddress_Check = async () => {
    if (CityTo === 0) {
      Alertwarning("Vui lòng chọn tỉnh thành !");
      return;
    }
    if (DistrictTo === 0) {
      Alertwarning("Vui lòng chọn quận/huyện !");
      return;
    }
    if (WardTo === 0) {
      Alertwarning("Vui lòng chọn phường/xã !");
      return;
    }
    if (RecipientStreet === "") {
      Alertwarning("Vui lòng nhập số nhà/tên đường !");
      RecipientStreetRef.current.focus();
      return;
    }
    if (RegExpAddress(RecipientAddress) === false) {
      Alertwarning("Sai định dạng địa chỉ VD: Số nhà tên đường,phường xã,Quận huyện,Tỉnh thành !");
      RecipientAddressRef.current.focus();
      return;
    }
    if (RecipientName === "") {
      Alertwarning("Vui lòng nhập tên người nhận !");
      RecipientNameRef.current.focus();
      return;
    }
    try {
      const params = {
        Json: JSON.stringify({ FullAddress: RecipientAddress, CustomerID: GetCookie("CustomerID"), CustomerRecipientId: RecipientId }),
        func: "CPN_spManagerAddress_Check"
      }
      debugger
      const result = await mainAction.API_spCallServer(params, dispatch);
      debugger
      if (result.Status === "OK") {
        //setreturnm("")
        const _GetLatLngGoogle = await GetLatLngGoogle(RecipientAddress);
        let provinceGoogle = RemoveExtraSpace(RemoveAccents(_GetLatLngGoogle[0].AddressReturn).toUpperCase())
        let province = RemoveExtraSpace(RemoveAccents(CityToName.toUpperCase()))

        if (provinceGoogle.includes(province) === true) {
          await CPN_spManagerAddress_Save(_GetLatLngGoogle[0].lat, _GetLatLngGoogle[0].lng)
          //callReload = callReload(true)
          setAddressSetupId(0);
        } else {
          //setreturnm("Sai địa chỉ định vị ,sau khi định vị là : " + _GetLatLngGoogle[0].AddressReturn + '. Vui lòng kiểm tra lại cột số nhà/tên đường !')
          //setDisableBtn(false)
          RecipientStreetRef.current.focus();
        }

        //if (window.confirm('Địa chỉ sau khi lấy định vị là : ' + _GetLatLngGoogle[0].AddressReturn + '. Vui lòng kiểm tra lại, nếu đúng OK tiến hành lưu, nếu sai,chọn HỦY và chỉnh sửa lại cột số nhà/tên đường !'))
        //CPN_spManagerAddress_Save(_GetLatLngGoogle[0].lat, _GetLatLngGoogle[0].lng);
      }// else {
        //Alertwarning(result.ReturnMess)
        //setDisableBtn(false)
      //}
    } catch (error) {
      //Alerterror("Error !")
      //setDisableBtn(false);
      console.log(error, "CPN_spManagerAddress_Check")
    }
  }

  const ClearFormSetUp = () => {
    debugger
    //setreturnm("")
    setAddressSetupId(0);
    setDistrictTo(0);
    setDistrictToName("Chọn quận huyện")
    setWardTo(0);
    setWardToName("Chọn phường xã");
    setCityTo(0);
    setCityToName("Chọn tỉnh thành");
    setRecipientName("");
    setRecipientStreet('');
    RecipientAddress("");
    setLat("");
    setLng("");
    setCodeAddress("");
    setListDataaddress([]);
  }

  //#endregion

  //#region TÍNH CƯỚC PHÍ

  //#region Tính ngoại tuyến

  const [IsChangeWard, setIsChangeWard] = useState(0);
  const [OutlineSave, setOutlineSave] = useState({});

  useEffect(() => {
    IsChangeWard === 1 ? CPN_spLocationCheckCustomer() : Norun();
  }, [IsChangeWard]);

  const CPN_spLocationCheckCustomer = async () => {
    if (WardTo === 0) return;
    const pr = {
      CustomerId: parseInt(Customer?.CustomerID),
      WardId: WardTo, //WardTo
    };

    const result = await mainAction.API_spCallServer(
        "CPN_spLocationCheckCustomer",
        pr,
        dispatch
    );

    await setOutlineSave(result);
    await setOnSiteDeliveryPrice(result.OnSiteDeliveryPrice);
    await setOnSiteDeliveryPriceMoney(result.OnSiteDeliveryPriceMoney);

    if (result.Status !== "") {
      Alertsuccess(result.Status);
    }

    setIsChangeWard(0);
    setIsChangePriceMain(1);
  };

  //#endregion TÍNH NGOẠI TUYẾN KHI CHỌN PHƯỜNG XÃ NHẬN

  //#region TÍNH CƯỚC TRẮNG KHI CHỌN TỈNH, DỊCH VỤ, TRỌNG LƯỢNG

  const [IsChangePriceMain, setIsChangePriceMain] = useState(0);
  const [PriceMainSave, setPriceMainSave] = useState(0);

  useEffect(() => {
    if (IsChangePriceMain === 1) {
      CPN_spLading_PriceMain();
      setIsChangePriceMain(0);
    } else Norun();
  }, [IsChangePriceMain]);

  const CPN_spLading_PriceMain = async () => {
    if (
      CityFrom === 0 ||
      CityTo === 0 ||
      ((Weight === "" || Weight === "0") && !IsWeight) ||
      ((Mass === "" || Mass === "0") && IsWeight) ||
      ServiceID === 0 || ServiceID === undefined
    ) {
      return;
    }
    let pr = {
      CustomerId: Customer?.CustomerID,
      ServiceId: ServiceID,
      Weight: Weight === "" ? 0 : parseInt(Weight),
      Mass: Mass === "" ? 0 : parseFloat(Mass),
      Number: NumberItem === "" ? 1 : parseInt(NumberItem),
      ProvinceID_From: CityFrom,
      DistrictID_From: DistrictFrom,
      ProvinceID_To: CityTo,
      DistrictID_To: DistrictTo,
      Keykl: 0,
      IsAPI: 1,
    };
    try {
      const params = {
        API_key: APIKey,
        Json: JSON.stringify(pr),
        func: "CPN_spLading_PriceMain",
      };
      // call redux saga
      const data = await mainAction.API_spCallServer(params, dispatch);
      let pricemain = data.length === 0 ? 18000 : parseInt(data);
      let PriceNT = pricemain * OnSiteDeliveryPrice / 100;
      await setOutlineSave({ OnSiteDeliveryPrice: OnSiteDeliveryPrice, OnSiteDeliveryPriceMoney: PriceNT });
      await setOnSiteDeliveryPriceMoney(PriceNT);
      await setPriceMainSave(pricemain);
      await setPriceMain(FormatMoney(pricemain + PriceNT, 0));
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
    }
    setIsChangeVatPpxd(1);
    setIsChangePriceMain(0);
  };

  //#endregion TÍNH CƯỚC TRẮNG KHI CHỌN TỈNH, DỊCH VỤ, TRỌNG LƯỢNG

  //#region TÍNH GIÁ DỊCH VỤ GTGT VÀ VAT PPXD

  const [IsChangeVatPpxd, setIsChangeVatPpxd] = useState(0);
  useEffect(() => {
    if (IsChangeVatPpxd === 1) {
      CPN_spLadingGetAnotherServiceMoney();
      setIsChangeVatPpxd(0);
    } else Norun();
  }, [IsChangeVatPpxd]);

  const [AnotherPriceSave, setAnotherPriceSave] = useState([]);
  const CPN_spLadingGetAnotherServiceMoney = async () => {
    let _listServiceSelect = ";" + ServiceGTGTId;
    let pr = {
      CustomerId: Customer?.CustomerID, // đây là í của customer đăng nhập
      ServiceId: ServiceID, // đây là id dịch vụ vd như CPN,
      PostOfficeId: PostOfficeId, //Bưu cục của KH
      THBB: _listServiceSelect.indexOf(";1;") !== -1 ? 1 : 0, // thu hồi biên bản
      BP: _listServiceSelect.indexOf(";2;") !== -1 ? 1 : 0, //báo phát
      HD: HD > 1 || _listServiceSelect.indexOf(";7;") !== -1 ? HD : 0, //hóa đơn Important
      NPDK:
        NumberCoCheck > 1 || _listServiceSelect.indexOf(";9;") !== -1
          ? NumberCoCheck
          : 0, //Số lượng đồng kiểm  Important
      PTT: _listServiceSelect.indexOf(";10;") !== -1 ? 1 : 0, // phát tận tay
      HQK: _listServiceSelect.indexOf(";12;") !== -1 ? 1 : 0, // hàng quá khổ
      PST:
        SupperMarket > 1 || _listServiceSelect.indexOf(";13;") !== -1
          ? SupperMarket
          : 0, // phát siêu thị  Important
      PDPQ:
        PhuQuocIsLand > 1 || _listServiceSelect.indexOf(";14;") !== -1
          ? PhuQuocIsLand
          : 0, // phát đảo phú quốc  Important
      COD:
        Cod.toString() !== ""
          ? parseFloat(Cod.toString().replaceAll(",", ""))
          : 0, // Tiền thu hộ
      HHKG:
        Insured.toString() !== ""
          ? parseFloat(Insured.toString().replaceAll(",", ""))
          : 0, // Khai giá
      PriceMain: PriceMainSave,
      Width: parseFloat(Width),
      Height: parseFloat(Height),
      Length: parseFloat(Length),
      //PackType:0
      //IsPPXD:PPXDPercent>0?1:0,
      //IsVAt:VAT>0?1:0,
      IsPPXD: 1,
      IsVAT: 1,
      OnSiteDeliveryPrice: OnSiteDeliveryPrice,
      OnSiteDeliveryPriceMoney: OnSiteDeliveryPriceMoney,
      //PercentDiscount:0
      Allowance: 0,
      TypeElec: 0, //Loại khách hàng TMĐT & KHTT
      CitySendId: CityFrom,
      CityRecipientId: CityTo,
      //WardTo: WardTo,
    };

    try {
      const params = {
        API_key: APIKey,
        Json: JSON.stringify([pr]),
        func: "CPN_spLadingGetAnotherServiceMoney",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      const data = result[0];
      setDealine(FormatDateJson(data.DealineTime));
      setTHBBPrice(FormatMoney(data.THBBMoney, 0)); //  thu hồi bb
      setBPPrice(FormatMoney(data.BPMoney, 0)); //báo phát
      setHDPrice(FormatMoney(data.HDMoney, 0));
      setNPDKPrice(FormatMoney(data.NPDKMoney, 0));
      setPTTPrice(FormatMoney(data.PTTMoney, 0)); //
      setHQKPrice(FormatMoney(data.HQKMoney, 0));
      setCODPrice(FormatMoney(data.CODMoney, 0));
      setInsuredPrice(FormatMoney(data.HHKGMoney, 0)); // hvae two InsuredMoney
      setPPXDPrice(FormatMoney(data.PPXDMoney, 0)); // pp xăng dầu
      setVATPrice(FormatMoney(data.VATMoney, 0));
      setAnotherPriceSave(data); //data này dùng để save lading

      //setOnSiteDeliveryPrice(data.OnSiteDeliveryPrice);
      //setOnSiteDeliveryPriceMoney(data.OnSiteDeliveryPriceMoney);

      setPriceMain(FormatMoney(data.PriceMain, 0));
      setPriceMainSave(data.PriceMain);
      setAmount(FormatMoney(data.Amount, 0));
      if (data.Amount <= 1000000000) setDisable(false);
      else {
        setDisable(true);
        Alerterror(
          "Cước phí lớn hơn 1.000.000.000đ. Vui lòng liên hệ CSKH để được hỗ trợ"
        );
      }
    } catch (err) {
      Alerterror("Vui lòng liên hệ CSKH");
      console.log("Eror", err);
    }
  };

  //#endregion TÍNH GIÁ DỊCH VỤ GTGT VÀ VAT PPXD

  //#endregion TÍNH CƯỚC PHÍ

  //#endregion ******** FORM TẠO ĐƠN HÀNG **********

  //#region ********** HÀM LOAD HTML **********
  const [_ReturnMess, set_ReturnMess] = useState("");
  const HtmlAddress = (
    <div className="container">
      <div className="modal fade" id="address" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <FormManagerAddress
                Type={'other'}
                _ReturnMess={e => set_ReturnMess(e)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-warning btn-xs" data-dismiss="modal">X Đóng</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );

  const CreateLading = (
    <form className="row">
      <div className="col-md-12">
        {/*    Thông tin người gửi */}
        <div className="margin-top-10">
          <div className='title'>
            Thông tin giao nhận{" "}
          </div>
          <div className="margin-top-10">
            <div className="row">
              <div className="col-md-12">
                <label>Bên gửi <span className="red">*</span></label>
                <SelectSender
                  onActive={SenderMeno.value}
                  defaultLabel={SenderMeno.label}
                  onSelected={(item) => {
                    onSelectSender(item);
                  }}
                  onLoad={OnLoadSender}
                />
              </div>
              <a
                className="pull-left Blue margin-top-10 margin-bottom-10"
                data-toggle="collapse"
                data-parent="#accordion"
                href="#collapseSender"
              >
                <span className='margin-left-15'>
                  <i className="fa fa-edit"></i>  Nhập địa chỉ mới
                </span>
              </a>
            </div>
            <div
              className={"panel-collapse collapse mt15 in" + ShowSender}
              id="collapseSender"
            >
              <div className="row margin-top-10">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Họ tên <span className="red">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      ref={SenderNameRef}
                      value={SenderName}
                      {...bindSenderName}
                      title="Họ tên bắt buộc nhập !"
                      minLength="0"
                      maxLength="250"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Điện thoại <span className="red">*</span>
                    </label>
                    <input
                      type="text"
                      className={"form-control " + phoneReg2}
                      ref={SenderPhoneRef}
                      value={SenderPhone}
                      {...bindSenderPhone}
                      title="Điện thoại bắt buộc nhập !"
                      onChange={(e) => {
                        setSenderPhone(e.target.value);
                      }}
                      minLength="8"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mt0">
                    <label className="mb0 font-weight500">
                      Tỉnh thành <span className="red">*</span>
                    </label>
                    <SelectCity
                      onActive={CityFrom}
                      onSelected={(item) => {
                        onChooseProvinceFrom(item);
                      }}
                      onBlur={(e) => setIsChangePriceMain(1)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mt0">
                    <label className="mb0 font-weight500">
                      Quận huyện <span className="red">*</span>
                    </label>
                    <SelectDistrict
                      key="DistrictFrom"
                      onActive={DistrictFrom}
                      ParentID={CityFrom}
                      onSelected={(item) => {
                        onChooseDistrictFrom(item);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mt0">
                    <label className="mb0 font-weight500">
                      Phường xã <span className="red">*</span>
                    </label>
                    <SelectWard
                      key="WardFrom"
                      onActive={WardFrom}
                      ParentID={DistrictFrom}
                      onSelected={(item) => {
                        onChooseWardFrom(item);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group" style={{ marginTop: "27px" }}>
                    <label>
                      Số nhà/ đường <span className="red">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      ref={SenderStreetRef}
                      value={SenderStreet}
                      {...bindSenderStreet}
                      minLength="0"
                      maxLength="500"
                      onBlur={(e) => {
                        changeStreetFrom(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-12 margin-top-20">
                  <div className="form-group">
                    <label>
                      Địa chỉ gửi <span className="red">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      ref={SenderAddressRef}
                      value={SenderAddress}
                      {...bindSenderAddress}
                      title="Địa chỉ gửi bắt buộc nhập !"
                      minLength="0"
                      maxLength="500"
                      disabled="disabled"
                    />
                  </div>
                </div>
                <div className="col-md-12 text-center">
                  <div
                    className="form-check"
                    title="Thêm vào địa chỉ gửi thường xuyên"
                  >
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="1"
                        onClick={() => { setIsSaveSender(!IsSaveSender); setShowSender(""); }}
                      />
                      Thêm vào địa chỉ gửi thường xuyên
                      <span className="form-check-sign">
                        <span className="check"></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className='col-md-12 margin-top-10 border-bottom-dash'>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin người nhận */}
        <div className="">
          <div className="margin-top-10" >
            <div className="row">
              <div className="col-md-12">
                <label>Bên Nhận <span className="red">*</span></label>
                <SelectRecipient
                  onActive={RecipientId}
                  onSelected={(item) => {
                    onSelectRecipient(item);
                  }}
                  onLoad={OnLoadRecipient}
                />
              </div>
              <a
                className="pull-left Blue margin-top-10 margin-bottom-10"
                data-toggle="collapse"
                data-parent="#accordion"
                href="#collapseReceipient"
              >
                <span className='margin-left-15'>
                  <i className="fa fa-edit"></i> Nhập địa chỉ nhận
                </span>
               {/*  <span title="Thêm mới địa chỉ" className="input-group-search cursor" data-toggle="modal" data-target="#address"><i className="fa fa-edit"></i></span> */}
              </a>
            </div>
            <div className="mt15">
              <div className="row">
                <div className="col-md-12 display-none">Lat {Lat} Lng {Lng}</div>
              </div>
              <div className={"panel-collapse collapse in " + ShowReceipient} id="collapseReceipient">
                <div className="row">
                  <div className="col-md-12 mb10">
                    <div className="form-group">
                      <label>
                        Địa chỉ nhận <span className="red">*</span>
                      </label>
                      <div class="input-group">
                        <input
                          type="text"
                          className="form-control"
                          ref={RecipientAddressRef}
                          value={RecipientAddress}
                          {...bindRecipientAddress}
                          minLength="0"
                          maxLength="500"
                          onChange={e => onClickSelectRecipient(e)}
                          placeholder="Nhập địa chỉ để tìm kiếm"
                        />
                        {/* <div class="input-group-prepend" >
                          <a data-toggle="collapse"
                            data-parent="#accordion"
                            href="#collapseReceipient" title="Thêm mới địa chỉ" style={{ padding: "10px", marginTop: "0" }} className="btn btn-info btn-sm input-group-search cursor"><i className="fa fa-edit"></i> Nhập địa chỉ nhận</a>
                        </div> */}
                      </div>
                    </div>
                    <div id="div-sender-master" class={IsAcctiveRecipient === 0 ? "display-none" : ""} style={{ position: "absolute", zIndex: 10, backgroundColor: "#fff", border: "1px solid #ddd", marginTop: "-15px" }}>
                      <div id="div-sender" class="col-md-12 col-sm-12 col-xs-12 div-sender">
                        {
                          ListDataRecipient.length > 0 ?
                            (
                              ListDataRecipient.map((item, index) => {
                                return (
                                  <div className="select-option-like" title={item.Address} key={index} value={item.AddressSetUpId} onClick={e => onSelectedRecipient(item.AddressSetUpId)}>{item.Address}</div>
                                )
                              })
                            ) :
                            (
                              <div className="select-option-like" key={0}>{RecipientAddress}</div>
                            )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Họ tên <span className="red">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        ref={RecipientNameRef}
                        value={RecipientName}
                        {...bindRecipientName}
                        minLength="0"
                        maxLength="250"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Điện thoại <span className="red">*</span>
                      </label>
                      <input
                        type="text"
                        className={"form-control " + phoneReg3}
                        ref={RecipientPhoneRef}
                        value={RecipientPhone}
                        {...bindRecipientPhone}
                        onChange={(e) => {
                          setRecipientPhone(e.target.value);
                        }}
                        minLength="8"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt0">
                      <label className="mb0">
                        Tỉnh thành <span className="red">*</span>
                      </label>
                      <SelectCity
                        onActive={CityTo}
                        IsLoad={IsLoad}
                        onSelected={(item) => {
                          onChooseProvinceTo(item);
                        }}
                        onBlur={(e) => setIsChangePriceMain(1)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt0">
                      <label className="mb0">
                        Quận huyện <span className="red">*</span>
                      </label>
                      <SelectDistrict
                        key="DistrictTo"
                        onActive={DistrictTo}
                        ParentID={CityTo}
                        onSelected={(item) => {
                          onChooseDistrictTo(item);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt0">
                      <label className="mb0">
                        Phường xã <span className="red">*</span>
                      </label>
                      <SelectWard
                        key="WardTo"
                        onActive={WardTo}
                        ParentID={DistrictTo}
                        onSelected={(item) => {
                          onChooseWardTo(item);
                        }}
                        onBlur={(e) => {
                          CPN_spLocationCheckCustomer(e);
                          setIsChangePriceMain(1);
                          setRecipientId(0);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group StreetToArea" style={{ marginTop: "27px" }}>
                      <label>
                        Số nhà /Đường <span className="red">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        ref={RecipientStreetRef}
                        value={RecipientStreet}
                        {...bindRecipientStreet}
                        minLength="0"
                        maxLength="500"
                      /* onBlur={(e) => {
                        changeStreetTo(e.target.value);
                        setRecipientId(0);
                      }} */
                      />
                      {/* <div className="ListStreet">
                        {StreetHtml}
                      </div> */}
                    </div>
                  </div>
                  <div className="col-md-12 margin-top-20">
                    <div className="form-group">
                      <label>Công ty nhận</label>
                      <input
                        type="text"
                        className="form-control"
                        ref={RecipientCompanyRef}
                        value={RecipientCompany}
                        {...bindRecipientCompany}
                        minLength="0"
                        maxLength="250"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 text-center">
                    <div
                      className="form-check"
                      title="Thêm vào địa chỉ nhận thường xuyên"
                    >
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="1"
                          onChange={(element) => { setShowReceipient(""); }}
                        />
                        Thêm vào địa chỉ nhận thường xuyên
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12 border-bottom-dash'>
        </div>
        <div className="">
          <div className='title'>
            Gói dịch vụ {" "}
          </div>
          <div className="margin-top-10">
            <SelectService
              onActive={ServiceID}
              onSelected={(item) => {
                changeServiceId(item);
              }}
            />
          </div>
        </div>
        <div className='col-md-12 margin-top-10 border-bottom-dash'>
        </div>
        {/* Thông tin hàng hóa */}
        <div className="margin-top-10">
          <div className='title'>
            Thông tin hàng hóa {" "}
          </div>
          <div className="row margin-top-20">
            <div className="col-md-6 margin-bottom-10">
              <div className="form-group">
                <label>
                  Nội dung <span className="red"> *</span>
                </label>
                <input
                  className="form-control"
                  ref={DescriptionRef}
                  value={Description}
                  {...bindDescription}
                  minLength="0"
                  maxLength="500"
                  rows="1"
                  placeholder='Nội dung gửi hàng'
                />
              </div>
            </div>
            <div className="col-md-6 margin-bottom-10">
              <div className="form-group">
                <label> Ghi chú </label>
                <input
                  className="form-control"
                  ref={NotedRef}
                  value={Noted}
                  {...bindNoted}
                  minLength="0"
                  maxLength="250"
                  rows="1"
                  placeholder='VD: Giao giờ hành chính ...'
                />
              </div>
            </div>
            <div className="col-md-6 margin-top-10">
              <div className="form-group">
                <label>
                  Trọng lượng (gram)
                  {IsWeight === false ? (<span className="red"> *</span>) : (<></>)}
                </label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='Nhập trọng lượng kiện hàng'
                    ref={WeightRef}
                    value={FormatMoney(Weight)}
                    {...bindWeight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                    }}
                    onBlur={(e) => { setMass(0); setIsChangePriceMain(1); }}
                    disabled={IsWeight}
                  />
                  {/*  <div className="input-group-append">
                    <div className="input-group-text">gram</div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-6 margin-top-10">
              <div className="form-group">
                <label>
                  Số kiện<span className="red"> *</span>
                </label>
                <input
                  type="number"
                  placeholder='Nhập số kiện'
                  className="form-control"
                  ref={NumberItemRef}
                  value={FormatMoney(NumberItem)}
                  {...bindNumberItem}
                  min="1"
                  max="1000"
                  onChange={(e) => {
                    setNumberItem(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className='col-md-12'>
              <label>
                Kích thước (Dài x Rộng x Cao)
              </label>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                {/*   <label>Dài</label> */}
                <div className="input-group mb-2">
                  <input
                    type="number"
                    placeholder='Dài (mm)'
                    className="form-control"
                    ref={WidthRef}
                    value={FormatMoney(Width)}
                    {...bindWidth}
                    minLength="0"
                    maxLength="15"
                    onChange={(e) => {
                      setWidth(e.target.value);
                    }}
                  />
                  {/*  <div className="input-group-append">
                    <div className="input-group-text">cm</div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                {/*   <label>Rộng</label> */}
                <div className="input-group mb-2">
                  <input
                    type="number"
                    placeholder='Rộng (mm)'
                    className="form-control"
                    ref={HeightRef}
                    value={FormatMoney(Height)}
                    {...bindHeight}
                    minLength="0"
                    maxLength="15"
                    onChange={(e) => {
                      setHeight(e.target.value);
                    }}
                  />
                  {/*   <div className="input-group-append">
                    <div className="input-group-text">cm</div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                {/*   <label>Cao</label> */}
                <div className="input-group mb-2">
                  <input
                    type="number"
                    placeholder='Cao (mm)'
                    className="form-control"
                    ref={LengthRef}
                    value={FormatMoney(Length)}
                    {...bindLength}
                    minLength="0"
                    maxLength="15"
                    onChange={(e) => {
                      setLength(e.target.value);
                    }}
                  />
                  {/*  <div className="input-group-append">
                    <div className="input-group-text">cm</div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Khối lượng {IsWeight ? (<span className="red"> *</span>) : (<></>)}</label>
                <div className="input-group mb-2">
                  <input
                    type="number"
                    placeholder='Khối lượng (cbm)'
                    className="form-control"
                    ref={MassRef}
                    value={FormatMoney(Mass)}
                    {...bindMass}
                    minLength="0"
                    maxLength="15"
                    onChange={(e) => {
                      setMass(e.target.value);
                    }}
                    onBlur={(e) => { setWeight(0); setIsChangePriceMain(1); }}
                    disabled={!IsWeight}
                  />
                  {/*  <div className="input-group-append">
                    <div className="input-group-text">cbm</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12 border-bottom-dash'>
        </div>
        {/* Thông tin sản phẩm */}
        <div className="margin-top-10">
          <div className='title'>
            Thông tin sản phẩm {" "}
            <a
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseTwo"
              className="white pull-right"
            >
              <i className="fa fa-angle-down"></i>
            </a>
          </div>

          <div className="panel-collapse collapse in margin-top-10" id="collapseTwo">
            <div className="row margin-top-10">
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Mã sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={ProductCodeRef}
                    value={ProductCode}
                    {...bindProductCode}
                    minLength="0"
                    maxLength="250"
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={ProductNameRef}
                    value={ProductName}
                    {...bindProductName}
                    minLength="0"
                    maxLength="250"
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    ref={ProductQualityRef}
                    value={ProductQuality}
                    {...bindProductQuality}
                    minLength="0"
                    maxLength="250"
                  />
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Số seri</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={ProductDesRef}
                    value={ProductDes}
                    {...bindProductDes}
                    minLength="0"
                    maxLength="250"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12 margin-top-10 border-bottom-dash'>
        </div>
      </div>
      {/*    dịch vụ */}
      <div className="col-md-12">
        {/*  người trả cước */}
        <div className="margin-top-10">
          <div className='title'>
            Người trả cước {" "}
          </div>
          <div className="row margin-top-10">
            <div className="col-md-3">
              <div className="form-check" title={"Người gửi thanh toán"}>
                <label className="form-check-label font-size-12px">
                  <input
                    className="form-check-input"
                    type="radio"
                    defaultChecked={PaymentType === 2}
                    onClick={(e) => changePaymentType(e)}
                    code="DTT"
                    value={2}
                    name="Payment"
                  />
                  Người gửi TT (ĐTT)
                  <span className="circle">
                    <span className="check"></span>
                  </span>
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-check" title={"Người nhận thanh toán"}>
                <label className="form-check-label font-size-11px">
                  <input
                    className="form-check-input"
                    type="radio"
                    defaultChecked={PaymentType === 1}
                    onClick={(e) => changePaymentType(e)}
                    code="NNTT"
                    value={1}
                    name="Payment"
                  />
                  Người nhận TT
                  <span className="circle">
                    <span className="check"></span>
                  </span>
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-check" title={"Thanh toán cuối tháng"}>
                <label className="form-check-label font-size-11px">
                  <input
                    className="form-check-input"
                    type="radio"
                    defaultChecked={PaymentType === 0}
                    onClick={(e) => changePaymentType(e)}
                    code="TTCT"
                    value={0}
                    name="Payment"
                  />
                  TT cuối tháng
                  <span className="circle">
                    <span className="check"></span>
                  </span>
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-check" title={"Khác"}>
                <label className="form-check-label font-size-11px">
                  <input
                    className="form-check-input"
                    type="radio"
                    defaultChecked={PaymentType === 3}
                    onClick={(e) => changePaymentType(e)}
                    code="KHAC"
                    value={3}
                    name="Payment"
                  />
                  Khác
                  <span className="circle">
                    <span className="check"></span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12 margin-top-10 border-bottom-dash'>
        </div>

        {/*  dịch vụ gia tăng */}
        <div className="margin-top-10">
          <div className='title'>
            Dịch vụ GTGT {" "}
            <a
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseGTGT"
              className="white pull-right"
            >
              <i className="fa fa-angle-down"></i>
            </a>
          </div>
          <div className="panel-collapse collapse in" id="collapseGTGT">
            <div className="margin-top-10">
              <div className="row">
                {ServiceGTGT.map((item, index) => {
                  if (
                    item.ServiceID !== 4 &&
                    item.ServiceID !== 6 &&
                    item.ServiceID !== 3 &&
                    item.ServiceID !== 8
                  )
                    return (
                      <div className="col-md-2" key={index}>
                        <div className="form-check" title={item.ServiceName}>
                          <label className="form-check-label font-size-11px">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="ServiceGTGT"
                              value={item.ServiceID}
                              checked={item.checkboxGTGT}
                              onChange={(element) => {
                                onChooseServiceGTGT(item, element);
                              }}
                            />
                            {item.ServiceCode}
                            <span className="form-check-sign">
                              <span className="check"></span>
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                })}
              </div>
              <div className="row mt10">
                <div className={IsHD === 1 ? "col-md-6" : "col-md-6 display-none"}>
                  <div className="form-group">
                    <label>
                      Số lượng hóa đơn <span className="red">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      ref={HDRef}
                      value={HD}
                      {...bindHD}
                      onChange={(e) => {
                        setHD(e.target.value);
                      }}
                      onBlur={(e) => setIsChangeVatPpxd(1)}
                      title="Số lượng hóa đơn bắt buộc nhập !"
                      minLength="0"
                      maxLength="20"
                    />
                  </div>
                </div>
                <div
                  className={IsNumberCoCheck === 1 ? "col-md-6" : "col-md-6 display-none"}
                >
                  <div className="form-group">
                    <label>
                      Số lượng đồng kiểm <span className="red">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      ref={NumberCoCheckRef}
                      value={NumberCoCheck}
                      {...bindNumberCoCheck}
                      onChange={(e) => {
                        setNumberCoCheck(e.target.value);
                      }}
                      onBlur={(e) => setIsChangeVatPpxd(1)}
                      title="Số lượng đồng kiểm bắt buộc nhập !"
                      minLength="0"
                      maxLength="20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12 margin-top-10 border-bottom-dash'>
        </div>
        {/*  COD */}
        <div className="margin-top-10">
          <div className='title'>
            Thu hộ - Khai giá {" "}
            <a
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseCOD"
              className="white pull-right"
            >
              <i className="fa fa-angle-down"></i>
            </a>
          </div>
          <div className="panel-collapse collapse in margin-top-10" id="collapseCOD">
            <div className="row margin-top-10">
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Tiền thu hộ</label>
                  <div className="input-group mb-2">
                    <input
                      className="form-control"
                      value={FormatMoney(Cod)}
                      onChange={(e) => {
                        setCod(e.target.value);
                      }}
                      onBlur={(e) => setIsChangeVatPpxd(1)}
                      minLength="0"
                      maxLength="15"
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Phí thu hộ</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={CODPriceRef}
                      value={CODPrice}
                      {...bindCODPrice}
                      minLength="0"
                      maxLength="15"
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Khai giá</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={FormatMoney(Insured)}
                      onChange={(e) => {
                        setInsured(e.target.value);
                      }}
                      onBlur={(e) => setIsChangeVatPpxd(1)}
                      minLength="0"
                      maxLength="20"
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Phí khai giá</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={InsuredPriceRef}
                      value={InsuredPrice}
                      {...bindInsuredPrice}
                      minLength="0"
                      maxLength="250"
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className='col-md-12 margin-top-10 border-bottom-dash'>
        </div>
        <div className="margin-top-10 row">
          <div className='title col-md-12'>
            Chi tiết cước phí {" "}
            <a
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseOne"
              className="white pull-right"
            >
              <i className="fa fa-angle-down"></i>
            </a>
          </div>
          <div className="panel-collapse collapse in col-md-12" id="collapseOne">
            <div className="margin-top-10 row">
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Phụ phí xăng dầu</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={PPXDPriceRef}
                      value={PPXDPrice}
                      {...bindPPXDPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 margin-top-10">
                <div className="form-group">
                  <label>Phí VAT</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={VATPriceRef}
                      value={VATPrice}
                      {...bindVATPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Cước phí</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={PriceMainRef}
                      value={PriceMain}
                      {...bindPriceMain}
                    />{" "}
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phí thu hộ</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      value={CODPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phí khai giá</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      value={InsuredPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Báo phát</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={BPPriceRef}
                      value={BPPrice}
                      {...bindBPPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phần trăm ngoại tuyến</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      value={OnSiteDeliveryPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phí phát ngoại tuyến</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      value={FormatMoney(OnSiteDeliveryPriceMoney, 0)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Thu hồi BB</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={THBBPriceRef}
                      value={THBBPrice}
                      {...bindTHBBPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Hóa đơn</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={HDPriceRef}
                      value={HDPrice}
                      {...bindHDPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phát đồng kiểm</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={NPDKPriceRef}
                      value={NPDKPrice}
                      {...bindNPDKPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phát tận tay</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={PTTPriceRef}
                      value={PTTPrice}
                      {...bindPTTPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Hàng quá khổ</label>
                  <div className="input-group mb-2">
                    <input
                      disabled="disabled"
                      type="text"
                      className="form-control"
                      ref={HQKPriceRef}
                      value={HQKPrice}
                      {...bindHQKPrice}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">đ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-12 margin-top-10 border-bottom-dash'>
            </div>
          </div>
        </div>
        <div className="row margin-top-10 Fee">
          <div className="col-md-6 margin-top-10">
            <div className="form-group">
              <label>Tổng cước phí (VND)</label>
              <div className="input-group mb-2">
                <input
                  disabled="disabled"
                  type="text"
                  className="form-control"
                  ref={AmountRef}
                  value={Amount}
                  {...bindAmount}
                />{" "}
                {/*  <div className="input-group-append">
                  <div className="input-group-text">đ</div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-md-6 margin-top-10">
            <div className="form-group">
              <label>Thời gian ước tính giao</label>
              <input
                disabled="disabled"
                type="text"
                className="form-control"
                ref={DealineRef}
                value={Dealine}
                {...bindDealine}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 text-center margin-top-10">
        <button
          type="button"
          className="btn btn-refesh text-transform btn-sm"
          onClick={Clearform}
        >
          <span>
            <i class="fa fa-refresh" aria-hidden="true"></i> Làm mới
          </span>
        </button>
        <button
          disabled={disable}
          type="button"
          className="btn btn-save text-transform btn-sm margin-left-10"
          onClick={SaveLading}
        >
          <span>
            {" "}
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu
          </span>
        </button>
        {/* <button
          type="button"
          className="btn btn-warning pull-right btn-sm"
          onClick={WriteLadingDraft}
        >
          <span>
            <i className="material-icons Iconsize18">save</i> Lưu nháp
          </span>
        </button> */}

        {Customer?.Verification !== 1 && Customer?.Type === 2 &&
          (<Link to="/xac-thuc-tai-khoan" className="btn btn-warning btn-sm pull-right"><i className="fa fa-check"></i> Xác thực tài khoản</Link>)}
      </div>
      <div className="clearfix"></div>
    </form>
  );

  const ListLading = (
    <form className="row">
      {/* <div className="main-title bg-light-green">
        <i className="fa fa-list"></i> VẬN ĐƠN MỚI TẠO TRONG TUẦN
      </div> */}
      <div className="col-md-12 margin-top-10">
        <div className="pull-left">
          <div className="form-check margin-top-10">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                value="checkAll"
                checked={IsChecked}
                onChange={handleCheckAll}
              />
              <span className="form-check-sign">
                <span className="check"> </span>
              </span>
              Chọn tất cả
            </label>
          </div>
        </div>
        <div className="pull-right">
          <div className="input-group text-right">
            <div
              className="input-group-prepend"
              style={{ marginRight: "5px", marginTop: "5px" }}
            >
              Số liên cần in{" "}
            </div>
            <input
              type="number"
              value={sheetprint}
              ref={sheetprintRef}
              {...bindsheetprint}
              onChange={(event) => ChangeSheetPrint(event)}
              min="1"
              max="10"
              className="form-control maxwidth100"
              placeholder="Số liên in"
              style={{ height: "35px" }}
            />
            <div className="form-group-append">
              <button
                onClick={() => {
                  APIC_spLadingGetDataPrint();
                }}
                type="button"
                className="btn btn-sm btn-save text-transform"
                style={{ margin: 0, marginLeft: '10px' }}
              >
                <i className="material-icons">print</i>
                &nbsp; In
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 margin-top-10">
        <DataTable data={dataLading} columns={columns} />
      </div>
    </form>
  );
  const [ShowCreateTab, setShowCreateTab] = useState("show active");
  const [ShowListTab, setShowListTab] = useState("");
  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row Formlading">
          <div className="col-md-12">
            <div className='row border-bottom'>
              <ul className="nav nav-pills col-md-12 nav-pills-warning hide-sm big-nav nav-pillss" style={{ display: "inline-flex" }}>
                <li className="nav-item col-md-6 whiteSpace">
                  <a
                    className={"nav-link " + ShowCreateTab}
                    data-toggle="tab"
                    href="#link1"
                    onClick={(e) => {
                      setShowCreateTab("show active");
                      setShowListTab("");
                    }}
                    style={{ padding: "10px 15px !important" }}
                  >
                    <i className="fa fa-edit"></i> {Title}
                  </a>
                </li>
                <li className="nav-item col-md-6 whiteSpace">
                  <a
                    className={"nav-link " + ShowListTab}
                    data-toggle="tab"
                    href="#link2"
                    onClick={(e) => {
                      setShowCreateTab("");
                      setShowListTab("show active");
                    }}
                    style={{ padding: "10px 15px !important" }}
                  >
                    <i className="fa fa-list"></i> VẬN ĐƠN MỚI TẠO TRONG TUẦN
                  </a>
                </li>
              </ul>
            </div>

            <div className="tab-content" id="nav-tabContent">
              <div className={"tab-pane fade " + ShowCreateTab}>{CreateLading}</div>
              <div className={"tab-pane fade " + ShowListTab}>{ListLading}</div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/assets/img/logo-gtel.png"
        style={{ display: "none" }}
      />
      <img
        src="/assets/img/iso9001.jpg"
        style={{ display: "none" }}
      />

      <div id="barcodeTarget" style={{ display: "none" }}>{HtmlPrint}</div>
      <div
        className="modal"
        id="modalDetail"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalDetail"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết vận đơn</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <LadingDetail LadingCode="" LadingId={DetailId} />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default btn-sm"
                data-dismiss="modal"
              >
                <i className="fa fa-close"></i> Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {HtmlAddress}
    </LayoutMain>
  );

  //#endregion *********** HÀM LOAD HTML ***********

};
