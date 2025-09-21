import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { COLORS } from "../../lib/colors";
import { MAX_MAKES_IN_CHART } from "../../lib/constants";

function TopMakesChartComp({ makesList = [], onSelectMake, selectedMake }) {
  // reverse for vertical chart so largest is top
  const chartData = makesList.slice().reverse();

  // if too many makes, render a scrollable list instead of chart
  if (makesList.length > MAX_MAKES_IN_CHART) {
    return (
      <div className="bg-white p-4 rounded shadow h-80 overflow-auto">
        <h3 className="text-sm font-medium mb-2">All Makes</h3>
        <div className="divide-y">
          {makesList.map((m) => (
            <div
              key={m.make}
              className="flex items-center justify-between p-2 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectMake && onSelectMake(m.make)}
                  className="text-sm font-medium text-slate-800"
                >
                  {m.make}
                </button>
              </div>
              <div className="text-sm text-slate-500">{m.count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // chart mode
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm font-medium mb-2">Top Makes</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart layout="vertical" data={chartData}>
            <XAxis type="number" />
            <YAxis dataKey="make" type="category" width={140} />
            <Tooltip />
            <Bar dataKey="count">
              {chartData.map((entry, idx) => {
                const isSelected = selectedMake && selectedMake === entry.make;
                const isDimmed = selectedMake && !isSelected;
                const fill = isSelected
                  ? COLORS[idx % COLORS.length]
                  : isDimmed
                  ? "#E6E9EE"
                  : COLORS[idx % COLORS.length];

                return (
                  <Cell
                    key={`cell-${entry.make}-${idx}`}
                    fill={fill}
                    cursor="pointer"
                    onClick={() => onSelectMake && onSelectMake(entry.make)}
                    style={{
                      transition: "all 150ms ease",
                      filter: isSelected
                        ? "brightness(0.95) saturate(1.05)"
                        : undefined,
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-slate-500">
        Tip: Click a make to filter the dashboard.
      </div>
    </div>
  );
}

export default React.memo(TopMakesChartComp);
