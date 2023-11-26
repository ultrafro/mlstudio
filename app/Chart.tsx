import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  x?: number[];
  y?: number[];
}

const SimpleChart: React.FC<ChartProps> = ({
  x,
  y,
}: {
  x?: number[];
  y?: number[];
}) => {
  const realY = y ?? [];
  const realX = x ?? realY.map((_, i) => i);

  const data = {
    labels: realX,
    datasets: [
      {
        label: "Data",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: realY,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
      y: {
        // min: 0,
      },
      maintainAspectRatio: false,
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line
        data={data as any}
        width={"100%"}
        height={"100%"}
        options={options as any}
      />
    </div>
  );
};

export default SimpleChart;
