import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, DirectionsRenderer, KmlLayer } from "react-google-maps";
import axios from "axios"
import React, { useState, useEffect, useRef } from "react";
import { mainAction } from "../../../Redux/Actions";
import { useDispatch } from "react-redux";
import { Alertwarning, FormatDateJson, GetDataFromLogin } from "../../../Utils";

import Select from 'react-select';

export const MapVehiclee = ({ data = [], formattedOrigin, formattedDestination }) => {

    const dispatch = useDispatch();
    const OfficerId = GetDataFromLogin("OfficerID");

    const DirectionsService = new window.google.maps.DirectionsService();
    const directionsDisplay = new window.google.maps.DirectionsRenderer();
    const [selectedPark, setSelectedPark] = useState(null);
    const [InfoPosst, setInfoPosst] = useState({});
    const [Direction, setDirection] = useState([]);

    const [dataGr, setdataGr] = useState([]);
    const [Zoom, setZoom] = useState(6)
    const [Center, setCenter] = useState({ lat: 16.45545209151914, lng: 107.55564680631976 })
    const [TotalActive, setTotalActive] = useState(0)
    const [TotalNotActive, setTotalNotActive] = useState(0)
    const [dataBill, setDataBill] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [Filter, setFilter] = useState({ value: 0, label: 'Tất cả' })
    const [dataVehicle, setDataVehicle] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [hindSearch, setHindSearch] = useState(true)
    const [valueInput, setValueInput] = useState('');
    const [isFocus, setIsFocus] = useState(null);
    const [FromDate, setFromDate] = useState(new Date());
    const [ToDate, setToDate] = useState(new Date());
    const [DataRoute, setDataRoute] = useState([]);
    const [DataPostOffice, setDataPostOffice] = useState([])
    const [InforVehicle, setInforVehicle] = useState([]);
    const [FromLocation, setFromLocation] = useState();
    const [ShowRoute, setShowRoute] = useState(false);

    //#region  Call API adsun khi moi vao
    useEffect(() => {
        CPN_spType_Local();
        const CPN_Vehicle_Adsun_List = async () => {
            let instance = axios.create({
                baseURL: `https://shareapi.adsun.vn/Vehicle/GpsInfo?pageId=3304&username=gtel&pwd=123456`,
                timeout: 30000,
            });

            let res = await instance.get();
            let newData1 = [], newData2 = []
            res.data.Data.sort((a, b) => a.Id > b.Id ? 1 : -1).filter(i => {
                !i.IsStop ? newData1.push(i) : newData2.push(i)
            })

            setdataGr([...newData1, ...newData2])
            setDataVehicle([...newData1, ...newData2])
            setTotalActive(newData1.length)
            setTotalNotActive(newData2.length)
        }

        CPN_Vehicle_Adsun_List()
        CPN_spRouterPostOffice_List()
    }, [])
    //#endregion


    //#region  Call API adsun 5S 1 lan
    useEffect(() => {
        FilterVehicle(Filter)
        const CPN_Vehicle_Adsun_List = async () => {
            let instance = axios.create({
                baseURL: `https://shareapi.adsun.vn/Vehicle/GpsInfo?pageId=3304&username=gtel&pwd=123456`,
                timeout: 30000,
            });
            let res = await instance.get();
            let newData1 = [], newData2 = [];

            res.data.Data.sort((a, b) => a.Id > b.Id ? 1 : -1).filter(i => {
                !i.IsStop ? newData1.push(i) : newData2.push(i)
            })

            setdataGr([...newData1, ...newData2])
            FilterVehicle(Filter)
            setTotalActive(newData1.length)
            setTotalNotActive(newData2.length)
        }
        const callLoop = setTimeout(() => {
            CPN_Vehicle_Adsun_List()

        }, 5000)
        return () => clearTimeout(callLoop)
    }, [dataGr])
    //#endregion


    //#region Call filter list xe
    useEffect(() => {
        FilterVehicle(Filter)
    }, [Filter]);
    //#endregion


    //#region Lay du lieu cua xe
    useEffect(() => {
        let today = new Date();
        let lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

        setFromDate(new Date(FromDate))
        CPN_spRouteVehicle_List_Update(lastDay)
    }, []);
    //#endregion


    const CPN_spRouteVehicle_List_Update = async (from) => {
        setdataGr([])
        const pr = {
            FromDate: FormatDateJson(from, 0) ,
            ToDate: FormatDateJson(ToDate, 1) + ' 11:59 PM',
            AreaId: 0,
            PostId: 0,
            VehicleId: 0
        }
        try {
            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spRouteVehicle_List_Update"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
            if (res.length > 0) {
                let newData = res.map(i => {
                    return {
                        ...i,
                        TotalWeight: Math.round(i.TotalKGCreate) || 0,
                        TotalKG: Math.round(i.TotalKGCreate) || 0,
                        RemainKG: (i.WeightVehicle - Math.round(i.TotalKGCreate)),
                        Amount: i.TotalAmountCreate?.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") || 0,
                        TotalBill: i.TotalBillCreate,
                        plate: i.LicensePlate
                    }
                })
                setDataBill(newData)
            return;
            }
            return

        } catch (error) {
            Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT")
            console.log(error);
        }
    }
    //#endregion

    //#region get lo trinh
    const CPN_spRouteVehicle_List = async (row) => {
        setIsFocus(row.LicensePlate)
        const pr = {
            RouteVehicleId: row.RouteVehicleId,
            Types: 0
        }
        try {
            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spRouteVehicle_List"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
            if (res.length > 0) {
                let newData = res.sort((a, b) => a.IsOrderby > b.IsOrderby ? 1 : -1)
                console.log(newData);
                CreateRoute(newData)
                return;
            } else {
                Alertwarning("Không có dữ liệu")
                return;
            }
        } catch (error) {
            Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ CSKH")
            console.log(error);
        }
    }
    //#endregion

    // active post
    const CPN_spRouterPostOffice_List = async (row) => {
        try {
            const params = {
                Json: JSON.stringify({
                    OfficerId: GetDataFromLogin("OfficerID")
                }),
                func: "CPN_spRouterPostOffice_List"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setDataPostOffice(result)
                return;
            } else {
                Alertwarning("Không có dữ liệu")
                return;
            }
        } catch (error) {
            Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ CSKH")
            console.log(error);
        }
    }


    //#region Create Router || tạo lộ trình
    const CreateRoute = (data) => {

        let destination = {};
        let origin = { lat: +data[0].LatFrom, lng: +data[0].LngFrom }
        data[0].IsReturn ?
            destination = { ...origin } :
            destination = { lat: +data[data.length - 1].LatTo, lng: +data[data.length - 1].LngTo };
        setCenter(origin)
        setFromLocation(origin)
        //Mảng các điểm trong lộ trình giao hàng
        const poinst = data.map(i => {
            return { location: { lat: +i.LatTo, lng: +i.LngTo }, stopover: true }
        })

        DirectionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
                waypoints: poinst
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {

                    let dataAddDuration = data.map((item, index) => {
                        let Distance = (result.routes[0].legs[index].distance.value / 1000).toFixed(2);
                        let Duration = +((result.routes[0].legs[index].duration.value / 60).toFixed(2));
                        return {
                            ...item,
                            Distance: Distance,
                            Duration: Duration,
                        }
                    })

                    setDataRoute(dataAddDuration)
                    setDirection(result);
                    setShowRoute(true)
                    setZoom(10);

                } else {
                    Alertwarning("Lỗi tạo lộ trình, vui lòng thử lại")
                    return;
                }
            }
        );
    }
    //#endregion


      //#region List detail Route
      const TimeLineList = () => {
        return (
            <>
                <div
                    className="card item-card pt-2 pb-2 pl-2 ml-2"
                    style={{
                        width: '95%',
                        backgroundColor: "#fff",
                    }}
                >
                    <span>
                        <i class="fas fa-home mr-2 text-success"></i>

                        <strong class="text-success ">Xuất phát: </strong>
                        <strong class=" text-text-dark">{DataRoute[0]?.AddressFromName}</strong>
                    </span>
                </div>
                {DataRoute?.map((it, i) => {
                    return (
                        <div
                            className="card item-card pt-2 pb-2 pl-2 ml-2"
                            style={{
                                width: '95%',
                                backgroundColor: "#fff",
                            }}
                        >
                            <span>
                                <i class="fas fa-map-marker mr-1 text-success"></i>
                                <strong class="text-success">{it.IsOrderby}. </strong>
                                <span class=' font-weight-bold text-dark'>{it.AddressToName} </span>
                                <i class='font-weight-bold text-muted ' style={{ fontSize: '12px' }}> ({it.Distance} KM - {(it.Duration).toFixed(2)} Phút)</i>
                            </span>
                        </div>
                    )
                }
                )}
            </>
        )

    }
    //#endregion


    //#region Select Xe
    const SelectVehicle = (item) => {
        if (!ShowRoute) {
            setSelectedPark(item)
            setCenter({ lat: item.Lat, lng: item.Lng })
            setZoom(15);
            setIsFocus(item.Plate)
            return
        } else {
            if (InforVehicle.LicensePlate == item.LicensePlate) {
                setSelectedPark(item)
                setCenter({ lat: item.Lat, lng: item.Lng })
                setZoom(15);
                setIsFocus(item.Plate)
            }
            return

        }
    }
    //#endregion


    //#region Xu ly Select Xe
    const handleChangeSelectVehicle = (e) => {
        setFilter(e)
        FilterVehicle(e)
    }
    //#endregion


    //#region Option Filter Xe
    const CPN_spType_Local = async () => {
        const listState = [
            { value: 0, label: 'Tất cả' },
            { value: 1, label: 'Di chuyển' },
            { value: 2, label: 'Dừng' }

        ];
        setDataFilter(listState)
    }
    //#endregion


    //#region Filter xe
    const FilterVehicle = (value) => {

        let stop = [], run = []
        dataGr.filter(i => {
            i.IsStop ? stop.push(i) : run.push(i)
        })
        if (value.value === 0) {
            setDataVehicle([...dataGr])
            return
        }
        if (value.value === 1) {
            setDataVehicle([...run])
            return
        }
        if (value.value === 2) {
            setDataVehicle([...stop])
            return
        }
    }
    //#endregion


    //#region Xu ly search Xe
    const hadleChangeSearch = (e) => {
        e.length > 0 ? setHindSearch(false) : setHindSearch(true)
        const dataTemp = [...dataVehicle]
        setValueInput(e)
        const data = dataTemp.filter(i => i.Plate.toLocaleLowerCase().includes(e.toLocaleLowerCase()))
        setDataSearch([...data])
    }
    //#endregion


    //#region Xu ly click xe tim kiem
    const handleClickVehicleSearch = (value) => {
        if (value === 1) {
            setFilter({ value: 1, label: 'Di chuyển' })
            return;
        }
        if (value === 2) {
            setFilter({ value: 2, label: 'Dừng' })
            return;
        }
    }
    //#endregion



    return (
        <>
            <GoogleMap
                zoom={Zoom}
                scrollwheel={true}
                center={Center}
                options={{
                    mapTypeControl: false,
                    mapTypeControlOptions: {
                        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: window.google.maps.ControlPosition.BOTTOM_RIGHT
                    },
                    gestureHandling: "greedy",
                    fullscreenControlOptions: {
                        position: window.google.maps.ControlPosition.BOTTOM_RIGHT,    // as long as this is not set it works
                    },

                }}
            >

                {!ShowRoute && DataPostOffice.map((k, i) => {//active post
                    return (
                        <Marker
                            key={i}
                            onClick={() => {
                                setInfoPosst(k);
                            }}
                            position={{ lat: +k.Lat, lng: +k.Lng }}

                            icon={{
                                url: './assets/img/post.png',
                                scaledSize: new window.google.maps.Size(40, 40),
                                anchor: { x: 20, y: 20 }
                            }}
                        />
                    )
                })}

                {/* Render All Vehicle */}
                {!ShowRoute && dataVehicle.map((address, i) => {

                    const data = dataBill.filter(item => item.plate == address.Plate)
                    let obj = { ...address, ...data[0] }
                    let url = obj.IsStop
                        ? `./assets/img/Vehicle/off${(parseInt(obj.Angle / 10, 10) + 1) * 10}.png`
                        : `./assets/img/Vehicle/on${(parseInt(obj.Angle / 10, 10) + 1) * 10}.png`

                    return (
                        <Marker
                            key={i}
                            position={{ lat: obj.Lat, lng: obj.Lng }}
                            onClick={() => {
                                setSelectedPark(obj);
                                setIsFocus(obj.Plate)
                            }}
                            icon={{
                                url: url,
                                scaledSize: new window.google.maps.Size(40, 40),
                                anchor: { x: 20, y: 20 }
                            }}
                        />
                    )
                })}


                {!ShowRoute && dataBill.map((i, index) => {
                    const dataF = dataVehicle.filter(item => item.Plate !== i.plate)
                    let obj = { ...i, ...data[0] }
                    let angle = Math.floor(Math.random() * 360);
                    let url = `./assets/img/Vehicle/off${(parseInt(angle / 10, 10) + 1) * 10}.png`;
                    let lat = +`10.${angle}573651791522`,
                        lng = +`106.&=${angle}60158818006`

                    return (
                        <>
                            {dataF.length > 0
                                ? <Marker
                                    key={index}
                                    position={{ lat: lat, lng: lng }}
                                    onClick={() => {
                                        setSelectedPark(obj);
                                        setIsFocus(obj.Plate)
                                    }}
                                    icon={{
                                        url: url,
                                        scaledSize: new window.google.maps.Size(40, 40),
                                        anchor: { x: 20, y: 20 }
                                    }}
                                />
                                : ''}
                        </>
                    )
                })}

                {!ShowRoute && selectedPark && (
                    <InfoWindow
                        onCloseClick={() => {
                            setSelectedPark(null)
                            setIsFocus(null)
                        }}
                        position={{
                            lat: selectedPark.Lat,
                            lng: selectedPark.Lng
                        }}
                        clickable={true}
                        options={{
                            maxWidth: '300px'
                        }}
                    >
                        <div className="row">
                            <div className="col-md-12 col-12">
                                <h4 className="cl-car">Thông tin xe</h4>
                                <div className="row" style={{ fontSize: '15px' }}>
                                    <div className="col-md-6 col-6">
                                        <p className="mb-2"><span className="font-weight-bold">Xe:</span> {selectedPark.Plate}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Trọng tải:</span> {selectedPark.SheeatsOrTons}</p>
                                        <p className="mb-2"> <span className="font-weight-bold">Vận tốc:</span>  {selectedPark.Speed} km/h</p>
                                        <p className="mb-2"><span className="font-weight-bold">Tổng Km trong ngày:</span>  {selectedPark.Km} km</p>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <p className="mb-2"> <span className="font-weight-bold">Trạng thái xe:</span>  {selectedPark.IsStop ? "Dừng" : "Chạy"}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Số lần dừng:</span> {selectedPark.StopCounter}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Tổng thời gian dừng:</span> {selectedPark.StopTime}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Số lần quá tốc độ:</span> {selectedPark.OverSpeedCount}</p>
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <p className="mb-2"><span className="font-weight-bold">Địa chỉ hiện tại:</span> {selectedPark.Address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 col-12 mt-3">
                                <h4 className="cl-car">Thông tin hàng</h4>
                                <div className="row" style={{ fontSize: '15px' }}>
                                    <div className="col-md-6 col-6">
                                        <p className="mb-2"><span className="font-weight-bold">Tổng bill:</span> {selectedPark.TotalBill || 0}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Hoàn thành:</span> {selectedPark.totalBill ? selectedPark.billFinal + '/' + selectedPark.totalBill : '0/0'}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Đang xử lý:</span>  {selectedPark.totalBill ? selectedPark.billProcessing + '/' + selectedPark.totalBill : '0/0'}</p>
                                        <p className="mb-2"> <span className="font-weight-bold">Doanh thu:</span>  {selectedPark.Amount || 0} VND</p>

                                    </div>
                                    <div className="col-md-6 col-6">
                                        <p className="mb-2"><span className="font-weight-bold">Trạng thái xe:</span>  {selectedPark.IsStop ? "Dừng" : "Chạy"}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Số lần dừng:</span> {selectedPark.StopCounter}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Tổng thời gian dừng:</span> {selectedPark.StopTime}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Số lần quá tốc độ:</span> {selectedPark.OverSpeedCount}</p>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </InfoWindow>
                )}

                {/* active post */}
                {InfoPosst.Lat !== undefined && (
                    <InfoWindow
                        onCloseClick={() => {
                            setInfoPosst({Lat:undefined})
                        }}
                        position={{
                            lat: InfoPosst.Lat,
                            lng: InfoPosst.Lng
                        }}
                        clickable={true}
                        options={{
                            maxWidth: '300px'
                        }}
                    >
                        <div className="row">
                            <div className="col-md-12 col-12">
                                <h4 className="cl-car">Thông tin bưu cục</h4>
                                <div className="row" style={{ fontSize: '15px' }}>
                                    <div className="col-md-12 col-12">
                                        <p className="mb-2"><span className="font-weight-bold">Tên :</span> {InfoPosst.POName}</p>
                                        <p className="mb-2"><span className="font-weight-bold">Địa chỉ:</span> {InfoPosst.POAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </InfoWindow>
                )}


                {/*============== Render Route =============*/}
                {ShowRoute && DataRoute.length > 0 && <Marker
                    position={FromLocation}
                    icon={{
                        url: `./assets/img/post.png`,
                        scaledSize: new window.google.maps.Size(40, 40)
                    }}
                />}

                {ShowRoute && DataRoute.map((address, i) => {
                     let textColor = 'green'
                     if (address.TypeFinish === 1) textColor = 'grey'
                     
                   return (
                    <>
                    <Marker
                        key={i}
                        position={{ lat: +address.LatTo, lng: +address.LngTo }}
                        // label={`${i + 1}`}
                        icon={{
                            url: `https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_${textColor}${i + 1}.png`,
                            scaledSize: new window.google.maps.Size(30, 40)
                        }}
                    />
                </>
                   )
                    })}

                {ShowRoute && dataVehicle.map((address, i) => {
                    if (address.Plate == InforVehicle.LicensePlate) {
                        let obj = { ...address, ...data[0] }
                        let url = obj.IsStop
                            ? `./assets/img/Vehicle/off${(parseInt(obj.Angle / 10, 10) + 1) * 10}.png`
                            : `./assets/img/Vehicle/on${(parseInt(obj.Angle / 10, 10) + 1) * 10}.png`

                        return (
                            <Marker
                                key={i}
                                position={{ lat: obj.Lat, lng: obj.Lng }}
                                onClick={() => {
                                    setSelectedPark(obj);
                                    setIsFocus(obj.Plate)
                                }}
                                icon={{
                                    url: url,
                                    scaledSize: new window.google.maps.Size(40, 40),
                                    anchor: { x: 20, y: 20 }
                                }}
                            />
                        )
                    }
                    return '';
                })}

                {Direction &&
                    <DirectionsRenderer
                        directions={Direction}
                        options={{
                            polylineOptions: {
                                strokeOpacity: 1,
                                strokeColor: '#7C83FD',
                                strokeWeight: 4,
                            },
                            markerOptions: {
                                visible: false,
                            },
                        }}
                    />}
                {/* =================== */}

            </GoogleMap>

            {DataRoute.length === 0  && 
            <div className="card position-absolute " style={{ top: '0', left: '8px', borderRadius: '0', width: '500px', backgroundColor: '#F8F9FF !important' }}>
            <div class="card-header pr-2 pl-2">
                <div class="row">
                    <div class="col-sm-11 col-md-11">
                        <h4 class="card-title font-weight-bold">Danh sách phương tiện</h4>
                    </div>
                    <div class="col-sm-1 col-md-1 d-flex align-items-center ">
                        <div class="card-tools " style={{ marginTop: '-5px' }}>
                            <button type="button" class="btn btn-tool text-success" data-card-widget="collapse"><i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body p-0 mt-2">
                <div className="row mb-2">
                    <div className="col-md-6 col-6 p-0 d-flex  justify-content-center">
                        <span className=" text-success " title="Số lượng xe đang hoạt động" style={{ cursor: 'pointer', fontSize: '20px' }}
                            onClick={e => handleClickVehicleSearch(1)}>
                            <i class="fas fa-circle pr-2 " ></i>
                            <strong>{TotalActive}/{dataGr.length}</strong>
                        </span>
                    </div>
                    <div className="col-md-6 col-6 p-0 d-flex  justify-content-center">
                        <span className=" text-danger pl-3" title="Số lượng xe không hoạt động" style={{ cursor: 'pointer', fontSize: '20px' }}
                            onClick={e => handleClickVehicleSearch(2)}>
                            <i class="fas fa-circle pr-2"></i>
                            <strong>{TotalNotActive}/{dataGr.length}</strong>
                        </span>
                    </div>
                </div>
                <div className="mr-2 ml-2 mb-2">
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <div class="input-group">
                                <Select className="SelectMeno"
                                    value={Filter}
                                    onChange={e => handleChangeSelectVehicle(e)}
                                    options={dataFilter}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input type="text" name="" class="form-control" id="" value={valueInput} placeholder="Tìm kiếm"
                                    onChange={e => hadleChangeSearch(e.target.value)} />
                                <div id="div-sender"
                                    class={hindSearch ? "display-none" : "div-sender"}
                                    style={{ maxHeight: '300px', overflow: 'scroll', border: '1px solid #cccccc' }}
                                >
                                    {
                                        dataSearch.length > 0
                                            ? dataSearch.map((item, index) => {
                                                return (
                                                    <p className="select-option-like" key={index}
                                                        onClick={e => {
                                                            SelectVehicle(item)
                                                            setValueInput(item.Plate)
                                                            setHindSearch(true)
                                                        }}>
                                                        {item.Plate}
                                                    </p>
                                                )
                                            })
                                            : <p className="select-option-like" >Không có kết quả</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="p-0 ml-1" style={{ listStyle: 'none', height: '500px', overflowX: 'scroll' }}>
                    {
                        dataVehicle.map((i, index) => {
                            const data = dataBill.filter(e => e.plate == i.Plate)
                            let item = { ...i, ...data[0] }
                            return (
                                <li key={index}>
                                    <div className={isFocus === item.Plate ? " card item-card item-card_focus  mb-2 ml-2 " : " card item-card  mb-2 ml-2 "}
                                    >
                                        <div className="row card-body p-2">
                                            <div className="col-md-1 col-1 p-0 d-flex  justify-content-center align-items-center"
                                                onClick={e => SelectVehicle(item)} style={{ cursor: 'pointer' }}>
                                                {
                                                    item.IsStop
                                                        ? <img src="./assets/img/vehicle2.png" alt="" width="40px" />
                                                        : <img src="./assets/img/vehicle.png" alt="" width="40px" />
                                                }
                                            </div>
                                            <div className="col-9 " onClick={e => SelectVehicle(item)} style={{ cursor: 'pointer' }} >
                                                <div className="row">
                                                    <div className="col-md-6" style={{ fontSize: '13px' }}>
                                                        <div  >
                                                            Xe: <strong className="text-info">{item.Plate}</strong>
                                                        </div>
                                                        <div >
                                                            Vận tốc: <strong className="cl-car">{item.Speed} km/h</strong>
                                                        </div>
                                                        <div >
                                                            Tổng km:  <strong className="cl-car">{item.Km} km</strong>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6" style={{ fontSize: '13px' }}>
                                                        <div >
                                                            Trọng tải:  <strong className="cl-car">{item.SheeatsOrTons} </strong>
                                                        </div>
                                                        <div >
                                                            Tổng đơn:  <strong className="cl-car" >{item.TotalBill || 0}</strong>
                                                        </div>
                                                        <div >
                                                            Doanh thu:  <strong className="cl-car" >{item.Amount || 0} </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                item.RouteVehicleId && (!ShowRoute ?
                                                    <div className="col-md-2 p-0 d-flex align-items-center justify-content-center "
                                                        style={{ color: 'green', fontSize: '25px' }}
                                                        title="Xem lộ trình">
                                                        <i class="fas fa-route  btn-route rounded-circle"
                                                            style={{ cursor: 'pointer', padding: '13px' }}
                                                            onClick={e => {
                                                                setInforVehicle(item)
                                                                CPN_spRouteVehicle_List(item)
                                                            }}
                                                        ></i>
                                                    </div> :
                                                    <div className="col-md-2 p-0 d-flex align-items-center justify-content-center "
                                                        style={{ color: 'red', fontSize: '25px' }}
                                                        title="Xem lộ trình">
                                                        <i class="fas fa-times  btn-route-close rounded-circle pr-3 pl-3"
                                                            style={{ cursor: 'pointer', padding: '13px' }}
                                                            onClick={e => {
                                                                setShowRoute(!ShowRoute)
                                                                setDirection(null)
                                                                setZoom(8)
                                                            }}
                                                        ></i>
                                                    </div>)
                                            }
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>}

            {DataRoute.length > 0 && 
            <div className={1 ? "card  position-absolute" : "display-none  "}
                style={{ top: '0', left: '6px', borderRadius: '0', width: '30%', backgroundColor: '#F8F9FF !important', zIndex: 1000 }}>
                <div class="card-header pr-2 pl-2" style={{ borderBottom: 'none' }}>
                    <div class="d-flex jutify-content-between align-items-center">
                        <div class="col-sm-9 col-md-9">
                            <h6 class="card-title font-weight-bold">CHI TIẾT LỘ TRÌNH XE <span className='text-danger'>{DataRoute[0].LicensePLate}</span></h6>
                        </div>
                        <div class="col-sm-3 col-md-3">
                            <div class="float-right">
                                <div class="card-tools " >
                                    <button type="button" class="btn rounded-circle btn-danger "
                                        onClick={e => {
                                            setDataRoute([])
                                            setShowRoute(!ShowRoute)
                                            setDirection(null)
                                            setZoom(8)
                                        }}
                                    ><i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
           
                    </div>
                </div>
                <div className="card-body p-0 margin-top-10">
                    <div class="pt-2" style={{ height: '450px', overflowX: 'scroll', fontSize: '14px' }}>
                        <TimeLineList />
                    </div>

                </div>

            </div>}

            {/* <div className="card position-absolute" style={{ top: '5px', right: '15px', borderRadius: '0',  background: 'none' }}>
            <i class="fas fa-bell " style={{fontSize:'35px', color:'#FF4646', border:'none'}}></i>         
            </div> */}

        </>
    );
}