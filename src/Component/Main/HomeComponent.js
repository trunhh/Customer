import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import Select from "react-select";
import {
	Alertsuccess,
	Alerterror,
	DecodeString,
	FormatMoney,
	FormatNumber,
	GetCookie,
	GetCookieGroup
} from "../../Utils";
import { Link, useHistory } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import { APIKey, TOKEN_DEVICE } from "../../Services/Api";
import { mainAction } from "../../Redux/Actions";
import { ChartTemp, CanvasChart } from "../../Common";
import LayoutMain from "../../Layout/LayoutMain";

export const HomeComponent = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [CustomerID, setCustomerID] = useState(GetCookie("CustomerID"));
	const [FromDate, setFromDate] = useState(new Date());
	const [ToDate, setToDate] = useState(new Date());
	const FromDateRef = useRef();
	const ToDateRef = useRef();
	const [Disable, setDisable] = useState(false);
	const [DataChart, setDataChart] = useState([]);
	const [DataCanvasChart, setDataCanvasChart] = useState([]);
	const [DataChartPie, setDataChartPie] = useState([
		{ title: "Khách hàng tạo bill", value: 1, color: "#4F91FF" },
		{ title: "Đang lấy hàng", value: 1, color: "#F6655A" },
		{ title: "Đã lấy hàng", value: 1, color: "#555299" },
		{ title: "Đang trung chuyển", value: 1, color: "#B88217" },
		{ title: "Đã nhận lại", value: 1, color: "#BB6BD9" },
		{ title: "Đang phát", value: 1, color: "#56CCF2" },
		{ title: "Thành công", value: 1, color: "#65B168" },
		{ title: "Phát lại", value: 1, color: "#005384" },
		{ title: "Đang phát lại", value: 1, color: "#E5AE40" },
		{ title: "Hoàn gốc", value: 1, color: "#D6000D" },
	]);
	const [CurrentName, setCurrentName] = useState(GetCookie("CustomerName"));

	//#region Trạng thái vận đơn
	const [Status1, setStatus1] = useState(0);
	const [Status2, setStatus2] = useState(0);
	const [Status3, setStatus3] = useState(0);
	const [Status4, setStatus4] = useState(0);
	const [Status5, setStatus5] = useState(0);
	const [Status6, setStatus6] = useState(0);
	const [Status7, setStatus7] = useState(0);
	const [Status8, setStatus8] = useState(0);
	const [Status9, setStatus9] = useState(0);
	const [Status50, setStatus50] = useState(0);
	const [TotalCOD, setTotalCOD] = useState(0);
	const [TotalLading, setTotalLading] = useState(0);
	const [TotalWeight, setTotalWeight] = useState(0);
	const [TotalAmount, setTotalAmount] = useState(0);
	const style = { fontSize: '3px', fontFamily: 'sans-serif', fill: '#333' };
	const [Status1COD, setStatus1COD] = useState(0);
	const [Status2COD, setStatus2COD] = useState(0);
	const [Status3COD, setStatus3COD] = useState(0);
	const [Status4COD, setStatus4COD] = useState(0);
	const [Status5COD, setStatus5COD] = useState(0);
	const [Status6COD, setStatus6COD] = useState(0);
	const [Status7COD, setStatus7COD] = useState(0);
	const [Status8COD, setStatus8COD] = useState(0);
	const [Status9COD, setStatus9COD] = useState(0);
	const [Status50COD, setStatus50COD] = useState(0);

	const [Status1AMOUNT, setStatus1AMOUNT] = useState(0);
	const [Status2AMOUNT, setStatus2AMOUNT] = useState(0);
	const [Status3AMOUNT, setStatus3AMOUNT] = useState(0);
	const [Status4AMOUNT, setStatus4AMOUNT] = useState(0);
	const [Status5AMOUNT, setStatus5AMOUNT] = useState(0);
	const [Status6AMOUNT, setStatus6AMOUNT] = useState(0);
	const [Status7AMOUNT, setStatus7AMOUNT] = useState(0);
	const [Status8AMOUNT, setStatus8AMOUNT] = useState(0);
	const [Status9AMOUNT, setStatus9AMOUNT] = useState(0);
	const [Status50AMOUNT, setStatus50AMOUNT] = useState(0);

	//#endregion Trạng thái vận đơn

	useEffect(() => {
		if (CustomerID === null) {
			history.push("/");
		}
		if (GetCookieGroup("IsChooseCustomer") === "True")
			setCurrentName(GetCookie("CustomerName"));
		else
			setCurrentName(GetCookieGroup("GroupName"));
	}, []);
	const convert = (str) => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	};

	const ChangeTypeSearch = (days) => {
		debugger
		var date = new Date();
		var last = new Date(date.getTime() - (parseInt(days) * 24 * 60 * 60 * 1000));
		var day = last.getDate();
		var month = last.getMonth() + 1;
		var year = last.getFullYear();
		setFromDate(new Date(year + "/" + month + "/" + day));
		setToDate(date);
	}

	const APIC_spLading_SumByStatusOverView = async () => {
		let params = {
			AppAPIKey: APIKey,
			TokenDevices: TOKEN_DEVICE,
			LadingCode: "",
			FromDate: FromDate.toISOString(),
			ToDate: ToDate.toISOString(),
			CustomerID: CustomerID,
			CustomerCode: GetCookie("CustomerCode"),
			CustomerIds: GetCookieGroup("CustomerIds")
		};
		let pr = {
			Json: JSON.stringify(params),
			func: "APIC_spLading_SumByStatusOverView",
		};
		debugger
		const result = await mainAction.API_spCallServer(pr, dispatch);
		let totalCOD = 0, totalLading = 0, totalWeight = 0, totalAmount = 0;
		let _s1 = 0, _s2 = 0, _s3 = 0, _s4 = 0, _s5 = 0, _s50 = 0, _s6 = 0, _s7 = 0, _s8 = 0, _s9 = 0;
		let _s1COD = 0, _s2COD = 0, _s3COD = 0, _s4COD = 0, _s5COD = 0, _s50COD = 0, _s6COD = 0, _s7COD = 0, _s8COD = 0, _s9COD = 0;
		let _s1AMOUNT = 0, _s2AMOUNT = 0, _s3AMOUNT = 0, _s4AMOUNT = 0, _s5AMOUNT = 0, _s50AMOUNT = 0, _s6AMOUNT = 0, _s7AMOUNT = 0, _s8AMOUNT = 0, _s9AMOUNT = 0;
		let arrStatus = [9, 1, 2, 3, 4, 5, 6, 7, 8, 50];
		let listCanvas = [];
		arrStatus.forEach(element => {
			let items = [], title = "";
			result.filter(p => p.Status === element).map((item, index) => {
				totalCOD += (item.Cod === undefined ? 0 : item.Cod);
				totalLading += (item.Total === undefined ? 0 : item.Total);
				totalWeight += (item.Weight === undefined ? 0 : item.Weight);
				totalAmount += (item.Amount === undefined ? 0 : item.Amount);
				items.push({ label: item.CreateDate, y: item.Total });
				if (element === 9) {
					_s9 += (item.Total);
					_s9COD += (item.Cod === undefined ? 0 : item.Cod);
					_s9AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Khách hàng tạo bill";
				}
				if (element === 1) {
					_s1 += (item.Total);
					_s1COD += (item.Cod === undefined ? 0 : item.Cod);
					_s1AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Đang lấy hàng";
				}
				if (element === 2) {
					_s2 += (item.Total);
					_s2COD += (item.Cod === undefined ? 0 : item.Cod);
					_s2AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Đã lấy hàng";
				}
				if (element === 3) {
					_s3 += (item.Total);
					_s3COD += (item.Cod === undefined ? 0 : item.Cod);
					_s3AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Đang trung chuyển";
				}
				if (element === 4) {
					_s4 += (item.Total);
					_s4COD += (item.Cod === undefined ? 0 : item.Cod);
					_s4AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Đã nhận lại";
				}
				if (element === 5) {
					_s5 += (item.Total);
					_s5COD += (item.Cod === undefined ? 0 : item.Cod);
					_s5AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Đang phát";
				}
				if (element === 6) {
					_s6 += (item.Total);
					_s6COD += (item.Cod === undefined ? 0 : item.Cod);
					_s6AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Phát thành công";
				}
				if (element === 7) {
					_s7 += (item.Total);
					_s7COD += (item.Cod === undefined ? 0 : item.Cod);
					_s7AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Phát lại";
				}
				if (element === 8) {
					_s8 += (item.Total);
					_s8COD += (item.Cod === undefined ? 0 : item.Cod);
					_s8AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Hoàn gốc";
				}
				if (element === 50) {
					_s50 += (item.Total);
					_s50COD += (item.Cod === undefined ? 0 : item.Cod);
					_s50AMOUNT += (item.Amount === undefined ? 0 : item.Amount);
					title = "Đang phát lại";
				}
			});

			listCanvas.push(
				{
					type: "column",
					name: title,
					legendText: title,
					showInLegend: true,
					dataPoints: items
				}
			)
		});
		setStatus1(_s1);
		setStatus2(_s2);
		setStatus3(_s3);
		setStatus4(_s4);
		setStatus5(_s5);
		setStatus6(_s6);
		setStatus7(_s7);
		setStatus8(_s8);
		setStatus9(_s9);
		setStatus50(_s50);
		setStatus1COD(FormatMoney(_s1COD));
		setStatus2COD(FormatMoney(_s2COD));
		setStatus3COD(FormatMoney(_s3COD));
		setStatus4COD(FormatMoney(_s4COD));
		setStatus5COD(FormatMoney(_s5COD));
		setStatus6COD(FormatMoney(_s6COD));
		setStatus7COD(FormatMoney(_s7COD));
		setStatus8COD(FormatMoney(_s8COD));
		setStatus9COD(FormatMoney(_s9COD));
		setStatus50COD(FormatMoney(_s50COD));

		setStatus1AMOUNT(FormatMoney(_s1AMOUNT));
		setStatus2AMOUNT(FormatMoney(_s2AMOUNT));
		setStatus3AMOUNT(FormatMoney(_s3AMOUNT));
		setStatus4AMOUNT(FormatMoney(_s4AMOUNT));
		setStatus5AMOUNT(FormatMoney(_s5AMOUNT));
		setStatus6AMOUNT(FormatMoney(_s6AMOUNT));
		setStatus7AMOUNT(FormatMoney(_s7AMOUNT));
		setStatus8AMOUNT(FormatMoney(_s8AMOUNT));
		setStatus9AMOUNT(FormatMoney(_s9AMOUNT));
		setStatus50AMOUNT(FormatMoney(_s50AMOUNT));

		setTotalCOD(FormatMoney(totalCOD));
		setTotalLading(totalLading);
		setTotalWeight(totalWeight);
		setTotalAmount(FormatMoney(totalAmount));
		setDataCanvasChart(listCanvas);//.sort((a,b)=>(a.label > b.label)?1:-1)
		setDataChartPie([
			{ title: "Khách hàng tạo bill", value: _s9, color: "#4F91FF" },
			{ title: "Đang lấy hàng", value: _s1, color: "#F6655A" },
			{ title: "Đã lấy hàng", value: _s2, color: "#555299" },
			{ title: "Đang trung chuyển", value: _s3, color: "#B88217" },
			{ title: "Đã nhận lại", value: _s4, color: "#BB6BD9" },
			{ title: "Đang phát", value: _s5, color: "#56CCF2" },
			{ title: "Thành công", value: _s6, color: "#65B168" },
			{ title: "Phát lại", value: _s7, color: "#005384" },
			{ title: "Đang phát lại", value: _s50, color: "#E5AE40" },
			{ title: "Hoàn gốc", value: _s8, color: "#D6000D" },
		]);
	}

	return (
		<LayoutMain>
			<div className="container-fluid">
				<div className="row cardcus">
					<div className="col-md-12">
						<div className="row HomeTitle">Xin chào, {CurrentName} !</div>
						<div className="row margin-top-10">
							{/* <div className="col-md-4">
								<label> Chọn thời gian</label>
								<div className="form-group mt0">
									<select className="form-control" onChange={(e) => ChangeTypeSearch(e.target.value)} style={{ height: "36px" }}>
										<option value="0">Hôm nay</option>
										<option value="3">3 ngày trước</option>
										<option value="7">7 ngày trước</option>
										<option value="30">30 ngày trước</option>
									</select>
								</div>
							</div> */}
							{/* <div className="col-md-2"><label  style={{color:'3A3A44',fontSize:'14px',fontWeight:'500'}}>Thống kê hiệu suất </label></div> */}
							<div className="col-md-7 row">
								<span style={{ color: '3A3A44', fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>Thống kê hiệu suất </span>
								<div className="form-group mt0 col-md-4 col-sm-6 col-xs-12">
									<DateTimePicker className="form-control"
										onChange={date => setFromDate(date)}
										value={FromDate}
										format='dd/MM/yyyy'
										ref={FromDateRef}
									/>
								</div>
								<div className="form-group mt0 col-md-4 col-md-4 col-sm-6 col-xs-12">
									<span style={{ color: '3A3A44', fontSize: '14px', fontWeight: '500' }}></span>
									<DateTimePicker className="form-control"
										onChange={date => setToDate(date)}
										value={ToDate}
										format='dd/MM/yyyy'
										ref={ToDateRef}
									/>
								</div>
							</div>
							<div className="col-md-2 text-center">
								<button
									disabled={Disable}
									onClick={() => {
										APIC_spLading_SumByStatusOverView();
									}}
									type="button"
									className="btn btn-save btn-sm text-transform"
								>
									<i className="material-icons">search</i>
									Tìm kiếm
								</button>
							</div>

						</div>
						<div className="row mt25 Home">
							<div className="col-md-6 Homechart">
								<div className='Totallading'>{TotalLading}</div>
								<ChartTemp type="Homepie" data={DataChartPie} defaultLabelStyle={style} />
							</div>
							<div className="col-md-5 scrollxs">
								<table class="table table-bordered tableHome" style={{ fontSize: '12px' }} id="dataTable">
									<thead>
										<tr>
											<th className='Minwidth170'>Trạng thái</th>
											<th className='Minwidth70'>Số đơn</th>
											<th className='Minwidth70'>Tiền thu hộ</th>
											<th className='Minwidth70'>Tiền cước</th>
										</tr>
									</thead>
									<tbody>
										<tr >
											<td>
												<span style={{ background: '#4F91FF' }}></span>
												Mới tạo
											</td>
											<td className='text-centerxs'>{Status9}</td>
											<td className='text-centerxs'>{Status9COD}</td>
											<td className='text-centerxs'>{Status9AMOUNT}</td>
										</tr>

										<tr >
											<td>
												<span style={{ background: '#F6655A' }}></span>
												Đang lấy hàng
											</td>
											<td className='text-centerxs'>{Status1}</td>
											<td className='text-centerxs'>{Status1COD}</td>
											<td className='text-centerxs'>{Status1AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#B88217' }}></span>
												Đang trung chuyển
											</td>
											<td className='text-centerxs'>{Status2}</td>
											<td className='text-centerxs'>{Status2COD}</td>
											<td className='text-centerxs'>{Status2AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#555299' }}></span>
												Đã lấy hàng
											</td>
											<td className='text-centerxs'>{Status3}</td>
											<td className='text-centerxs'>{Status3COD}</td>
											<td className='text-centerxs'>{Status3AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#BB6BD9' }}></span>
												Đã nhận lại
											</td>
											<td className='text-centerxs'>{Status4}</td>
											<td className='text-centerxs'>{Status4COD}</td>
											<td className='text-centerxs'>{Status4AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#56CCF2' }}></span>
												Đang phát
											</td>
											<td className='text-centerxs'>{Status5}</td>
											<td className='text-centerxs'>{Status5COD}</td>
											<td className='text-centerxs'>{Status5AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#65B168' }}></span>
												Thành công
											</td>
											<td className='text-centerxs'>{Status6}</td>
											<td className='text-centerxs'>{Status6COD}</td>
											<td className='text-centerxs'>{Status6AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#005384' }}></span>
												Phát lại
											</td>
											<td className='text-centerxs'>{Status7}</td>
											<td className='text-centerxs'>{Status7COD}</td>
											<td className='text-centerxs'>{Status7AMOUNT}</td>
										</tr>
										<tr >
											<td>
												<span style={{ background: '#E5AE40' }}></span>
												Đang phát lại
											</td>
											<td className='text-centerxs'>{Status50}</td>
											<td className='text-centerxs'>{Status50COD}</td>
											<td className='text-centerxs'>{Status50AMOUNT}</td>
										</tr>
										<tr className='shadow-bottom'>
											<td>
												<span style={{ background: '#D6000D' }}></span>
												Hoàn gốc
											</td>
											<td className='text-centerxs'>{Status8}</td>
											<td className='text-centerxs'>{Status8COD}</td>
											<td className='text-centerxs'>{Status8AMOUNT}</td>
										</tr>


									</tbody>
									<tfoot>
										<tr>
											<td>Tổng</td>
											<td className='text-centerxs'>{TotalLading}</td>
											<td className='text-centerxs'>{TotalCOD}</td>
											<td className='text-centerxs'>{TotalAmount}</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</div>
					{/* <div className="col-md-3">
						<div class="alert alert-success text-center" role="alert">
							<p className="font20">TIỀN THU HỘ</p>
							<p className="font30">{FormatMoney(TotalCOD)}đ</p>
						</div> */}
					{/* <div class="alert alert-info text-center" role="alert">
							<p className="font20">CHƯA ĐỐI SOÁT</p>
							<p className="font30">2.000.000đ</p>
						</div> */}
					{/* <div class="alert alert-info text-center" role="alert">
							<p className="font20">TỔNG VẬN ĐƠN</p>
							<p className="font30">{FormatNumber(TotalLading)}</p>
						</div>
						<div class="alert alert-danger text-center" role="alert">
							<p className="font20">TỔNG CƯỚC PHÍ</p>
							<p className="font30">{FormatMoney(TotalAmount)}đ</p>
						</div>
						<div class="alert alert-purple text-center" role="alert">
							<p className="font20">TỔNG TRỌNG LƯỢNG</p>
							<p className="font30">{FormatNumber(TotalWeight)} (g)</p>
						</div> */}
					{/* </div> */}
				</div>
			</div>
		</LayoutMain>
	);
};
