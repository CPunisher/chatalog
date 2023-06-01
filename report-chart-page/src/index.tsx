import { FunctionalComponent, render } from "preact";
import "./index.css";
import { ChartData } from "@chatalog/interface/chart";
import Chart from "./Chart";

const App: FunctionalComponent<{
  // fileName -> ChartData
  data: Record<string, ChartData>;
}> = ({ data }) => {
  return (
    <div>
      {Object.entries(data).map(([fileName, chartData]) => (
        <div>
          <h2>{fileName}</h2>
          <Chart data={chartData} />
        </div>
      ))}
    </div>
  );
};

function renderReportCharts(
  parentNode: Element,
  data: Record<string, ChartData>
) {
  render(<App data={data} />, parentNode);
}

export default renderReportCharts;
