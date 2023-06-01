import { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Column } from "@antv/g2plot";

export interface ScoreData {
  templateName: string;
  value: number;
}

const ScoreChart: FunctionalComponent<{
  data: ScoreData[];
}> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const column = new Column(containerRef.current!, {
      data,
      xField: "templateName",
      yField: "value",
      meta: {
        value: {
          alias: "数量",
        },
      },
    });
    column.render();
    return () => column.destroy();
  }, []);

  return <div ref={containerRef} />;
};

export default ScoreChart;
