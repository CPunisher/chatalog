import { FunctionalComponent, render } from "preact";
import "./index.css";
import { ChartData } from "@chatalog/interface/chart";
import ModuleChart from "./ModuleChart";

const App: FunctionalComponent<{
  // fileName -> ChartData
  data: Record<string, ChartData>;
}> = ({ data }) => {
  return (
    <div>
      <div>
        <h2>Score</h2>
      </div>
      {Object.entries(data).map(([fileName, chartData]) => (
        <div>
          <h2>{fileName}</h2>
          <ModuleChart data={chartData} />
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
