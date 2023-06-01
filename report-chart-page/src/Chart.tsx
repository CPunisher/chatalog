import { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Line } from "@antv/g2plot";
import { ChartData } from "@chatalog/interface/chart";

function format(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

const Chart: FunctionalComponent<{
  data: ChartData;
}> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const line = new Line(containerRef.current!, {
      data,
      xField: "templateName",
      yField: "value",
      yAxis: {
        label: {
          formatter: (v) => format(v as unknown as number),
        },
      },
      label: {
        content: (item) => format(item.value),
      },
    });
    line.render();
    return () => line.destroy();
  }, []);

  return <div ref={containerRef} />;
};

export default Chart;
