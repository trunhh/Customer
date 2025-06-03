import React from "react";
import { Chart } from "react-charts";  /* npm i react-charts */
import { PieChart } from "react-minimal-pie-chart"; /* npm i react-minimal-pie-chart */

const ChartComp = ({ type, title, data }) => { /* type="bar|line|area|bubble|pie" */

  const series = React.useMemo(/*only use for: bar, line, area, bubble chart*/
    () => ({
      type: type
    }),
    []
  );

  const axes = React.useMemo(/*only use for: bar, line, area, bubble chart*/
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { position: "left", type: "linear", stacked: false },//, 
    ],
    []
  );

  const dataChart = React.useMemo(
    () => data
  );

  const dataChartPie = React.useMemo(
    () => data
  );

  const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
    fill: '#333'
  };
  const defaultLabelStyleHome = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
    fill: '#333',
    display:'none'
  };
  if (type === "Homepie") {
    return (
      <div className="chartStyle" >
        <PieChart data={dataChartPie}
          label={({ dataEntry }) => `${dataEntry.value !== 0 ? Math.round(dataEntry.percentage) + "%" : ""} `}
          labelStyle={{ ...defaultLabelStyleHome }}
          style={{ height: '350px', marginBottom: '30px' }}
          lineWidth={40}
        />
      </div>
    )
  }
  if (type === "pie") {
    return (
      <div className="chartStyle" >
        <PieChart data={dataChartPie}
          label={({ dataEntry }) => `${dataEntry.value !== 0 ? Math.round(dataEntry.percentage) + "%" : ""} `}
          labelStyle={{ ...defaultLabelStyle }}
          style={{ height: '250px', marginBottom: '30px' }}
          lineWidth={70}
        />
      </div>
    )
  }
  else {
    return (
      <div className="chartStyle" style={{ minHeight: "400px", width: "100%", overflowX: "scroll", overflowY: "hidden" }}>
        <Chart
          data={dataChart}
          series={series}
          axes={axes}
          tooltip
          title={title}
        />
      </div >
    );
  }
};

export const ChartTemp = React.memo(ChartComp);
