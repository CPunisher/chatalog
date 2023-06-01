import { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Column } from "@antv/g2plot";
import { ChartData } from "@chatalog/interface/chart";

function format(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

const ModuleChart: FunctionalComponent<{
  data: ChartData;
}> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const column = new Column(containerRef.current!, {
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
    column.render();
    return () => column.destroy();
  }, []);

  return <div ref={containerRef} />;
};

export default ModuleChart;
