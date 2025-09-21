import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { COLORS } from "../../lib/constants";

export default function ModelYearChart({ data = [], isFiltered = false }) {
  const series = useMemo(() => {
    const counts = {};
    data.forEach((r) => {
      const y = r["Model Year"];
      if (y) counts[y] = (counts[y] || 0) + 1; // Increase count for occurence of year
    });
    return Object.entries(counts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year); // Ascending
  }, [data]);

  return (
    <div
      className={`bg-white p-4 rounded shadow transition-all
  ${isFiltered ? "ring-2 ring-blue-100" : ""}`}
    >
      <h3 className="text-sm font-medium mb-2">Model Year Distribution</h3>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={series}>
            <XAxis dataKey="year" name="Year" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} vehicles`, "Count"]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Bar dataKey="count" name="Count">
              {series.map((entry, idx) => (
                <Cell
                  key={`year-${entry.year}-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
