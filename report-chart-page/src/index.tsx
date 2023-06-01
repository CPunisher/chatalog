import { FunctionalComponent, render } from "preact";
import "./index.css";
import { ChartData } from "@chatalog/interface/chart";
import ModuleChart from "./ModuleChart";
import { useMemo } from "preact/hooks";
import ScoreChart, { ScoreData } from "./ScoreChart";

const App: FunctionalComponent<{
  // fileName -> ChartData
  data: Record<string, ChartData>;
}> = ({ data }) => {
  const scoreData = useMemo(() => {
    const result: ScoreData[] = Object.values(data)[0].map((entry) => ({
      templateName: entry.templateName,
      value: 0,
    }));
    for (const chartData of Object.values(data)) {
      for (const entry of chartData) {
        let flag = true;
        for (const other of chartData) {
          if (entry === other) continue;
          if (entry.value < other.value) {
            flag = false;
            break;
          }
        }
        if (flag) {
          result.find((sd) => sd.templateName === entry.templateName)!.value++;
        }
      }
    }
    return result;
  }, [data]);

  return (
    <div>
      <div>
        <h2>Score</h2>
        <ScoreChart data={scoreData} />
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
