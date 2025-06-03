import { CanvasChart } from '../../Common';

export const TestChart = () => {
  let data = [{
    type: "column",
    name: "Proven Oil Reserves (bn)",
    legendText: "Đang phát",
    showInLegend: true,
    dataPoints: [
      { label: "Saudi", y: 266.21 },
      { label: "Venezuela", y: 302.25 },
      { label: "Iran", y: 157.20 },
      { label: "Iraq", y: 148.77 },
      { label: "Kuwait", y: 101.50 },
      { label: "UAE", y: 97.8 }
    ]
  },
  {
    type: "column",
    name: "Oil Production (million/day)",
    legendText: "Phát thành công",
    axisYType: "secondary",
    showInLegend: true,
    dataPoints: [
      { label: "Saudi", y: 10.46 },
      { label: "Venezuela", y: 2.27 },
      { label: "Iran", y: 3.99 },
      { label: "Iraq", y: 4.45 },
      { label: "Kuwait", y: 2.92 },
      { label: "UAE", y: 3.1 }
    ]
  }]
  {/* <div className="col-md-6">
    <ChartTemp type="bar" data={dataChart} />
  </div>
  <div className="col-md-6">
    <ChartTemp type="line" data={dataChart} />
  </div>
  <div className="col-md-6">
    <ChartTemp type="bubble" data={dataChart} />
  </div>
  <div className="col-md-6">
    <ChartTemp type="area" data={dataChart} />
  </div>
  <div className="col-md-6">
    <Barcode value="a123456789" {...config} />
  </div> */}

  return (
    <CanvasChart data={data} />
  )
}