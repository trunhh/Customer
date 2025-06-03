import React, { useState, useEffect, useDebugValue } from "react";
import { useDispatch } from "react-redux";
import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "react-google-maps";
import axios from "axios";
import Select from 'react-select';

import { DataTable } from "../../Common/DataTable";
import { mainAction } from "../../Redux/Actions";
import { Alertwarning, FormatDateJson, FormatMoney, GetCookie, FormatNumber } from "../../Utils";
import I18n from "../../Language";

export const GoogleMapComponent = ({ data = [] }) => {

  //#region Khai báo biến

  const dispatch = useDispatch();

  const [selectedPark, setSelectedPark] = useState(null);
  const [InfoPosst, setInfoPosst] = useState({});
  const [Direction, setDirection] = useState([]);

  const [dataGr, setdataGr] = useState([]);
  const [Zoom, setZoom] = useState(5);
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
  const [InforVehicle, setInforVehicle] = useState({});
  const [FromLocation, setFromLocation] = useState();
  const [ShowRoute, setShowRoute] = useState(false);

  //#endregion

  //#region  Call API adsun khi moi vao

  useEffect(() => {
    CPN_spType_Local();
    //CPN_spRouterPostOffice_List();
    CPN_Vehicle_Adsun_List();
    APIC_spVehicle_List();
    let today = new Date();
    let lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    setFromDate(new Date(FromDate));
    CPN_spRouteVehicle_List_Update(lastDay);

    FilterVehicle(Filter);
    setInterval(CPN_Vehicle_Adsun_List, 5000);
    setInterval(APIC_spVehicle_List, 5000);
  }, []);

  //#endregion

  //#region  Call API adsun lấy danh sách xe netco

  const CPN_Vehicle_Adsun_List = async () => {
    let instance = axios.create({
      baseURL: `https://shareapi.adsun.vn/Vehicle/GpsInfo?pageId=3304&username=netco&pwd=123456`,
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

  //#endregion

  //#region Call API lấy danh sách xe thuê

  const [VehicleRent, setVehicleRent] = useState([]);
  const APIC_spVehicle_List = async (row) => {
    try {
      const params = {
        Json: "{}",
        func: "APIC_spVehicle_List"
      }
      const res = await mainAction.API_spCallServer(params, dispatch);
      setVehicleRent(res);
    } catch (error) {
      Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT NETCO")
      console.log(error);
    }
  }
  //#endregion

  //#region Call filter list xe

  useEffect(() => {
    FilterVehicle(Filter)
  }, [Filter]);

  //#endregion

  //#region Load thông tin chi tiết từng xe

  const [SumAmount, setSumAmount] = useState(0);
  const [CountBill, setCountBill] = useState(0);

  const CPN_spRouteVehicle_List_Update = async (from) => {
    setdataGr([])
    const pr = {
      FromDate: FormatDateJson(from, 3),
      ToDate: FormatDateJson(ToDate, 4) + ' 11:59 PM',
      AreaId: 0,
      PostId: 0,
      VehicleId: 0,
      CustomerId: GetCookie("CustomerID")
    }
    try {
      const params = {
        Json: JSON.stringify(pr),
        func: "APIC_spRouteVehicle_List_Update"
      }
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        let _countBill = 0, _sumAmount = 0;
        let newData = res.map(i => {
          _countBill += i.TotalBillCreate;
          _sumAmount += i.TotalAmountCreate;
          return {
            ...i,
            TotalWeight: Math.round(i.TotalKGCreate) || 0,
            TotalKG: Math.round(i.TotalKGCreate) || 0,
            RemainKG: (i.WeightVehicle - Math.round(i.TotalKGCreate)),
            Amount: i.TotalAmountCreate?.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") || 0,
            TotalBill: i.TotalBillCreate,
            plate: i.LicensePlate
          }
        });
        setSumAmount(_sumAmount);
        setCountBill(_countBill);
        setDataBill(newData);
        return;
      }
      return

    } catch (error) {
      Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT NETCO")
      console.log(error);
    }
  }

  //#endregion

  //#region get lo trinh

  const CPN_spRouteVehicle_List = async (row) => {
    setIsFocus(row.LicensePlate);
    const pr = {
      RouteVehicleId: row.RouteVehicleId,
      CustomerId: GetCookie("CustomerID")
    }
    try {
      const params = {
        Json: JSON.stringify(pr),
        func: "APIC_spRouteVehicle_List"
      }
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        let newData = res.sort((a, b) => a.IsOrderby > b.IsOrderby ? 1 : -1)
        CreateRoute(newData);
        setInforVehicle(row);
        return;
      } else {
        Alertwarning("Không có dữ liệu")
        return;
      }
    } catch (error) {
      Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT NETCO")
      console.log(error);
    }
  }

  //#endregion

  //#region Active bưu cục

  const CPN_spRouterPostOffice_List = async (row) => {
    try {
      const params = {
        Json: JSON.stringify({
          OfficerId: 128//GetDataFromLogin("OfficerID")
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
      Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT NETCO")
      console.log(error);
    }
  }

  //#endregion

  //#region Create Router || tạo lộ trình

  const CreateRoute = async (data) => {

    let destination = {}, origin = {}, arrDirection = [], dataTemp = [...data], getTimeDirections = [];
    //tach neu qua 25 diem
    const resultChunk = ChunkPoints(dataTemp, 23)
    setFromLocation({ lat: +data[0].LatFrom, lng: +data[0].LngFrom })
    //loop chi duong
    for (let indexChunk = 0; indexChunk < resultChunk.length; indexChunk++) {
      const element = resultChunk[indexChunk];

      //diem dau va diem cuoi
      if (resultChunk.length === 1) {
        data[0].IsReturn ?
          destination = { lat: +data[0].LatFrom, lng: +data[0].LngFrom } :
          destination = { lat: +data[data.length - 1].LatTo, lng: +data[data.length - 1].LngTo };
        origin = { lat: +data[0].LatFrom, lng: +data[0].LngFrom }
      } else {

        if (indexChunk + 1 === resultChunk.length) {
          data[0].IsReturn ?
            destination = { lat: +data[0].LatFrom, lng: +data[0].LngFrom } :
            destination = { lat: +element[element.length - 1].LatTo, lng: +element[element.length - 1].LngTo };
          origin = { lat: +element[0].LatFrom, lng: +element[0].LngFrom }

        } else {
          destination = { lat: +element[element.length - 1].LatTo, lng: +element[element.length - 1].LngTo };
          origin = indexChunk === 0
            ? { lat: +data[0].LatFrom, lng: +data[0].LngFrom }
            : { lat: +element[0].LatFrom, lng: +element[0].LngFrom }
        }
      }

      const poinst = element.map(i => {
        return { location: { lat: +i.LatTo, lng: +i.LngTo }, stopover: true }
      })

      const DirectionsService = new window.google.maps.DirectionsService();

      await DirectionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints: poinst
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {

            let dataAddDuration = element.map((item, index) => {
              let Distance = (result.routes[0].legs[index].distance.value / 1000).toFixed(2);
              let Duration = +((result.routes[0].legs[index].duration.value / 60).toFixed(2));
              return {
                ...item,
                Distance: Distance,
                Duration: Duration,
              }
            })

            getTimeDirections.push(...dataAddDuration)
            arrDirection.push(result)

          } else {
            Alertwarning("Lỗi tạo lộ trình, vui lòng thử lại")
            return;
          }
        }
      );
    }
    setDirection(arrDirection);
    setDataRoute(getTimeDirections);
    setShowRoute(true);
    setZoom(10);
  }
  //#endregion

  //#region Danh sách chi tiết lộ trình TimeLineList

  const TimeLineList = () => {
    return (
      <>
        <ul className="p-0 ml-1" style={{ listStyle: 'none', height: 'calc(100vh - 230px)', overflowX: 'hidden', overflowY: "auto", backgroundColor: "#CDE0EA" }}>
          <li style={{ fontWeight: 500, fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "#FFF", paddingBottom: "15px" }}>
            <div className="col-10 pt-1 pl-2">
              <i class="fa fa-home mr-2 text-success"></i>
              <b class="text-success ">Xuất phát: </b>
              <b class=" text-text-dark" style={DataRoute[0]?.TypeFinish === 1 ? { color: "grey" } : { color: "#000" }}>{DataRoute[0]?.AddressFromName}</b>
            </div>
          </li>

          {DataRoute?.map((it, i) => {
            return (
              <li key={"dts" + i} style={it.TotalTransportCustomer > 0 || it.TotalPickupCustomer > 0 ? { fontWeight: 500, fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "yellow", paddingBottom: "15px" } : { fontWeight: 500, fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "#FFF", paddingBottom: "15px" }}>
                <div className="col-10 pt-1 pl-2" title={it.TypeFinish === 1 ? (it.TotalTransportCustomer > 0 || it.TotalPickupCustomer > 0 ? "Xe đã hoàn tất giao/lấy hàng tại địa điểm của bạn" : "Xe đã đi qua điểm này") : (it.TotalTransportCustomer > 0 || it.TotalPickupCustomer > 0 ? "Xe sắp đi tới địa điểm giao/lấy hàng của bạn" : "Xe sắp đi tới điểm này")}>
                  <i class="fa fa-map-marker mr-1 text-success"></i>
                  <b class="text-success">{it.IsOrderby}. </b>
                  <b class="text-text-dark" style={it.TypeFinish === 1 ? (it.TotalTransportCustomer > 0 || it.TotalPickupCustomer > 0 ? { color: "orange" } : { color: "grey" }) : (it.TotalTransportCustomer > 0 || it.TotalPickupCustomer > 0 ? { color: "red" } : { color: "#000" })}>{it.AddressToName} </b>
                  <i class="font-weight-bold text-muted" style={{ fontSize: '12px' }}> ({it.Distance} KM - {(it.Duration).toFixed(2)} Phút)</i>
                </div>
              </li>
            )
          }
          )}
        </ul>
      </>
    )

  }
  //#endregion

  //#region Select Xe

  const SelectVehicle = (item) => {
    if (!ShowRoute) {
      setSelectedPark(item)
      setCenter({ lat: +item.Lat, lng: +item.Lng })
      setZoom(25);
      setIsFocus(item.Plate)
      return
    } else {
      if (InforVehicle.LicensePlate == item.LicensePlate) {
        setSelectedPark(item)
        setCenter({ lat: +item.Lat, lng: +item.Lng })
        setZoom(25);
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

  const handleChangeSelectTypeRoute = (e) => {
    setTypeRoute(e);
    //FilterVehicle(e)
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

  //#region Xu ly load danh sach van don

  const [LadingList, setLadingList] = useState([]);
  const APIC_spVehicle_Lading = async () => {
    try {
      const params = {
        Json: JSON.stringify({ "CustomerId": GetCookie("CustomerID") }),
        func: "APIC_spVehicle_Lading_Test"
      }
      const res = await mainAction.API_spCallServer(params, dispatch);
      setLadingList(res);

    } catch (error) {
      Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT NETCO")
      console.log(error);
    }
  }

  const columns = [
    {
      Header: "Tùy chọn",
      Cell: ({ row }) =>
        row._original.StatusName === "Đang Phát" ? (<span data-toggle="modal" data-target="#modalImg">
          <i className="fa fa-map green" title="Xem vị trí đơn hàng" onClick={e => AddLadingMarker(row)}></i>
        </span>) : (<>{row._original.Status}</>)
      ,
      minWidth: 80,
      filterable: false,
    },
    {
      Header: "STT",
      Cell: (item) => <span>{item.index + 1}</span>,
      maxWidth: 70,
      filterable: false,
    },
    {
      Header: "Tình trạng",
      accessor: "StatusName",
      width: 190,
      Cell: (item) => item.value !== "Đã Phát Thành Công" ? (<span style={{ background: 'red', color: 'white', padding: '3px 7px', borderRadius: '4px' }}>{item.value}</span>) : (<span style={{ background: '#65B168', color: 'white', padding: '3px 7px', borderRadius: '4px' }}>{item.value}</span>),
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
      Header: "Mã vận đơn",
      accessor: "Code",
      minWidth: 160,
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
      minWidth: 140,
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
  ];

  const [ShowLadingMarker, setShowLadingMarker] = useState(false);
  const [ShowLadingInfo, setShowLadingInfo] = useState(false);
  const [LadingMarker, setLadingMarker] = useState({});
  const AddLadingMarker = (item) => {
    debugger
    let a = VehicleRent.find(p => p.VehicleId === item._original.VehicleId);
    let b = dataVehicle.find(p => p.Plate === a.Plate);
    //NẾU Status của Lading = chưa hoàn thành => lấy vị trí theo xe. Đã hoàn thành lộ trình thì lấy vị trí theo vị trí của đơn đó trong lộ trình
    let c = { ...item, ...(b === undefined ? a : b) }
    setLadingMarker(c);
    setCenter({ lat: +b?.Lat, lng: +b?.Lng })
    setZoom(15);
    setShowLadingMarker(true);
    setShowLadingInfo(true);
  }

  //#endregion

  //#region Tách số điểm giao nếu vượt quá 25 điểm
  const ChunkPoints = (arrayData, chunk_size) => {
    let results = [];

    while (arrayData.length) {
      results.push(arrayData.splice(0, chunk_size));
    }

    return results;
  }
  //#endregion

  //#region Load Marker, InfoWindow, Direction

  const MarkerHtml = (
    <>
      {/* Render All POstOffice */}
      {
        !ShowRoute && !selectedPark && DataPostOffice.map((k, i) => {//active post
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
        })
      }

      {/* Render All Vehicle */}
      {
        !ShowRoute && dataVehicle.map((address, i) => {
          const data = dataBill.filter(item => item.plate === address.Plate);
          let obj = { ...address, ...data[0] }
          let url = obj.IsStop
            ? `./assets/img/Vehicle/off${(parseInt(obj.Angle / 10, 10) + 1) * 10}.png`
            : `./assets/img/Vehicle/on${(parseInt(obj.Angle / 10, 10) + 1) * 10}.png`
          if (obj.TotalBill > 0) {
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
        })
      }

      {
        !ShowRoute && VehicleRent.map((address, i) => {
          let a = dataVehicle.filter(p => p.Plate === address.Plate);
          if (a.length === 0) {
            const data = dataBill.filter(item => item.plate === address.Plate)
            let obj = { ...address, ...data[0] }
            let url = obj.IsStop
              ? `./assets/img/Vehicle/off${(parseInt(10 / 10, 10) + 1) * 10}.png`
              : `./assets/img/Vehicle/on${(parseInt(10 / 10, 10) + 1) * 10}.png`
            if (obj.TotalBill > 0) {
              return (
                <Marker
                  key={i}
                  position={{ lat: +obj.Lat, lng: +obj.Lng }}
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
          }
        })
      }

      {/*============== Render Route =============*/}
      {
        ShowRoute && DataRoute.length > 0 && <Marker
          position={FromLocation}
          icon={{
            url: `./assets/img/post.png`,
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />
      }

      {
        ShowRoute && DataRoute.map((address, i) => {
          let textColor = 'green'
          if (address.TypeFinish === 1 && (address.TotalTransportCustomer > 0 || address.TotalPickupCustomer > 0))
            textColor = 'orange'
          else if (address.TypeFinish === 0 && (address.TotalTransportCustomer > 0 || address.TotalPickupCustomer > 0))
            textColor = 'red';
          else if (address.TypeFinish === 1 && address.TotalTransportCustomer === 0 || address.TotalPickupCustomer === 0)
            textColor = 'grey';
          else
            textColor = 'green'
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
        })
      }

      {ShowRoute && (<Marker
        position={{ lat: +InforVehicle.Lat, lng: +InforVehicle.Lng }}
        onClick={() => {
          setSelectedPark(InforVehicle);
          setIsFocus(InforVehicle.Plate);
        }}
        icon={{
          url: "./assets/img/Vehicle/on"+((parseInt(1, 10) + 1) * 10)+".png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: { x: 20, y: 20 }
        }}
      />
      )}

      {/* {
        ShowRoute && dataVehicle.map((address, i) => {
          if (address.Plate == InforVehicle.LicensePlate) {
            let obj = { ...address, ...data[0] }
            let url = obj.IsStop
              ? `./assets/img/Vehicle/off${(parseInt((obj.Angle === undefined ? 10 : obj.Angle) / 10, 10) + 1) * 10}.png`
              : `./assets/img/Vehicle/on${(parseInt((obj.Angle === undefined ? 10 : obj.Angle) / 10, 10) + 1) * 10}.png`

            return (
              <Marker
                key={i}
                position={{ lat: +obj.Lat, lng: +obj.Lng }}
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
        })
      } */}

      {
        ShowLadingMarker && LadingMarker !== {} && (
          <Marker
            position={{ lat: +LadingMarker.Lat, lng: +LadingMarker.Lng }}
            onClick={(e) => setShowLadingInfo(true)}
            /* icon={{
              url: './assets/img/Vehicle/box${(parseInt(1, 10) + 1) * 10}.png',
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: { x: 20, y: 20 }
            }} */
            icon={{
              url: `https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png`,
              scaledSize: new window.google.maps.Size(30, 40)
            }}
          />
        )
      }
    </>
  )

  const InfoWindowHtml = (
    <>

      {!ShowRoute && selectedPark && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedPark(null)
            setIsFocus(null)
          }}
          position={{
            lat: +selectedPark.Lat,
            lng: +selectedPark.Lng
          }}
          clickable={true}
          options={{
            width: '100px'
          }}
        >
          <div className="row" style={{ width: "300px", overflow: "hidden" }}>
            <div className="col-md-12 col-12">
              <h4 className="cl-car">Thông tin xe</h4>
              <div className="row" style={{ fontSize: '15px' }}>
                <div className="col-md-12 col-12">
                  <p className="mb-2"><span className="font-weight-bold">Xe:</span> {selectedPark?.Plate}  {selectedPark?.IsStop ? "(Tạm dừng)" : "(Đang chạy)"}</p>
                  {/* <p className="mb-2"><span className="font-weight-bold">Trọng tải:</span> {selectedPark?.SheeatsOrTons}</p>
                  <p className="mb-2"> <span className="font-weight-bold">Vận tốc:</span>  {selectedPark?.Speed} km/h</p>
                  <p className="mb-2"><span className="font-weight-bold">Tổng Km trong ngày:</span>  {selectedPark?.Km} km</p>
 */}                </div>
                <div className="col-md-12 col-12">
                  <p className="mb-2"><span className="font-weight-bold">Số lần dừng:</span> {selectedPark?.StopCounter}</p>
                  <p className="mb-2"><span className="font-weight-bold">Tổng thời gian dừng:</span> {selectedPark?.StopTime}</p>
                  <p className="mb-2"><span className="font-weight-bold">Số lần quá tốc độ:</span> {selectedPark?.OverSpeedCount}</p>
                </div>
                <div className="col-md-12 col-12">
                  <p className="mb-2"><span className="font-weight-bold">Địa chỉ hiện tại:</span> {selectedPark?.Address}</p>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-12 mt-3">
              <h4 className="cl-car">Thông tin hàng</h4>
              <div className="row" style={{ fontSize: '15px' }}>
                <div className="col-md-12 col-12">
                  <p className="mb-2"><span className="font-weight-bold">Tổng bill:</span> {selectedPark.TotalBill || 0}</p>
                  <p className="mb-2"><span className="font-weight-bold">Hoàn thành:</span> {(selectedPark.BillFinal ?? 0) + '/' + (selectedPark.TotalBill ?? 0)}</p>
                  <p className="mb-2"><span className="font-weight-bold">Đang xử lý:</span>  {(selectedPark.BillProcessing ?? 0) + '/' + (selectedPark.TotalBill ?? 0)}</p>
                  <p className="mb-2"> <span className="font-weight-bold">Cước phí:</span>  {selectedPark.Amount || 0} VND</p>

                </div>
              </div>
            </div>

          </div>
        </InfoWindow>
      )}

      {/* active post */}
      {/* {InfoPosst && (
        <InfoWindow
          onCloseClick={() => {
            setInfoPosst({ Lat: undefined })
          }}
          position={{
            lat: +InfoPosst?.Lat,
            lng: +InfoPosst?.Lng
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
                  <p className="mb-2"><span className="font-weight-bold">Tên :</span> {InfoPosst?.POName}</p>
                  <p className="mb-2"><span className="font-weight-bold">SĐT :</span> {InfoPosst?.POPhone}</p>
                  <p className="mb-2"><span className="font-weight-bold">Địa chỉ:</span> {InfoPosst?.POAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </InfoWindow>
      )} */}

      {
        ShowLadingInfo && LadingMarker !== {} && (
          <InfoWindow
            onCloseClick={(e) => {
              setShowLadingInfo(false);
            }}
            position={{
              lat: +LadingMarker?.Lat,
              lng: +LadingMarker?.Lng
            }}
            clickable={true}
            options={{
              width: '300px'
            }}
          >
            <div className="row">
              <div className="col-md-12 col-12">
                <h4 className="cl-car">Thông tin đơn hàng</h4>
                <div className="row" style={{ fontSize: '15px' }}>
                  <div className="col-md-12 col-12">
                    <p className="mb-2"><span className="font-weight-bold">Mã đơn hàng :</span> {LadingMarker?.Code}</p>
                    <p className="mb-2"><span className="font-weight-bold">Trạng thái :</span> {LadingMarker?.StatusName}</p>
                    <p className="mb-2"><span className="font-weight-bold">Biển số xe :</span> {LadingMarker?.Plate}</p>
                  </div>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}

    </>
  )

  const DirectionHtml = (
    <>
      {Direction && Direction.map((item, index) => {
        return (
          <DirectionsRenderer
            key={index}
            directions={item}
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
          />
        )
      })
      }
    </>
  )

  //#endregion

  const [typeRoute, setTypeRoute] = useState({ value: "All", label: "Tất cả" });
  return (
    <>
      <GoogleMap
        defaultZoom={Zoom}
        scrollwheel={true}
        defaultCenter={Center}
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
        {MarkerHtml}
        {InfoWindowHtml}
        {DirectionHtml}
      </GoogleMap>
      {DataRoute.length === 0 &&
        <div className="card" style={{ position: "absolute", zIndex: 1, width: "450px", marginTop: 0, top: "120px" }}>
          <div class="card-header">
            <h5 className="mb-0 green bold" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              {I18n.t("Vehicle.ListVehicle")}
              <div className="pull-right"><i className="fa fa-plus"></i></div>
            </h5>
          </div>
          <div className="card-body collapse" id="collapseOne" style={{ height: "calc(100vh - 200px)", borderTop: "2px solid green" }} aria-labelledby="headingOne" data-parent="#accordion">
            {/* <div className="row mb-2">
              <div className="col-md-6 col-6 p-0 d-flex  justify-content-center">
                <span className=" text-success " title="Số lượng xe đang hoạt động" style={{ cursor: 'pointer', fontSize: '20px' }}
                  onClick={e => handleClickVehicleSearch(1)}>
                  <i className="fa fa-circle pr-2 " ></i>
                  <b>{TotalActive}/{TotalActive + TotalNotActive}</b>
                </span>
              </div>
              <div className="col-md-6 col-6 p-0 d-flex  justify-content-center">
                <span className=" text-danger pl-3" title="Số lượng xe không hoạt động" style={{ cursor: 'pointer', fontSize: '20px' }}
                  onClick={e => handleClickVehicleSearch(2)}>
                  <i className="fa fa-circle pr-2"></i>
                  <b>{TotalNotActive}/{TotalActive + TotalNotActive}</b>
                </span>
              </div>
            </div> */}
            <div className="row mb-2" data-toggle="modal" data-target="#modalImg">
              <div className="col-md-5 col-5 p-0 d-flex  justify-content-center" onClick={e => APIC_spVehicle_Lading()}>
                Tổng đơn: <b>{CountBill}</b>
              </div>
              <div className="col-md-7 col-7 p-0 d-flex  justify-content-center">
                Tổng cước: <b>{FormatMoney(SumAmount)} VND</b>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-2">
                <div className="form-group">
                  <Select className="SelectMeno"
                    value={Filter}
                    onChange={e => handleChangeSelectVehicle(e)}
                    options={[
                      { value: 0, label: 'Tất cả' },
                      { value: 1, label: 'Di chuyển' },
                      { value: 2, label: 'Dừng' }

                    ]}
                  />
                </div>
              </div>
              <div className="col-md-4 mb-2">
                <div className="form-group">
                  <Select className="SelectMeno"
                    value={typeRoute}
                    onChange={e => handleChangeSelectTypeRoute(e)}
                    options={[
                      { value: "All", label: 'Tất cả' },
                      { value: "Pickup", label: 'Điểm lấy' },
                      { value: "Internal", label: 'Điểm trung chuyển' },
                      { value: "Delivery", label: 'Điểm phát' },
                    ]}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <input type="text" name="" className="form-control" id="" value={valueInput} placeholder="Tìm kiếm"
                    onChange={e => hadleChangeSearch(e.target.value)} />
                  <div id="div-sender"
                    className={hindSearch ? "display-none" : "div-sender"}
                    style={{ maxHeight: 'calc(100vh - 250px)', overflow: 'scroll', border: '1px solid #cccccc' }}
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
            <ul className="p-0 ml-1" style={{ listStyle: 'none', height: 'calc(100vh - 330px)', overflowX: 'hidden', backgroundColor: "#CDE0EA" }}>
              {
                dataVehicle.map((i, index) => {
                  const data = dataBill.filter(e => e.plate == i.Plate)
                  let item = { ...i, ...data[0] }
                  if (item.TotalBill > 0 && (typeRoute.value === "All" || item.TypeRoute === typeRoute.value)) {
                    return (
                      <li key={index + 'asv'} style={isFocus === item.Plate ? { fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "#CDF0EA" } : { fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "#FFF" }}>
                        <div className="row pt-2 pb-2">
                          <div className="col-2 p-0 text-center pt-3" style={{}} onClick={e => SelectVehicle(item)}>
                            {
                              item.IsStop
                                ? <img src="./assets/img/vehicle2.png" alt="" width="40px" />
                                : <img src="./assets/img/vehicle.png" alt="" width="40px" />
                            }
                          </div>
                          <div className="col-3 p-0" style={{}} onClick={e => SelectVehicle(item)}>
                            <div>
                              Xe: <strong className="text-info">{item.plate} ({item.TypeRoute==="Delivery"?"Phát hàng":(item.TypeRoute==="Pickup"?"Lấy hàng":"Trung chuyển")})</strong>
                            </div>
                            <div>
                              Vận tốc: <strong className="cl-car">{item.Speed} km/h</strong>
                            </div>
                            <div>
                              Tổng km:  <strong className="cl-car">{item.Km} km</strong>
                            </div>
                          </div>
                          <div className="col-5 p-0" style={{}} onClick={e => SelectVehicle(item)}>
                            <div>
                              Trọng tải:  <strong className="cl-car">{item.SheeatsOrTons} </strong>
                            </div>
                            <div>
                              Tổng đơn:  <strong className="cl-car" >{item.TotalBill || 0}</strong>
                            </div>
                            <div>
                              Cước phí:  <strong className="cl-car" >{item.Amount || 0} VND</strong>
                            </div>
                          </div>
                          {
                            item.RouteVehicleId && (!ShowRoute ?
                              (<div className="col-2 p-0" style={{ color: "green", fontSize: "25px", }} title="Xem lộ trình">
                                <i class="material-icons   btn-route rounded-circle"
                                  style={{ cursor: "pointer", padding: "13px", borderRadius: "100%", backgroundColor: "#ebf5e5" }}
                                  onClick={(e) => {
                                    setInforVehicle(item);
                                    CPN_spRouteVehicle_List(item);
                                  }}>insights
                                </i>
                              </div>) :
                              (<div className="col-2 p-0" style={{ color: 'red', fontSize: '25px' }} title="Xem lộ trình">
                                <i className="fa fa-times  btn-route-close rounded-circle pr-3 pl-3"
                                  style={{ cursor: "pointer", padding: "13px", borderRadius: "100%", backgroundColor: "#ffb8b3", width: "50px" }}
                                  onClick={(e) => {
                                    setShowRoute(!ShowRoute);
                                    setDirection(null);
                                    setZoom(8);
                                  }}
                                ></i>
                              </div>))
                          }
                        </div>
                      </li>
                    )
                  }
                })
              }
              {
                VehicleRent.map((i, index) => {
                  let a = dataVehicle.filter(p => p.Plate == i.Plate);
                  if (a.length === 0) {
                    const data = dataBill.filter(e => e.plate == i.Plate)
                    let item = { ...i, ...data[0] }
                    if (item.TotalBill > 0 && (typeRoute.value === "All" || item.TypeRoute === typeRoute.value)) {
                      return (
                        <li key={index + 'asv'} style={isFocus === item.Plate ? { fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "#CDF0EA" } : { fontSize: "13px", cursor: "pointer", boxShadow: "rgb(153 196 227 / 50%) 2px 4px 10px", margin: "10px", backgroundColor: "#FFF" }}>
                          <div className="row pt-2 pb-2">
                            <div className="col-2 p-0 text-center pt-3" style={{}} onClick={e => SelectVehicle(item)}>
                              {
                                item.IsStop
                                  ? <img src="./assets/img/vehicle2.png" alt="" width="40px" />
                                  : <img src="./assets/img/vehicle.png" alt="" width="40px" />
                              }
                            </div>
                            <div className="col-3 p-0" style={{}} onClick={e => SelectVehicle(item)}>
                              <div>
                                Xe: <strong className="text-info">{item.plate} ({item.TypeRoute==="Delivery"?"Phát hàng":(item.TypeRoute==="Pickup"?"Lấy hàng":"Trung chuyển")})</strong>
                              </div>
                              <div>
                                Vận tốc: <strong className="cl-car">{item.Speed} km/h</strong>
                              </div>
                              <div>
                                Tổng km:  <strong className="cl-car">{item.Km} km</strong>
                              </div>
                            </div>
                            <div className="col-5 p-0" style={{}} onClick={e => SelectVehicle(item)}>
                              <div>
                                Trọng tải:  <strong className="cl-car">{item.SheeatsOrTons} </strong>
                              </div>
                              <div>
                                Tổng đơn:  <strong className="cl-car" >{item.TotalBill || 0}</strong>
                              </div>
                              <div>
                                Cước phí:  <strong className="cl-car" >{item.Amount || 0} VND</strong>
                              </div>
                            </div>
                            {
                              item.RouteVehicleId && (!ShowRoute ?
                                (<div className="col-2 p-0" style={{ color: "green", fontSize: "25px", }} title="Xem lộ trình">
                                  <i class="material-icons   btn-route rounded-circle"
                                    style={{ cursor: "pointer", padding: "13px", borderRadius: "100%", backgroundColor: "#ebf5e5" }}
                                    onClick={(e) => {
                                      setInforVehicle(item);
                                      CPN_spRouteVehicle_List(item);
                                    }}>insights
                                  </i>
                                </div>) :
                                (<div className="col-2 p-0" style={{ color: 'red', fontSize: '25px' }} title="Xem lộ trình">
                                  <i className="fa fa-times  btn-route-close rounded-circle pr-3 pl-3"
                                    style={{ cursor: "pointer", padding: "13px", borderRadius: "100%", backgroundColor: "#ffb8b3", width: "50px" }}
                                    onClick={e => {
                                      setShowRoute(!ShowRoute);
                                      setDirection(null);
                                      setZoom(8);
                                    }}
                                  ></i>
                                </div>))
                            }
                          </div>
                        </li>
                      )
                    }
                  }
                })
              }
            </ul>
          </div>
        </div>}

      {DataRoute.length > 0 &&
        <div className={"card"} style={{ position: "absolute", zIndex: 1, width: "450px", marginTop: 0, top: "120px" }}>
          <div class="card-header">
            <h5 className="mb-0 green bold">CHI TIẾT LỘ TRÌNH XE <span className='text-danger'>{DataRoute[0].LicensePLate}</span>
              <div class="pull-right">
                <i className="fa fa-times  btn-route-close rounded-circle"
                  style={{ color: "red" }}
                  onClick={e => {
                    setDataRoute([]);
                    setShowRoute(!ShowRoute);
                    setDirection(null);
                    setZoom(8);
                  }}
                ></i>
              </div>
            </h5>
          </div>
          <div className="card-body" style={{ height: "calc(100vh - 200px)", borderTop: "2px solid green", overflow: "hidden" }}>
            <TimeLineList />
          </div>
        </div>
      }

      <div class="modal fade" id="modalImg" tabindex="-1" role="dialog" aria-labelledby="modalImg" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Danh sách vận đơn có lộ trình lấy/trung chuyển/phát</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-center">
              <DataTable data={LadingList} columns={columns} />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">
                <i className="fa fa-close"></i> Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
