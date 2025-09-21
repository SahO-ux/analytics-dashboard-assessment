import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

import { COLORS } from "../../lib/colors";
import { fmt } from "../../lib/constants";
import TooltipIcon from "../Common/TooltipIcon";

export default function EVTypePie({ data = [], isFiltered = false }) {
  const series = useMemo(() => {
    const counts = {};
    data.forEach((r) => {
      const t = r["Electric Vehicle Type"] || "Unknown";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const total = series.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      className={`bg-white p-4 rounded shadow transition-all
      ${isFiltered ? "ring-2 ring-blue-100" : ""}`}
    >
      <h3 className="text-sm font-medium mb-2">
        EV Type Breakdown{" "}
        <TooltipIcon text="Hover slices to see exact counts" />
      </h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={series}
              outerRadius={65}
              innerRadius={30}
              label={({ value }) => {
                const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${pct}%`;
              }}
            >
              {series.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                return [`${fmt.format(value || 0)} (${pct}%)`];
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
