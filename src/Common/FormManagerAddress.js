import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import I18n from '../Language';
import { mainAction } from '../Redux/Actions';
import { SelectCity, SelectDistrict, SelectWard, SelectTypeAddress } from '.';
import { Alertwarning, Alertsuccess, Alerterror, GetLatLngGoogle, RemoveAccents, RemoveExtraSpace, FormatDateJson, RegExpAddress, GetCookie } from '../Utils';
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import $ from "jquery";

const _FormManagerAddress = ({
    Type = 'main', //Main or other to check calling from where
    _ReturnMess = () => { },
    CustomerRecipientId = null,
    addressEditId = 0,
    callReload = () => { },
    onGetAddress = () => { }
}) => {
    //#region 
    const dispatch = useDispatch();
    const [TonTimeDown, setTonTimeDown] = useState("30")
    const TonTimeDownRef = useRef()
    const [ShowMap, setShowMap] = useState(false)
    const [returnm, setreturnm] = useState("")
    const [ShowReset, setShowReset] = useState(false)
    const [Title, setTitle] = useState(I18n.t('Location.ManagerAddress'));
    const [Id, setId] = useState(0);
    const [CityId, setCityId] = useState({ value: 0, label: I18n.t('System.Select') });
    const CityIdRef = useRef();
    const [DistrictId, setDistrictId] = useState({ value: 0, label: I18n.t('System.Select') });
    const DistrictIdRef = useRef();
    const [WardId, setWardId] = useState({ value: 0, label: I18n.t('System.Select') });
    const WardIdRef = useRef();
    const [NameAddress, setNameAddress] = useState('');
    const NameAddressRef = useRef();
    const [TypeAddress, setTypeAddress] = useState({ value: "", label: I18n.t('System.Select') });
    const TypeAddressRef = useRef();
    const [TimeDown, setTimeDown] = useState('10');
    const TimeDownRef = useRef();
    const [TimeSlotFrom, setTimeSlotFrom] = useState('06:00');
    const TimeSlotFromRef = useRef();
    const [TimeSlotTo, setTimeSlotTo] = useState('23:59');
    const TimeSlotToRef = useRef();
    const [Streets, setStreets] = useState('');
    const StreetsRef = useRef();
    const [CodeAddress, setCodeAddress] = useState('');
    const CodeAddressRef = useRef();
    const [FullAddress, setFullAddress] = useState('');
    const [_FullAddress, set_FullAddress] = useState('');
    const [FullCheck, setFullCheck] = useState(1);
    const [disableBtn, setDisableBtn] = useState(false)
    const [Code, setCode] = useState("")
    const [Lat, setLat] = useState(''); //10.809311,106.663967
    const [Lng, setLng] = useState('');
    const LatRef = useRef();
    const LngRef = useRef();
    const [ListDataaddress, setListDataaddress] = useState([]);
    const [IsAcctive, setIsAcctive] = useState(0);
    const [oldAddress, setOldAddress] = useState('');

    //#endregion

    useEffect(() => {
        setFullAddress(
            RemoveExtraSpace(
                (Streets === "" ? "" : Streets + ',')
                + (WardId.value === 0 ? "" : WardId.label + ',')
                + (DistrictId.value === 0 ? "" : DistrictId.label + ',')
                + (CityId.value === 0 ? "" : CityId.label)
            )
        )
    }, [FullCheck]);

    $('body').on("click", function (event) {
        setIsAcctive(0);
    })

    useEffect(() => {
        CPN_spManagerAddress_Get()
    }, [addressEditId]);
    
    const ClearForm = () => {
        setreturnm("")
        setShowReset(false)
        setTitle(I18n.t('Location.ManagerAddress'))
        setId(0);
        setDistrictId({ value: 0, label: I18n.t('System.Select') });
        setWardId({ value: 0, label: I18n.t('System.Select') });
        setCityId({ value: 0, label: I18n.t('System.Select') });
        setNameAddress("");
        setStreets('');
        setFullAddress("");
        set_FullAddress("");
        setLat("");
        setLng("");
        setCodeAddress("");
        setListDataaddress([]);
    }

    // Save 
    const CPN_spManagerAddress_Save = async (_lat, _lng) => {
        try {
            const params = {
                Json: JSON.stringify({
                    Id: Id,
                    CodeAddress: 'K-' + CodeAddress,
                    NameAddress: NameAddress,
                    ProvinceId: CityId.value,
                    ProvinceName: CityId.label,
                    DistrictId: DistrictId.value,
                    DistrictName: DistrictId.label,
                    WardId: WardId.value,
                    WardName: WardId.label,
                    TypeAddress: "Khác",
                    TimeDown: 10,
                    TimeSlotFrom: "06:00",
                    TimeSlotTo: "23:59",
                    CreateId: 0,
                    CreateName: "Khách hàng tạo",
                    Streets: RemoveExtraSpace(Streets),
                    FullAddress: FullAddress.trim(),
                    Lat: _lat,
                    Lng: _lng,
                    TypeAddressCode: "K",
                    TonTimeDown: 30,
                    CustomerId: GetCookie("CustomerID"),
                    CustomerRecipientId: CustomerRecipientId
                }),
                func: "CPN_spManagerAddress_Save"
            }

            setCode('K-' + CodeAddress);
            const result = await mainAction.API_spCallServer(params, dispatch);

            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                setDisableBtn(false)
                setCodeAddress("");
                ClearForm()
                // setShowMap(true)
                // setLat(_lat)
                // setLng(_lng)
                _ReturnMess(result)

                //tuan anh them 
                onGetAddress({ id: result.Id, name: FullAddress, lat: _lat, lng: _lng, oldAddress: _FullAddress, reserveAddress: oldAddress })

            } else {
                if (result.ReturnMess === "Mã địa chỉ đã tồn tại !" && Type !== 'main') {
                    Alertwarning("Vui lòng ấn Reset sau đó ấn lưu lại !");
                    setShowReset(true)

                } else {
                    Alertwarning(result.ReturnMess);
                }

                setDisableBtn(false)
                CodeAddressRef.current.focus();
            }
        } catch (error) {
            Alerterror("Error !")
            setDisableBtn(false);
            console.log(error, "CPN_spManagerAddress_Save")
        }
    }

    //Check address exists
    const CPN_spManagerAddress_Check = async () => {
        if (CodeAddress === "") {
            Alertwarning("Vui lòng nhập mã địa chỉ !");
            CodeAddressRef.current.focus();
            return;
        }
        if (CityId.value === 0 || CityId.value === -1 || CityId.value === undefined) {
            Alertwarning("Vui lòng chọn tỉnh thành !");
            CityIdRef.current.focus();
            return;
        }
        if (DistrictId.value === 0 || DistrictId.value === -1 || DistrictId.value === undefined) {
            Alertwarning("Vui lòng chọn quận/huyện !");
            DistrictIdRef.current.focus();
            return;
        }
        if (WardId.value === 0 || WardId.value === -1 || WardId.value === undefined) {
            Alertwarning("Vui lòng chọn phường/xã !");
            WardIdRef.current.focus();
            return;
        }
        if (Streets === "") {
            Alertwarning("Vui lòng nhập số nhà/tên đường !");
            StreetsRef.current.focus();
            return;
        }
        if (RegExpAddress(FullAddress) === false) {
            Alertwarning("Sai định dạng địa chỉ VD: Số nhà tên đường,phường xã,Quận huyện,Tỉnh thành !");
            StreetsRef.current.focus();
            return;
        }
        if (NameAddress === "") {
            Alertwarning("Vui lòng nhập đơn vị/tổ chức !");
            NameAddressRef.current.focus();
            return;
        }
        try {
            setDisableBtn(true)
            if (_FullAddress === FullAddress) {
                CPN_spManagerAddress_Save(Lat, Lng)

                callReload = callReload(true)
                addressEditId = 0
                return

            } else {
                const result = await mainAction.API_spCallServer(
                    "CPN_spManagerAddress_Check",
                    { FullAddress: FullAddress, CustomerID: GetCookie("CustomerID"), CustomerRecipientId: CustomerRecipientId },
                    dispatch
                );
                debugger
                if (result.Status === "OK") {
                    if (Type === 'main') {

                        CPN_spManagerAddress_Save(Lat, Lng)

                        callReload = callReload(true)
                        addressEditId = 0
                    } else {

                        setreturnm("")
                        const _GetLatLngGoogle = await GetLatLngGoogle(FullAddress);
                        let provinceGoogle = RemoveExtraSpace(RemoveAccents(_GetLatLngGoogle[0].AddressReturn).toUpperCase())
                        let province = RemoveExtraSpace(RemoveAccents(CityId.label.toUpperCase()))

                        if (provinceGoogle.includes(province) === true) {
                            CPN_spManagerAddress_Save(_GetLatLngGoogle[0].lat, _GetLatLngGoogle[0].lng)

                            callReload = callReload(true)
                            addressEditId = 0

                        } else {
                            setreturnm("Sai địa chỉ định vị ,sau khi định vị là : " + _GetLatLngGoogle[0].AddressReturn + '. Vui lòng kiểm tra lại cột số nhà/tên đường !')
                            setDisableBtn(false)
                            StreetsRef.current.focus();
                        }

                        // window.confirm('Địa chỉ sau khi lấy định vị là : ' + _GetLatLngGoogle[0].AddressReturn + '. Vui lòng kiểm tra lại, nếu đúng OK tiến hành lưu, nếu sai,chọn HỦY và chỉnh sửa lại cột số nhà/tên đường !') ? CPN_spManagerAddress_Save(_GetLatLngGoogle[0].lat, _GetLatLngGoogle[0].lng) : setDisableBtn(false)
                    }
                } else {
                    Alertwarning(result.ReturnMess)
                    setDisableBtn(false)
                }

            }

        } catch (error) {
            Alerterror("Error !")
            setDisableBtn(false);
            console.log(error, "CPN_spManagerAddress_Check")
        }
    }

    const EnterCode = async (e, key) => {
        if (e.code === "Enter" || key === 2) {

            try {
                if (e.target.value === "") {
                    return
                }
                setDisableBtn(true)
                const result = await mainAction.API_spCallServer(
                    "CPN_spManagerAddress_EditList",
                    {
                        CodeAddress: e.target.value,
                        CreateId: 0
                    },
                    dispatch
                );

                if (result.Status === "NO") {
                    Alertwarning(result.ReturnMess)
                    setTitle(I18n.t('Location.ManagerAddress'))
                    ClearForm()
                    setDisableBtn(false);
                    return
                }
                if (result.Status === "OK") {
                    setTitle(I18n.t('Location.ManagerAddress'))
                    // ClearForm()
                    setDisableBtn(false);
                    return
                } else {

                    setTitle(I18n.t("Delivery.Edit") + " " + TypeAddress.value + '-' + e.target.value)
                    setId(result[0].Id);
                    const a = (result[0].CodeAddress.trim()).split(result[0].TypeAddressCode + '-')
                    setCodeAddress(a[1]);
                    //ward to district to city ewwww
                    setWardId({ value: result[0].WardId, label: result[0].WardName });
                    setDistrictId({ value: result[0].DistrictId, label: result[0].DistrictName });
                    setCityId({ value: result[0].ProvinceId, label: result[0].ProvinceName });
                    setNameAddress(result[0].NameAddress);
                    setTypeAddress({ value: result[0].TypeAddressCode, label: result[0].TypeAddress });
                    setTimeDown(result[0].TimeDown);
                    setTonTimeDown(result[0].TonTimeDown);
                    setTimeSlotFrom(result[0].TimeSlotFrom);
                    setTimeSlotTo(result[0].TimeSlotTo);
                    setStreets(result[0].Streets);
                    setFullAddress(result[0].FullAddress);
                    set_FullAddress(result[0].FullAddress);
                    setLat(result[0].Lat);
                    setLng(result[0].Lng);
                    setDisableBtn(false);
                    // setShowMap(false);
                }

            } catch (error) {
                Alerterror("Error !")
                setDisableBtn(false);
                console.log(error, "CPN_spManagerAddress_EditList")
            }
        }
    }

    //#region Load Address by Id || tuan anh them 
    const CPN_spManagerAddress_Get = async () => {

        try {

            setDisableBtn(true)
            const result = await mainAction.API_spCallServer(
                "CPN_spManagerAddress_Get",
                {
                    AddressId: addressEditId === 1000 ? 0 : addressEditId,
                },
                dispatch
            );

            if (result.length > 0) {
                setTitle(I18n.t('Location.ManagerAddress'))
                // ClearForm()
                setDisableBtn(false);

                // setTitle(I18n.t("Delivery.Edit") + " " + TypeAddress.value + '-' + e.target.value)
                setId(result[0].Id);
                const a = (result[0].CodeAddress.trim()).split(result[0].TypeAddressCode + '-')
                setCodeAddress(a[1]);
                //ward to district to city ewwww
                setWardId({ value: result[0].WardId, label: result[0].WardName });
                setDistrictId({ value: result[0].DistrictId, label: result[0].DistrictName });
                setCityId({ value: result[0].ProvinceId, label: result[0].ProvinceName });
                setNameAddress(result[0].NameAddress);
                setTypeAddress({ value: result[0].TypeAddressCode, label: result[0].TypeAddress });
                setTimeDown(result[0].TimeDown);
                setTonTimeDown(result[0].TonTimeDown);
                setTimeSlotFrom(result[0].TimeSlotFrom);
                setTimeSlotTo(result[0].TimeSlotTo);
                setStreets(result[0].Streets);
                setFullAddress(result[0].FullAddress);
                set_FullAddress(result[0].FullAddress);
                setOldAddress(result[0].FullAddress)
                setLat(result[0].Lat);
                setLng(result[0].Lng);
                setDisableBtn(false);
                // setShowMap(false);
                return
            }
            setDisableBtn(false);

        } catch (error) {
            Alerterror("Error !")
            setDisableBtn(false);
            console.log(error, "CPN_spManagerAddress_Get")
        }
    }
    //#endregion

    //map
    // const Map = () => {
    //     return (
    //         <GoogleMap
    //             zoom={14}
    //             scrollwheel={true}
    //             center={{ lat: +Lat, lng: +Lng }}
    //             options={{
    //                 mapTypeControl: true,
    //                 mapTypeControlOptions: {
    //                     style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    //                     position: window.google.maps.ControlPosition.TOP_RIGHT
    //                 },
    //             }}
    //         >
    //             <Marker
    //                 position={{ lat: +Lat, lng: +Lng }}
    //                 icon={{
    //                     url: './assets/img/flag.png',
    //                     scaledSize: new window.google.maps.Size(30, 30),
    //                     anchor: { x: 20, y: 20 }
    //                 }}
    //             />
    //         </GoogleMap>
    //     );
    // }
    // const MapWithAMarker = withScriptjs(withGoogleMap(Map))

    const RenderCode = (e) => {
        if (Type === 'main') { return }
        let a = DistrictId.code.split('-'), b = e.code, d = new Date();
        let _d = FormatDateJson(d)
        let re = _d.split(' ');
        let f = re[1].replaceAll(':', '');
        setCodeAddress((a[1] + b + f).toUpperCase())
    }

    const CPN_spManagerAddress_Like = async (data) => {
        if (data.length < 4) { return }

        const pr = {
            DataLike: data,
            CreateId: 0
        }

        const params = {
            Json: JSON.stringify(pr),
            func: "CPN_spManagerAddress_Like"
        }

        try {
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListDataaddress(result)
            } else {
                setListDataaddress([])
            }
        } catch (e) {
            Alerterror("Lỗi dữ liệu tìm kiếm, Vui lòng liên hệ CSKH!");
            console.log(e, "CPN_spManagerAddress_Like")
        }
    }

    const chosenAddress = (result) => {
        setTitle(I18n.t("Delivery.Edit") + " " + result.CodeAddress)
        setId(result.Id);
        const a = (result.CodeAddress).split(result.TypeAddressCode + '-')
        setCodeAddress(a[1]);
        //ward to district to city ewwww
        setWardId({ value: result.WardId, label: result.WardName });
        setDistrictId({ value: result.DistrictId, label: result.DistrictName });
        setCityId({ value: result.ProvinceId, label: result.ProvinceName });
        setNameAddress(result.NameAddress);
        setTypeAddress({ value: result.TypeAddressCode, label: result.TypeAddress });
        setTimeDown(result.TimeDown);
        setTonTimeDown(result.TonTimeDown);
        setTimeSlotFrom(result.TimeSlotFrom);
        setTimeSlotTo(result.TimeSlotTo);
        setStreets(result.Streets);
        setFullAddress(result.FullAddress);
        set_FullAddress(result.FullAddress);
        setLat(result.Lat);
        setLng(result.Lng);
        Alertsuccess("Đã chọn địa chỉ có sẵn " + result.CodeAddress + " !")
    }


    return (
        <>
            <div className={ShowMap === true ? "display-none" : ""}>
                <div class="card-header ">
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                            <h3 class="card-title">Quản lý địa chỉ</h3>
                        </div>
                        <div class="col-sm-12 col-md-6 top-xs-8s">
                            <button
                                disabled={disableBtn}
                                type="button"
                                class="btn btn-sm btn-cancel pull-right margin-left-5"
                                onClick={ClearForm}
                            >
                                <i class="fas fa-times-circle pr-2"></i>
                                Hủy
                            </button>
                            <button
                                disabled={disableBtn}
                                type="button"
                                class="btn btn-sm btn-save pull-right"
                                onClick={CPN_spManagerAddress_Check}
                            >
                                <i class="far fa-save pr-2"></i>
                                Lưu
                            </button>

                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label"> Quản lý địa chỉ<span className="red">(*)</span></label>
                                <div class="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">K-</span>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control"
                                        readOnly={Type !== 'main' ? true : false}
                                        ref={CodeAddressRef}
                                        value={CodeAddress}
                                        onChange={e => {
                                            setCodeAddress(RemoveExtraSpace(RemoveAccents(e.target.value.toUpperCase())))
                                        }}
                                        onKeyPress={(e) => {
                                            EnterCode(e, 1);
                                        }}
                                    />
                                    <div class={ShowReset === true ? "input-group-prepend" : "display-none"} >
                                        <button
                                            type="button"
                                            style={{ borderTopRightRadius: "0.25rem", borderBottomRightRadius: "0.25rem" }}
                                            class="btn btn-cancel pull-right btn-xs"
                                            onClick={e => RenderCode({ code: WardId.code })}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label">Địa chỉ <sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input type="text" readOnly class="form-control" value={FullAddress} />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label">Tỉnh thành <span className="red">(*)</span></label>
                                <SelectCity
                                    onSelected={e => {
                                        setCityId(e)
                                        setDistrictId({ value: 0, label: I18n.t('System.Select') })
                                        setWardId({ value: 0, label: I18n.t('System.Select') })
                                        setFullCheck(FullCheck + 1)
                                    }}
                                    ref={CityIdRef}
                                    onActive={CityId.value}
                                />
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label">Quận huyện <span className="red">(*)</span></label>
                                <SelectDistrict
                                    ParentID={CityId.value}
                                    ref={DistrictIdRef}
                                    onActive={DistrictId.value}
                                    onSelected={e => {
                                        setDistrictId(e)
                                        setFullCheck(FullCheck + 1)
                                        setWardId({ value: 0, label: I18n.t('System.Select') })

                                    }}
                                />
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label">Phường xã<span className="red">(*)</span></label>
                                <SelectWard
                                    ParentID={DistrictId.value}
                                    ref={WardIdRef}
                                    onActive={WardId.value}
                                    onSelected={e => {
                                        setWardId(e)
                                        setFullCheck(FullCheck + 1)
                                        RenderCode(e)
                                    }}
                                />
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label">Số nhà / đường<span className="red">(*)</span></label>
                                <div class="input-group">
                                    <input
                                        type="text"
                                        placeholder="Tìm địa chỉ có sẵn ,VD: 39B trường sơn"
                                        class="form-control"
                                        ref={StreetsRef}
                                        value={Streets}
                                        onChange={e => {
                                            setStreets(e.target.value)
                                            setFullCheck(FullCheck + 1)
                                            CPN_spManagerAddress_Like(e.target.value)
                                            setIsAcctive(1)
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault()
                                            return false;
                                        }}
                                        onCopy={(e) => {
                                            e.preventDefault()
                                            return false;
                                        }}
                                    />
                                </div>
                                <div id="div-sender-master" class={IsAcctive === 0 ? "display-none" : ""}>
                                    <div id="div-sender" class="col-md-12 col-sm-12 col-xs-12 div-sender">
                                        {
                                            ListDataaddress.length > 0 ?
                                                (
                                                    ListDataaddress.map((item, index) => {
                                                        return (
                                                            <div
                                                                className="select-option-like"
                                                                title={item.FullAddress}
                                                                key={index}
                                                                value={item.Id}
                                                                onClick={e => chosenAddress(item)}
                                                            >
                                                                {item.FullAddress}
                                                            </div>
                                                        )
                                                    })
                                                ) :
                                                (
                                                    <div className="select-option-like" key={0}>{Streets}</div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <label class="label">Đơn vị/Tổ chức<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="text"
                                        class="form-control"
                                        ref={NameAddressRef}
                                        value={NameAddress}
                                        onChange={e => setNameAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 display-none">
                            <div class="form-group">
                                <label class="label">  Thời gian lên/xuống hàng/1 tấn(Phút)<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control"
                                        min="0"
                                        placeholder="Ví dụ : 6"
                                        ref={TonTimeDownRef}
                                        value={TonTimeDown}
                                        onChange={e => setTonTimeDown(RemoveExtraSpace(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 display-none">
                            <div class="form-group">
                                <label class="label"> Thời gian tối thiểu lên/xuống hàng(Phút)<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control"
                                        min="0"
                                        placeholder="Ví dụ : 6"
                                        ref={TimeDownRef}
                                        value={TimeDown}
                                        onChange={e => setTimeDown(RemoveExtraSpace(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 display-none">
                            <div class="form-group">
                                <label class="label"> {I18n.t('Location.TimeSlotFrom')}<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="time"
                                        class="form-control"
                                        placeholder="Ví dụ : 8:00"
                                        ref={TimeSlotFromRef}
                                        value={TimeSlotFrom}
                                        onChange={e => setTimeSlotFrom(RemoveExtraSpace(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 display-none">
                            <div class="form-group">
                                <label class="label"> {I18n.t('Location.TimeSlotTo')}<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="time"
                                        class="form-control"
                                        placeholder="Ví dụ : 9:00"
                                        ref={TimeSlotToRef}
                                        value={TimeSlotTo}
                                        onChange={e => setTimeSlotTo(RemoveExtraSpace(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 display-none">
                            <div class="form-group">
                                <label class="label"> Lat<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="text"
                                        readOnly={Type === 'main' ? false : true}
                                        ref={LatRef}
                                        class="form-control"
                                        value={Lat}
                                        onChange={e => setLat(RemoveExtraSpace(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 display-none">
                            <div class="form-group">
                                <label class="label"> Lng<sup className="red">(*)</sup></label>
                                <div class="input-group">
                                    <input
                                        type="text"
                                        readOnly={Type === 'main' ? false : true}
                                        ref={LngRef}
                                        class="form-control"
                                        value={Lng}
                                        onChange={e => {
                                            setLng(RemoveExtraSpace(e.target.value))
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <h5 className={returnm !== "" ? "red" : "display-none"}>{returnm}</h5>
                        </div>
                    </div>

                </div>
            </div>
            <div className={ShowMap === false ? "display-none" : ""}>
                <div class="card-header ">
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                            <h3 class="card-title">Bản đồ : {Code}</h3>
                        </div>
                        <div class="col-sm-12 col-md-6 margin-top-5s">
                            <button
                                disabled={disableBtn}
                                type="button"
                                class="btn btn-sm btn-save pull-right margin-left-5"
                                value={Code}
                                onClick={e => EnterCode(e, 2)}
                            >
                                <i class="far fa-edit"></i>
                                {I18n.t("Delivery.Edit")}
                            </button>
                            <button
                                disabled={disableBtn}
                                type="button"
                                class="btn btn-sm btn-cancel pull-right"
                                onClick={e => {
                                    // setShowMap(false)
                                    setLat("")
                                    setLng("")
                                }}
                            >
                                <i class="fas fa-undo"></i>
                                {I18n.t('Delivery.Return')}
                            </button>

                        </div>
                    </div>
                </div>
                {/* <div class="card-body ">
                                        <div class="row">
                                            <div className="col-sm-12 col-md-12">
                                                <MapWithAMarker
                                                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBUBW5JbPqpurOUq2iV3Ys3rx59IktH1-s&v=3.exp&libraries=geometry,drawing,places"
                                                    loadingElement={<div style={{ height: `100%` }} />}
                                                    containerElement={<div style={{ height: `600px` }} />}
                                                    mapElement={<div style={{ height: `100%` }} />}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
            </div>

        </>

    )
}

export const FormManagerAddress = React.memo(_FormManagerAddress)