import React from "react";
import { CanvasJSChart } from 'canvasjs-react-charts'

export const CanvasChartComp = ({ title, data = [] }) => {
  const options = {
    animationEnabled: true,
    title: {
      text: title
    },
    colorSet: ["#399953", "#39cccc", "#555299", "#01ff70", "#ff851b", "#d81b60", "#005384", "#efa939", "#00a7d0"],
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
    },
    data: data
  }

  return (
    <>
      <CanvasJSChart options={options} />
    </>
  )
}
export const CanvasChart = React.memo(CanvasChartComp);